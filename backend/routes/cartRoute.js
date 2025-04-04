import { Router } from "express"
import { addToCart,getUserCart,updateCart } from "../controllers/cartController.js"
import {verifyJWT} from "../middleware/authMiddleware.js"

const router = Router()

router.route("/get").get(verifyJWT,getUserCart);
router.route("/add").post(verifyJWT,addToCart);
router.route("/update").post(verifyJWT,updateCart);

export {router as cartRouter}

/* Add to cart
{
    "statusCode": 200,
    "data": {
        "cartData": {
            "67ee2782ecc36cbd1d642e4e": {
                "XL": 1
            }
        }
    },
    "message": "Added to Cart",
    "success": true
}
*/

/* Update cart 
{
    "statusCode": 200,
    "data": {
        "cartData": {
            "67ee2782ecc36cbd1d642e4e": {
                "XL": "5"
            }
        }
    },
    "message": "Cart Updated",
    "success": true
}
*/

/* Get user cart 
{
    "statusCode": 200,
    "data": {
        "cartData": {
            "67ee2782ecc36cbd1d642e4e": {
                "XL": 1
            }
        }
    },
    "message": "Cart data fetched successfully",
    "success": true
}
*/
