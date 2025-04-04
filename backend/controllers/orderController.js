import {OrderModel} from "../models/orderModel.js";
import { User } from "../models/userModel.js";
import { AsyncHandler } from '../utils/AsyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApirResponse.js';

//global variable 
const currency = 'inr'
const deliveryCharges = 29



//placing order using COD method
const placeOrder = AsyncHandler( async (req,res) =>  {
    try {
        const userId = req.user._id;
        const {items,amount,address} = req.body;
        const orderData = {
            userId,
            items,
            amount,
            address,
            paymentMethod:"COD",
            payment:false,
            date:Date.now()
        }
        const newOder = new OrderModel(orderData)
        await newOder.save({validateBeforeSave:false})
        // sab hone ke baad cart clear karna ke liye
        await User.findByIdAndUpdate(userId,{cartData:{}})
        return res
        .status(200)
        .json(new ApiResponse(
            200,
            {newOder},
            "Order Placed"
        ))
    } catch (error) {
        console.log(error)
        throw new ApiError(
            401,
            error.message
        )
    }
})




//All order data for admin pannel

const allOrders = AsyncHandler(async (req,res) => {
    try {
        const orders = await OrderModel.find({})
        return res.status(200).json(new ApiResponse(
            200,
            orders,
            "All orders"
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

//user data for Forntend

const userOrders = AsyncHandler( async (req,res) => {
    try {
        const userId = req.user._id
        const orders = await OrderModel.find({userId})
        return res.status(200)
        .json(new ApiResponse(200,
            orders,
            "User orders fetch successfully"
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

//update order status from admin pannel
const updateStatus = AsyncHandler(async (req,res) => {
    try {
        const {orderId,status} = req.body
        await OrderModel.findByIdAndUpdate(orderId,{status})
        return res.status(200)
        .json(new ApiResponse(200,
            {},
            "Status updated successfully"
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


export {placeOrder,allOrders,userOrders,updateStatus}