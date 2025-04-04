import validator from 'validator';
import { User } from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import { AsyncHandler } from '../utils/AsyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse    } from '../utils/ApirResponse.js';
import { uploadOnCloudinary,deleteFromCloudinary } from '../config/cloudinary.js';

const generateAccessTokenAndRefreshToken = async(userId) => {
    try {
        const user = await User.findById(userId);
        if(!user){
            throw new ApiError(
                401,
                "User not found"
            )
        }
        const accessToken  = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave:false});

        return {accessToken,refreshToken};

    } catch (error) {
        throw new ApiError(
            500,
            "Failed to generate access token and refresh token"
        )
    }
}

const loginUser = AsyncHandler(async (req,res) => {
    try {
        const {email,password} = req.body;

        //check this email is exist in DB or not
        const user = await User.findOne({email});

        if(!user){
            throw new ApiError(
                401,
                "User not found"
            )
        }
        //if user exist
        const isPasswordValid = await user.isPasswordCorrect(password)
        //check password
        if(!isPasswordValid){
            throw new ApiError(
                401,
                "Invalid credential"
            )
        }
        
        const {accessToken,refreshToken} = await generateAccessTokenAndRefreshToken(user._id)
        const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

        const options = {
            httpOnly:true,
            secure:process.env.NODE_ENV === "production",
        }

        return res
        .status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",refreshToken,options)
        .json(new ApiResponse(
            200,
            {user : loggedInUser,accessToken,refreshToken},
            "User logged in successfully"
        ))

    } catch (error) {
        console.log(error)
        throw new ApiError(
            500,
            error.message
        )
    }
})

const registerUser = AsyncHandler( async (req,res) => {
    try {
        const {fullname,email,password,username} = req.body;
        if(!fullname || !email || !password || !username){
            throw new ApiError(
                400,
                "All fields are required"
            )
        }

        //validating email format and strong password
        if(!validator.isEmail(email)){
            throw new ApiError(
                400,
                "Please enter a valid email"
            )
        }
        if(password.length < 8){
            throw new ApiError(
                400,
                "Please generate strong password"
            )
        }

        //checking user already exist or not
        const existedUser = await User.findOne({email})
        if(existedUser){
            throw new ApiError(
                400,
                "User already exist"
            )
        }

        const avatarLocalPath = req.files?.avatar?.[0]?.path;

        let avatar;
        try {
            if(avatarLocalPath){
                avatar = await uploadOnCloudinary(avatarLocalPath)
            }
        } catch (error) {
            throw new ApiError(
                400,
                "Failed to upload avatar"
            )
        }

        const user = await User.create({
            username,
            fullname,
            email,
            password,
            avatar : avatar.url || ""
        })
        const {accessToken,refreshToken} = await generateAccessTokenAndRefreshToken(user._id)

        const createdUser = await User.findById(user._id).select("-password -refreshToken")
        if(!createdUser){
            throw new ApiError(
                400,
                "Failed to create user"
            )
        }
        const options = {
            httpOnly : true,
            secure : process.env.NODE_ENV === "production",
        }
        return res
        .status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",refreshToken,options)
        .json(new ApiResponse(
            200,
            {user : createdUser,accessToken,refreshToken}
        ))

    } catch (error) {
        throw new ApiError(
            400,
            error.message
        )
    }
})
 
const logoutUser = AsyncHandler(async(req,res) => {
    await User.findByIdAndUpdate(req.user._id,{
        $unset : {
            refreshToken : 1,
        }
    },{new : true})

    const options = {
        httpOnly : true,
        secure : process.env.NODE_ENV === "production",
    }
    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"User logout successfully"))
})

