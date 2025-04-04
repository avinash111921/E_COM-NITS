import { createContext, useEffect, useState, useContext } from "react";
// import { products } from "../assets/assets";
import { toast } from "react-toastify";
import {useNavigate} from 'react-router-dom'
import {axiosInstance} from "../utils/axiosInstance.js"

export const ShopContext = createContext()

export const useShopContext = () => {
    const context = useContext(ShopContext);
    if (!context) {
        throw new Error('useShopContext must be used within a ShopContextProvider');
    }
    return context;
};

const ShopContextProvider = (props) => {

    const currency = '₹ ';
    const delivery_fee = 29;
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4001';

    const [search,setSearch] = useState('')
    const [showSearch,setShowSearch] = useState(false)
    const [cartItem,setCartItem] = useState({})
    const [products,setProducts] = useState([])
    const [token,setToken] = useState("")
    const navigate = useNavigate()


    const addToCart = async (itemId,size) =>{
        if(!size){
            toast.error('Select Product size');
            return;
        }
        // let cartData = structuredClone(cartItem) //copy of cartItem
        // if(cartData[itemId]){
        //     if(cartData[itemId][size]){
        //         cartData[itemId][size] += 1
        //     }
        //     else{
        //         cartData[itemId][size] = 1;
        //     }
        // }
        // else{
        //     cartData[itemId] = {};
        //     cartData[itemId][size] =1;
        // }
        // // console.log(cartData);
        // setCartItem(cartData)

        if(token){
            try {
                const response = await axiosInstance.post("/cart/add",{itemId,size})
                if(response.data.success){
                    setCartItem(response.data.data.cartData)
                }
            } catch (error) {
                console.log(error)
                toast.error(error.message)
            }
        }
    }


    const getCartCount = () =>{
        let totalCount = 0;
        for(const items in cartItem){ //items--> itemId 
            for(const item in cartItem[items]){ //item --->size
                try {
                    if(cartItem[items][item] > 0){
                        totalCount += cartItem[items][item]
                    }
                } catch (error) {
                    console.log(error);
                    toast.error(error.message);
                }
            }
        }
        return totalCount;
    }

    const updateQuantity = async (itemId,size,quantity) => {
        // let cartData = structuredClone(cartItem);
        // cartData[itemId][size] = quantity; //cartData.itemId.size = quantity
        // setCartItem(cartData);
        if(token){
            try {
                const response = await axiosInstance.post("/cart/update",{itemId,size,quantity})
                if(response.data.success){
                    setCartItem(response.data.data.cartData)
                }
            } catch (error) {
                toast.error(error.message)
            }
        }
    }

    const getCartAmount = () => {
        let totalAmount =0 ;
        for(const items in cartItem){
            let itemInfo = products.find((product) => product._id === items);
            if (!itemInfo) continue; // Skip if product is not found
            for(const item in cartItem[items]){ //cartItem.items -> item -> size;
                try {
                    if(cartItem[items][item] > 0){
                        totalAmount += itemInfo.price * cartItem[items][item]
                    }
                } catch (error) {
                    console.log(error);
                    toast.error(error.message);
                }
            }
        }
        return totalAmount
    }

    const getProductData = async () =>{
        try {
            const response = await axiosInstance.get("/product/list")
            // console.log(response.data)
            if(response.data.success){
                setProducts(response.data.data)
            }else{
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
    }

    const getUserCart = async (token) => {
        try {
            // console.log(token)
            const response = await axiosInstance.get("/cart/get",{headers:{token}})
            if(response.data.success){
                setCartItem(response.data.data.cartData)
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
    }

    const getProduct = async (productId) => {
        try {
            const response = await axiosInstance.get("/product/single/${productId}")
            if(response.data.success){
                return response.data.data
            }else{
                toast.error(response.data.message)
                return null;
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message)
            return null;
        }
    }

    useEffect(()=>{
        getProductData()
    },[])

    useEffect(() => {
        if(!token && localStorage.getItem('token')){
            setToken(localStorage.getItem('token'))
            getUserCart(localStorage.getItem('token'))
        }
    },[])

    const value = {
        products,currency,delivery_fee,
        search,setSearch,showSearch,setShowSearch,cartItem,addToCart,getCartCount,updateQuantity,getCartAmount,navigate,backendUrl,setToken,token,setCartItem,getProduct
    }
    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}
export default ShopContextProvider;
