import { User } from "../models/userModel.js"
import { AsyncHandler } from '../utils/AsyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse    } from '../utils/ApirResponse.js';


//add product to user cart
const addToCart = AsyncHandler( async (req,res) => {
    try {
        const userId = req.user._id
        const {itemId,size} = req.body
        const userData = await User.findById(userId)
        let cartData = await userData.cartData
        if(cartData[itemId]){
            if(cartData[itemId][size]){
                cartData[itemId][size] += 1
            }
            else{
                cartData[itemId][size] = 1
            }
        }else{
            cartData[itemId] = {}
            cartData[itemId][size] = 1
        }

        await User.findByIdAndUpdate(userId,{cartData})
        // res.json({success:true,message:"Added to Cart"})
        return res.status(200).json(new ApiResponse(200,{cartData},"Added to Cart"))
    } catch (error) {
        console.log(error)
        // res.json({success:false,message:error.message})
        throw new ApiError(
            500,
            error.message
        )
    }
})

//update user cart
const updateCart = AsyncHandler( async (req,res) => {
    try {
        const userId = req.user._id
        const {itemId,size,quantity} = req.body
        const userData = await User.findById(userId)
        let cartData = await userData.cartData

        cartData[itemId][size] = quantity
        await User.findByIdAndUpdate(userId,{cartData})
        // res.json({success:true,message:"Cart Updated"})
        return res
        .status(200)
        .json(new ApiResponse(
            200,
            {cartData},
            "Cart Updated"
        ))

    } catch (error) {
        console.log(error)
        // res.json({success:false,message:error.message})
        throw new ApiError(
            500,
            error.message
        )
    }
})
//get user cart data
const  getUserCart = AsyncHandler( async (req,res) => {
    try {
        const userId = req.user._id
        if (!userId) {
            throw new ApiError(
                400,
                "User ID is required"
            )
        }
        const userData = await User.findById(userId);

        if (!userData) {
            throw new ApiError(
                404,
                "User not found"
            )
        }
        let cartData = await userData.cartData
        return res
        .status(200)
        .json(new ApiResponse(
            200,
            {cartData},
            "Cart data fetched successfully"
        ))
    } catch (error) {
        console.log(error)
        throw new ApiError(
            500,
            error.message
        )
    }
})

export {addToCart,updateCart,getUserCart}