const refreshAcessToken = AsyncHandler(async (req,res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    if(!incomingRefreshToken){
        throw new ApiError(
            401,
            "unauthourized request"
        )
    }
    try {
        const decoded = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
        const user = await User.findById(decoded?._id).select("-password")
        if(!user){
            throw new ApiError(
                401,
                "Invalid refresh Token"
            )
        }

        if(incomingRefreshToken != user?.refreshToken){
            throw new ApiError(
                401,
                "Invalid or expire refresh Token"
            )
        }
        const {accessToken,newRefreshToken} = generateAccessTokenAndRefreshToken(user._id)
        await User.findByIdAndUpdate(user._id,{
            $set : {
                refreshToken : newRefreshToken
            }
        },{new : true})
        const options = {
            httpOnly : true,
            secure : process.env.NODE_ENV === "production",
        }
        return res
        .status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",newRefreshToken,options)
        .json(new ApiResponse(
            200,
            {accessToken,refreshToken : newRefreshToken},
            "Refresh Acess token succesfully"
        ))
    } catch (error) {
        throw new ApiError(
            401,
            error.message
        )
    }
})

const chnageCurrentPassword = AsyncHandler(async (req,res) => {
    const {oldPassword,newPassword} = req.body
    const user = await User.findById(req.user?._id)
    if(!user){
        throw new ApiError(
            401,
            "Invalid user"
        )
    }
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)
    if(!isPasswordCorrect){
        throw new ApiError(
            401,
            "Invalid password"
        )
    }
    user.password = newPassword
    await user.save({validateBeforeSave:false})
    return res.status(200)
    .json(new ApiResponse(
        200,
        {},
        "Password changed successfully"
    ))
})

const getCurrentUser = AsyncHandler(async(req,res) => {
    return res.status(200)
    .json(new ApiResponse(
        200,
        req.user,
        "Current user fetched successfully"
    ))
})

const updateAccountDetails = AsyncHandler(async (req, res) => {
    const { fullname, email, username } = req.body;
    // console.log(req.body)
    if (!fullname && !email && !username) {
        throw new ApiError(400, "At least one field is required for updating");
    }

    try {
        const updatedFields = {};
        if (fullname) updatedFields.fullname = fullname;
        if (email) updatedFields.email = email;
        if (username) updatedFields.username = username.toLowerCase(); // Keep username lowercase

        const user = await User.findByIdAndUpdate(
            req.user?._id,
            { $set: updatedFields },
            { new: true }
        ).select("-password");

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        return res.status(200).json(new ApiResponse(200, user, "Account details updated successfully"));
    } catch (error) {
        throw new ApiError(500, "An error occurred while updating account details");
    }
});


const updateUserAvatar = AsyncHandler(async (req,res) => {
    const avatarLocalPath = req.file?.path;

    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is missing");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    if(!avatar.url){
        throw new ApiError(400,"error while uploading Avatar")
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                avatar : avatar.url,
            },
        },{new : true}
    ).select("-password");

    const oldAvatarURL = req.user?.avatar
    const deleteOldAvatar = await deleteFromCloudinary(oldAvatarURL)
    if(!deleteOldAvatar){
        throw new ApiError(400,"Error while delete old avatar");
    }
    return res.status(200)
    .json(new ApiResponse(200,user,"Avatar image updated successfully"))
})

const adminLogin = AsyncHandler(async (req,res) => {
    try {
        const {email,password} = req.body
        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
            const admintoken = jwt.sign(
                { 
                    isAdmin: true,
                    email: process.env.ADMIN_EMAIL
                },
                process.env.JWT_SECRET,
                { expiresIn: '24d' }
            );

            const options = {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
            }

            return res
            .status(200)
            .cookie("admintoken",admintoken,options)
            .json(new ApiResponse(
                200,
                {admintoken},
                "Admin logged in successfully"
            ))
        }
        else{
            throw new ApiError(401,"Invalid credential") 
        }
    } catch (error) {
        console.log(error)
        throw new ApiError(500,"An error occurred while logging in")
    }
})

export {
    loginUser,
    registerUser,
    adminLogin,
    logoutUser,
    refreshAcessToken,
    chnageCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar
}