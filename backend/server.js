import express from "express";
import cors from 'cors';
import 'dotenv/config'
import connectDB from "./config/mongodb.js";
import { connectCloudinary } from "./config/cloudinary.js";
import cookieParser from "cookie-parser"
import {userRouter} from "./routes/userRoute.js";
import {productRouter} from "./routes/productRoute.js";
import {cartRouter} from "./routes/cartRoute.js"
import {orderRouter} from './routes/orderRoute.js'
//App config
const app = express()
const port = process.env.PORT || 4001
connectDB()
connectCloudinary()

//middleware
app.use(express.json())
app.use(cors())
app.use(cookieParser())

//api endPoints
app.use('/api/v1/user',userRouter)
app.use('/api/v1/product',productRouter)
app.use('/api/v1/cart',cartRouter)
app.use('/api/v1/order',orderRouter)

// app.get('/',(req,res)=>{
//     res.send("API WORKING")
// })

app.listen(port,()=> console.log('Server started on PORT : '+port))