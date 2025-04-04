import { Router } from "express"
import { addProduct,listProducts,removeProduct,singleProductinfo } from '../controllers/productController.js'
import  { upload }  from "../middleware/multerMiddleware.js"
import { adminAuth } from '../middleware/adminMiddleware.js'

const router = Router();

router.route("/add").post(upload.fields([
    {
        name: "image1",
        maxCount: 1
    },
    {
        name: "image2",
        maxCount: 1
    },
    {
        name: "image3",
        maxCount: 1
    },
    {
        name: "image4",
        maxCount: 1
    }
]),adminAuth,addProduct)

router.route('/list').get(listProducts)
router.route('/single/:productId').get(singleProductinfo)
router.route('/remove').post(removeProduct)

export { router as productRouter }

/* Add product 
{
    "statusCode": 200,
    "data": {
        "name": "Men Round Neck Pure Cotton T-shirt",
        "description": "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
        "price": 350,
        "image": [
            "https://res.cloudinary.com/dojfug7t8/image/upload/v1743620823/cjcti8ddivdgndwycnv6.png",
            "https://res.cloudinary.com/dojfug7t8/image/upload/v1743620824/hdgdiqzv3n5ps9g3mtq5.png",
            "https://res.cloudinary.com/dojfug7t8/image/upload/v1743620824/tckjt5wcw7ipulkmnr7o.png",
            "https://res.cloudinary.com/dojfug7t8/image/upload/v1743620823/uxpkovdvkgwfkdtq85vx.png"
        ],
        "category": "Men",
        "subCategory": "Topwear",
        "sizes": [
            "XL"
        ],
        "bestseller": true,
        "date": 1743620828783,
        "_id": "67ed8adced1ec8154e375879",
        "__v": 0
    },
    "message": "Product Added",
    "success": true
}
*/
/* list of all product 
{
    "statusCode": 200,
    "data": [
        {
            "_id": "67ada7e66bfa6876c55c4638",
            "name": "T-Shirt",
            "description": "Traditionally, it has short sleeves and a round neckline, known as a crew neck, which lacks a collar. T-shirts are generally made of stretchy, light, and inexpensive fabric and are easy to clean.",
            "price": 99,
            "image": [
                "https://res.cloudinary.com/dojfug7t8/image/upload/v1739433941/trjuldnhhuxotn1sotoo.png",
                "https://res.cloudinary.com/dojfug7t8/image/upload/v1739433941/pu6fnhwlkkejtjcv5kfb.png",
                "https://res.cloudinary.com/dojfug7t8/image/upload/v1739433941/uceqt7gyjraxfavndcnd.png",
                "https://res.cloudinary.com/dojfug7t8/image/upload/v1739433940/vqznyvasjmumdobqa2v5.png"
            ],
            "category": "Men",
            "subCategory": "Topwear",
            "sizes": [
                "S",
                "M",
                "L",
                "XL",
                "XXL"
            ],
            "bestseller": true,
            "date": 1739433958362,
            "__v": 0
        },
        {
            "_id": "67ed8adced1ec8154e375879",
            "name": "Men Round Neck Pure Cotton T-shirt",
            "description": "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
            "price": 350,
            "image": [
                "https://res.cloudinary.com/dojfug7t8/image/upload/v1743620823/cjcti8ddivdgndwycnv6.png",
                "https://res.cloudinary.com/dojfug7t8/image/upload/v1743620824/hdgdiqzv3n5ps9g3mtq5.png",
                "https://res.cloudinary.com/dojfug7t8/image/upload/v1743620824/tckjt5wcw7ipulkmnr7o.png",
                "https://res.cloudinary.com/dojfug7t8/image/upload/v1743620823/uxpkovdvkgwfkdtq85vx.png"
            ],
            "category": "Men",
            "subCategory": "Topwear",
            "sizes": [
                "XL"
            ],
            "bestseller": true,
            "date": 1743620828783,
            "__v": 0
        }
    ],
    "message": "Products fetched successfully",
    "success": true
}
*/

/* single product info
{
    "statusCode": 200,
    "data": {
        "_id": "67ada7e66bfa6876c55c4638",
        "name": "T-Shirt",
        "description": "Traditionally, it has short sleeves and a round neckline, known as a crew neck, which lacks a collar. T-shirts are generally made of stretchy, light, and inexpensive fabric and are easy to clean.",
        "price": 99,
        "image": [
            "https://res.cloudinary.com/dojfug7t8/image/upload/v1739433941/trjuldnhhuxotn1sotoo.png",
            "https://res.cloudinary.com/dojfug7t8/image/upload/v1739433941/pu6fnhwlkkejtjcv5kfb.png",
            "https://res.cloudinary.com/dojfug7t8/image/upload/v1739433941/uceqt7gyjraxfavndcnd.png",
            "https://res.cloudinary.com/dojfug7t8/image/upload/v1739433940/vqznyvasjmumdobqa2v5.png"
        ],
        "category": "Men",
        "subCategory": "Topwear",
        "sizes": [
            "S",
            "M",
            "L",
            "XL",
            "XXL"
        ],
        "bestseller": true,
        "date": 1739433958362,
        "__v": 0
    },
    "message": "Product fetched successfully",
    "success": true
}
*/

/* remove product
{
    "statusCode": 200,
    "data": {},
    "message": "Product removed successfully",
    "success": true
}
*/
