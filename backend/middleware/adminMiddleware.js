import jwt from "jsonwebtoken"
import { ApiError } from "../utils/ApiError.js";

export const adminAuth = async (req,_,next) =>{
    try {
        // Check for token in Authorization header first, then cookies
        const token = req.header("Authorization")?.replace("Bearer ", "")
        
        if (!token) {
            throw new ApiError(
                401,
                "Authentication token not found"
            );
        }
        
        try {
            // Verify token with JWT secret
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            
            // Verify if the token contains admin role
            if(!decodedToken.isAdmin) {
                throw new ApiError(
                    401,
                    "Unauthorized"
                );
            }
            
            // Add the decoded token data to the request for use in routes
            // req.admin = decodedToken;
            next();
        } catch (jwtError) {
            console.log("JWT Error:", jwtError);
            throw new ApiError(
                401,
                "Invalid or expired token"
            );
        }
    } catch (error) {
        console.log("Admin Auth Error:", error);
        throw new ApiError(
            401,
            error.message || "Authentication failed"
        );
    }
}