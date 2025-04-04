import React, { useContext } from 'react'
import {Routes,Route, Navigate} from 'react-router-dom'
import Home from './pages/Home'
import Collection from './pages/Collection'
import About from './pages/About'
import Contact from './pages/Contact'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Login from './pages/Login'
import PlaceOrder from './pages/Placeorder'
import Orders from './pages/Orders'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SearchBar from './components/SearchBar'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ChangePassword from './components/ChangePassword'
import UserProfile from "./components/UserProfile.jsx"
import Register from "./pages/Register.jsx"
import { AuthContext } from './context/AuthContext'


const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext)

  if (loading) {
      return <div>Loading...</div>;
  }

  return user ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
      <ToastContainer autoClose={3000} />
      <Navbar/>
      <SearchBar/>
      <Routes>
        <Route path ='/' element={<Home/>}/>
        <Route path ='/collection' element={<Collection/>}/>
        <Route path ='/about' element={<About/>}/>
        <Route path ='/contact' element={<Contact/>}/>
        <Route path ='/product/:productId' element={<Product/>}/>
        <Route path ='/login' element={<Login/>}/>
        <Route path ='/place-order' element={<PlaceOrder/>}/>
        <Route path ='/orders' element={<Orders/>}/>
        <Route path="/register" element={<Register />} />
        <Route 
        path ='/cart' 
        element={
          <ProtectedRoute>
            <Cart/>
          </ProtectedRoute>
          }
          />
        <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/change-password"
              element={
                <ProtectedRoute>
                  <ChangePassword />
                </ProtectedRoute>
              }
            />
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer/>
    </div>
  )
}

export default App
