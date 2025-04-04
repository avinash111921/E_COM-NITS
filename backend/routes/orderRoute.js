import { Router } from "express"
import {placeOrder,allOrders,userOrders,updateStatus} from '../controllers/orderController.js'
import { adminAuth } from "../middleware/adminMiddleware.js"
import { verifyJWT } from "../middleware/authMiddleware.js"

const router = Router();


//admin feature
router.route("/list").post(adminAuth,allOrders)
router.route("/status").post(adminAuth,updateStatus)

//payment feature

router.route("/place").post(verifyJWT,placeOrder)

//userFeature
router.route("/userorders").get(verifyJWT,userOrders)


export {router as orderRouter}