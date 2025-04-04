import mongoose from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({
    username : {
        type:String,
        required:true,
        unique : true,
        lowercase :true,
        trim : true
    },
    fullname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    avatar : {
        type:String,
        required:true,
    },
    refreshToken : {
        type:String,
    },
    cartData:{
        type:Object,
        default:{}
    },
},{timestamps:true})

userSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        return next();
    }
    this.password = await bcrypt.hash(this.password,10);
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    // console.log(password,this.password);
    return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign({
        _id : this._id,
        email : this.email,
        username : this.username,
        fullname : this.fullname
    },process.env.ACCESS_TOKEN_SECRET,{
        expiresIn : process.env.ACCESS_TOKEN_EXPIRY
    })
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign({
        _id : this._id
    },process.env.REFRESH_TOKEN_SECRET,{
        expiresIn : process.env.REFRESH_TOKEN_EXPIRY
    })
}


export const User = mongoose.model("User",userSchema);

//The minimize option, when set to false, prevents Mongoose from automatically removing empty objects from documents. By default, Mongoose tries to minimize the size of documents by removing empty objects ({}).
//So, if you set { minimize: false }, Mongoose will retain any empty objects in the cartData field (or any other field of type Object). This could be useful if you want cartData to be an object that may sometimes be empty but you still want to keep the structure intact.