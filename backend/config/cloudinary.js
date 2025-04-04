import {v2 as cloudinary} from "cloudinary"
import dotenv from "dotenv"
dotenv.config({
    path : "../.env"
});

const connectCloudinary = async () => {
    cloudinary.config({
        cloud_name : process.env.CLOUDINARY_NAME,
        api_key : process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_SECRET_KEY
    })
}

const uploadOnCloudinary = async (fileLocalPath) => {
    try {
        if(!fileLocalPath){
            return null;
        }
        const response = await cloudinary.uploader.upload(
            fileLocalPath,
            {
                resource_type : "auto"
            }
        )
        return response;
    } catch (error) {
        console.log("Error while uploading to Cloudinary",error);
        return null;
    }
}

const getPublicId = (url) => {
    const urlWithoutParams = url.split("?")[0];
    const part = urlWithoutParams.split("/")
    const publicIddWithExtension = part.pop()
    const publicId = publicIddWithExtension.split(".")[0];
    return publicId;
}

const deleteFromCloudinary = async (publicId) => {
    try {
        if(!publicId){
            return null;
        }
        const response  = await cloudinary.uploader.destroy(publicId)
        return response;
    } catch (error) {
        console.log("Error while deleting from Cloudinary",error);
        return null;
    }
}

export {connectCloudinary,uploadOnCloudinary,getPublicId,deleteFromCloudinary}