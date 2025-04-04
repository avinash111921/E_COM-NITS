import jwt from "jsonwebtoken"
import {User}  from "../models/userModel.js"
import { ApiError } from "../utils/ApiError.js";

export const verifyJWT = async (req,_,next) =>{

   try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
     
    //  console.log("Token:", token);
     
     if (!token) {
         throw new ApiError(
             401,
             "Authentication token not found"
         );
     }

     const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    //  console.log("Decoded Token:", decodeToken);

     const user = await User.findById(decodeToken._id).select("-password");
     if (!user) {
         throw new ApiError(
             401,
             "User not found or invalid token"
         );
     }

    //  console.log(user);
     req.user = user;
     next();
   } catch (error) {
        // console.error("Auth error:", error);
        throw new ApiError(
            401,
            error.message || "Invalid or expired token"
        );
   }
}
