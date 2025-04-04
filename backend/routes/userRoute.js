import { Router } from "express"
import  { upload }  from "../middleware/multerMiddleware.js"
import { verifyJWT } from "../middleware/authMiddleware.js"
import { 
    loginUser,
    registerUser,
    logoutUser,
    refreshAcessToken,
    chnageCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    adminLogin
} from "../controllers/userController.js"

const router = Router();


/* /api/v1/users */
/* feilds accepts array  */

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }
    ]),
    registerUser
);

router.route("/login").post(loginUser);
router.route("/admin-login").post(adminLogin);

// Secured routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAcessToken); 
router.route("/change-password").post(verifyJWT, chnageCurrentPassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/update-account").patch(verifyJWT, updateAccountDetails);
router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar);

export { router as userRouter };


/* Register user
{
    "statusCode": 200,
    "data": {
        "user": {
            "_id": "67ed59bc8e86c4e1200cb804",
            "username": "apexavi",
            "fullname": "Avinash Verma",
            "email": "avinash@gmail.com",
            "avatar": "http://res.cloudinary.com/dojfug7t8/image/upload/v1743608246/uyykshmhowg9r1ptqf60.png",
            "createdAt": "2025-04-02T15:37:32.285Z",
            "updatedAt": "2025-04-02T15:37:33.077Z",
            "__v": 0
        }
    },
    "success": true
}
*/


/* Login user
{
    "statusCode": 200,
    "data": {
        "user": {
            "_id": "67ed59bc8e86c4e1200cb804",
            "username": "apexavi",
            "fullname": "Avinash Verma",
            "email": "avinash@gmail.com",
            "avatar": "http://res.cloudinary.com/dojfug7t8/image/upload/v1743608246/uyykshmhowg9r1ptqf60.png",
            "createdAt": "2025-04-02T15:37:32.285Z",
            "updatedAt": "2025-04-02T16:59:53.246Z",
            "__v": 0
        },
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2N2VkNTliYzhlODZjNGUxMjAwY2I4MDQiLCJlbWFpbCI6ImF2aW5hc2hAZ21haWwuY29tIiwidXNlcm5hbWUiOiJhcGV4YXZpIiwiZnVsbG5hbWUiOiJBdmluYXNoIFZlcm1hIiwiaWF0IjoxNzQzNjEzMTkzLCJleHAiOjE3NDM2OTk1OTN9.igaDMF-owhQiNqCfOYGC0HtzH74k7r5zdQq_Id2P85E",
        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2N2VkNTliYzhlODZjNGUxMjAwY2I4MDQiLCJpYXQiOjE3NDM2MTMxOTMsImV4cCI6MTc0MzY5OTU5M30.zWTXIjZX1Jq6KuMe1aaZsO-MQ5buBvzl0qWeBIex6NQ"
    },
    "message": "User logged in successfully",
    "success": true
}
*/

/* get user
{
    "statusCode": 200,
    "data": {
        "_id": "67ed768d3c07645e25adaef7",
        "username": "apexavi",
        "fullname": "Avinash Verma",
        "email": "avinash@gmail.com",
        "avatar": "http://res.cloudinary.com/dojfug7t8/image/upload/v1743615624/eyjwilijsfslldpe0aie.png",
        "createdAt": "2025-04-02T17:40:29.980Z",
        "updatedAt": "2025-04-02T17:40:38.008Z",
        "__v": 0
    },
    "message": "Current user fetched successfully",
    "success": true
}
*/

/* chnage password
{
    "statusCode": 200,
    "data": {},
    "message": "Password changed successfully",
    "success": true
}
*/

/* update profile
{
    "statusCode": 200,
    "data": {
        "_id": "67ed768d3c07645e25adaef7",
        "username": "apex_11_avi",
        "fullname": "Avinash Verma",
        "email": "avinash@gmail.com",
        "avatar": "http://res.cloudinary.com/dojfug7t8/image/upload/v1743615624/eyjwilijsfslldpe0aie.png",
        "createdAt": "2025-04-02T17:40:29.980Z",
        "updatedAt": "2025-04-02T17:46:27.730Z",
        "__v": 0,
        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2N2VkNzY4ZDNjMDc2NDVlMjVhZGFlZjciLCJpYXQiOjE3NDM2MTU2MzgsImV4cCI6MTc0NjIwNzYzOH0.TQFSUWQeIgmuvo-8e_M9e8yF7EB3tGWVf8-oi2mAJbQ"
    },
    "message": "Account details updated successfully",
    "success": true
}
*/

/*refresh acess token
{
    "statusCode": 200,
    "data": {},
    "message": "Refresh Acess token succesfully",
    "success": true
}
 */

/* update userAvatar
{
    "statusCode": 200,
    "data": {
        "_id": "67ed768d3c07645e25adaef7",
        "username": "apex_11_avi",
        "fullname": "Avinash Verma",
        "email": "avinash@gmail.com",
        "avatar": "http://res.cloudinary.com/dojfug7t8/image/upload/v1743616557/mkifbqntcggbif47yutt.png",
        "createdAt": "2025-04-02T17:40:29.980Z",
        "updatedAt": "2025-04-02T17:56:01.930Z",
        "__v": 0,
        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2N2VkNzY4ZDNjMDc2NDVlMjVhZGFlZjciLCJpYXQiOjE3NDM2MTY1MDMsImV4cCI6MTc0NjIwODUwM30.HJwXOJoop6pYTGocqtyuZIcOC1NGksY1sJ4uP5WNbsU"
    },
    "message": "Avatar image updated successfully",
    "success": true
}
*/

/* AdminLogin
{
    "statusCode": 200,
    "data": {
        "admintoken": "eyJhbGciOiJIUzI1NiJ9.YWRtaW5AZ21haWwuY29tcXdlcnQxMjM0NQ.1IFNvw1y36B9MjY-6VGb-yKAJoN-J-nwouuWpK1zlb8"
    },
    "message": "Admin logged in successfully",
    "success": true
}
*/
