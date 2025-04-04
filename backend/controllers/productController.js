import {Product} from "../models/productModel.js"
import { AsyncHandler } from '../utils/AsyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse    } from '../utils/ApirResponse.js';
import { uploadOnCloudinary,deleteFromCloudinary } from '../config/cloudinary.js';


//1.)add product
const addProduct = AsyncHandler( async (req,res) => {
    try {
        const {name,description,price,category,subCategory,sizes,bestseller} = req.body //gie in string format

        const image1 = req.files.image1 && req.files.image1[0]
        const image2 = req.files.image2 && req.files.image2[0]
        const image3 = req.files.image3 && req.files.image3[0]
        const image4 = req.files.image4 && req.files.image4[0]

        const images = [image1,image2,image3,image4].filter((item) => item !== undefined)

        // let imageUrl = await Promise.all(
        //     images.map(async (item) => {
        //         let result = await cloudinary.uploader.upload(item.path,{resource_type :"image"});
        //         return result.secure_url
        //     })
        // )

        let imageUrl = await Promise.all(
            images.map(async (item) => {
                let result = await uploadOnCloudinary(item.path)
                return result.secure_url
            })
        )

        const productData = {
            name,
            description,
            category,
            price:Number(price),
            subCategory,
            bestseller: bestseller === "true" ? true : false,
            sizes:JSON.parse(sizes),
            image:imageUrl,
            date:Date.now()
        }

        const product = new Product(productData)

        await product.save({validateBeforeSave:false})
        return res
        .status(200)
        .json(new ApiResponse(
            200,
            product,
            "Product Added"
        ))
    } catch (error) {
        console.log(error)
        return res
        .status(500)
        .json(new ApiError(
            500,
            "failed to add product"
        ))
    }
})


//2.)total product list
const listProducts = AsyncHandler(async (req,res) => {
    try {
        const products = await Product.find({});
        return res
        .status(200)
        .json(new ApiResponse(
            200,
            products,
            "Products fetched successfully"
        ))
    } catch (error) {
        console.log(error)
        return res
        .status(500)
        .json(new ApiError(
            500,
            "failed to fetch products"
        ))
    }
})

//3.)remove product
const removeProduct = AsyncHandler(async (req,res) => {
    try {
        const result = await Product.findByIdAndDelete(req.body)
        if(!result){
            throw new ApiError(
                404,
                "Product not found"
            )
        }
        try {
            if(result.image){
                result.image.forEach(async (image) => {
                    await deleteFromCloudinary(image)
                })
            }
        } catch (error) {
            console.log(error)
            throw new ApiError(
                500,
                "failed to delete images"
            )
        }
        return res
        .status(200)
        .json(new ApiResponse(
            200,
            {},
            "Product removed successfully"
        ))
    } catch (error) {
        console.log(error)
        return res
        .status(500)
        .json(new ApiError(
            500,
            "failed to remove product"
        ))
    }
})
//4.)single product detail
const singleProductinfo = AsyncHandler(async (req,res) => {
    try { 
        const {productId} = req.params
        const product = await Product.findById(productId)
        if(!product){
            throw new ApiError(
                404,
                "Product not found"
            )
        }
        return res
        .status(200)
        .json(new ApiResponse(
            200,
            product,
            "Product fetched successfully"
        ))
    } catch (error) {
        console.log(error)
        return res
        .status(500)
        .json(new ApiError(
            500,
            "failed to fetch product"
        ))
    }
})


export {addProduct,listProducts,removeProduct,singleProductinfo}