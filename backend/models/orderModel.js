import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
    userId : {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required :true
    },
    items : {
        type:Array,
        required :true
    },
    amount : {
        type:Number,
        required :true
    },
    address : {
        type:Object,
        required :true
    },
    status : {
        type:String,
        required :true,
        default:"Order Placed"
    },
    paymentMethod : {
        type:String,
        required :true
    },
    payment : {
        type:Boolean,
        required :true,
        default:false
    },
    date : {
        type:Number,
        required :true
    },
})

export const OrderModel = mongoose.model("OrderModel",orderSchema);