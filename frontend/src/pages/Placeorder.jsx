import React, { useContext, useState } from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
// import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import { axiosInstance } from "../utils/axiosInstance.js";

const Placeorder = () => {
  const [method,setMethod] = useState('cod')
  const {navigate,token,cartItem,setCartItem,getCartAmount,delivery_fee,products} = useContext(ShopContext)
  const [formData,setFormData] = useState({
    firstName:'',
    lastName:'',
    email:'',
    street:'',
    city:'',
    state:'',
    zipcode:'',
    country:'',
    phone:'',
  })

  const onChangeHandler = (event) =>{
    const name = event.target.name;
    const value = event.target.value;
    setFormData(data => ({...data,[name]:value}))
  }
  const onSubmitHandler = async (event) => {
    event.preventDefault()
    try {
      let orderItems = []
      for (const items in cartItem){
        for(const item in cartItem[items]){
          if(cartItem[items][item] > 0){
            const itemInfo = structuredClone(products.find(product => product._id === items))
            if(itemInfo){
              itemInfo.size = item
              itemInfo.quantity = cartItem[items][item]
              orderItems.push(itemInfo)
            }
          }
        }
      }
      // console.log(orderItems);
      let orderData = {
        address : formData,
        items : orderItems,
        amount:getCartAmount() + delivery_fee
      }

      switch(method){
        //API CALL FOR COD
        case 'cod' :
          const response = await axiosInstance.post('/order/place',orderData,{headers:{token}})
          // console.log(response.data);
          if(response.data.success){
            setCartItem({})
            navigate('/orders')
          }else{
            toast.error(response.data.message)
          }
        break;

      default:
          break;
      }
      
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }
  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t">
      {/* left side */}
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px] ">
        <div className="text-xl sm:text-2xl my-3">
          <Title text1={"DELIVERY"} tetx2={"INFORMATION"} />
        </div>
        <div className="flex gap-3">
          <input required onChange={onChangeHandler} name = "firstName" value={formData.firstName}
            type="text"
            className="border border-gray-300 rounded py-1.5 w-full"
            placeholder="first name"
          />
          <input required  onChange={onChangeHandler} name = "lastName" value={formData.lastName}
            type="text"
            className="border border-gray-300 rounded py-1.5 w-full"
            placeholder="Last name"
          />
        </div>
        <input required  onChange={onChangeHandler} name = "email" value={formData.email}
          type="email"
          className="border border-gray-300 rounded py-1.5 w-full"
          placeholder="Email addess"
        />
        <input required  onChange={onChangeHandler} name = "street" value={formData.street }
          type="text"
          className="border border-gray-300 rounded py-1.5 w-full"
          placeholder="Street"
        />
        <div className="flex gap-3">
          <input required  onChange={onChangeHandler} name = "city" value={formData.city}
            type="text"
            className="border border-gray-300 rounded py-1.5 w-full"
            placeholder="City"
          />
          <input required  onChange={onChangeHandler} name = "state" value={formData.state}
            type="text"
            className="border border-gray-300 rounded py-1.5 w-full"
            placeholder="State"
          />
        </div>
        <div className='flex gap-3'>
          <input required  onChange={onChangeHandler} name = "zipcode" value={formData.zipcode} type="number" className='border border-gray-300 rounded py-1.5 w-full' placeholder='PIN CODE' />
          <input  required onChange={onChangeHandler} name = "country" value={formData.country} type="text" className='border border-gray-300 rounded py-1.5 w-full' placeholder='Country' />
        </div>
          <input  required onChange={onChangeHandler} name = "phone" value={formData.phone} type="number" className='border border-gray-300 rounded py-1.5 w-full' placeholder='Phone Number' />
      </div>
      {/* right side */}
      <div className="mt-8">
        <div className="mt-8 min-w-80">
          <CartTotal/>
        </div>

        <div className="mt-12">
          <Title text1={"PAYMENT"} text2={"METHOD"}/>
          {/* pyment selcection method */}
          <div className="flex gap-3 flex-col lg:flex-row">
            <div onClick={() => setMethod('cod')} className="flex items-center gap-3 border p-2 px-3 cursor-pointer">
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod'? 'bg-green-500':''}`}></p>
              <p className="text-gray-500 text-sm font-medium mx-4">CASH ON DELIVERY</p>
            </div>
          </div>
          <div className="w-full text-end mt-8">
            <button type="submit" className="bg-black text-white px-16 p-3 text-sm">PLACE ORDER</button>
          </div>
        </div>
      </div>
    </form>
  );
};
export default Placeorder;