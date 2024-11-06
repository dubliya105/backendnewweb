import User from "../models/userModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto'
import dotenv from 'dotenv';
import { generateOTP,sendOTP,sendPassword,generatePassword } from "../util/otp.js";
import { encryptPassword,decryptPassword } from "../util/authPass.js";
dotenv.config();
import { v2 as cloudinary } from 'cloudinary'; //  Import Cloudinary library
import fs from 'fs';

// Cloudinary configuration
cloudinary.config({
    cloud_name: 'dreyhiqqx',
    api_key: '934871486974851',
    api_secret: 'f2S_QeZfcTuhJ4pbh0J-7t9gGzs',
  });

export const handleSignUp= async (req,res)=>{
    try {
        const {name,email,password,confirmPassword,isverify,image}=req.body;
        const user = await User.findOne({email,isverify:true});
        if(user){
            res.status(400).json({msg:"Email already exist",status:'failed'})
        }
        else{
            const otp =generateOTP();
            sendOTP(email,otp);
            if(password===confirmPassword){
                    const result = await User.create({
                        name,
                        email,
                        password: encryptPassword(password),
                        otp,
                        isverify:isverify,
                        image:image
                    })
                    res.status(201).json({msg:"User created successfully",status:'success',error:{},result})
            }
            else{
                res.status(400).json({msg:"Password and confirm password do not match",status:'failed'})
            }
        }
    } catch (error) {
        res.status(400).json({msg:error.message,status:'failed'})
    }
}
export const getAllUsers =async (req,res)=>{
    try {
        const user = await User.find({});
        res.status(200).json({msg:'Success',data:user});
    } catch (error) {
        res.status(400).json({msg:error.message,status:'failed',data:{}})                 
    }
}

export const searchAllUser =async (req,res)=>{
    try {
        const key=req.params.key;

          
        const offset = parseInt(req.query.offset) || 0;
        const limit = parseInt(req.query.limit) || 3;
        const skip = (offset-1 ) * limit;
        const count = await User.countDocuments({});
        const results = await User.find({
            $or: [
                { name: { $regex: key.trim() ,$options: 'i'} },
                { email: { $regex: key.trim() ,$options: 'i'} },
            ]       
        }).skip(skip).limit(limit);
        res.status(200).json({msg:'Success',data:results,totalPages: Math.ceil(count / limit)});
    } catch (error) {
        res.status(400).json({msg:error.message,status:'failed',data:{}})                 
    }
}

export const handleLogin =async (req,res)=>{
    try {
        const {email,password}=req.body;
        const sckret_key=process.env.SCKRET_KEY;
        const user = await User.findOneAndUpdate({email,isverify:true,status:true},{$set:{lastLogin:new Date()}});
        if(user){
            const isUser =decryptPassword(user.password)===password;
            if(isUser){  
                const token =jwt.sign({user},sckret_key,{expiresIn:'1d'})   
                res.status(200).json({msg:'Login success',data:{user,token}});
            }
            else{
                res.status(400).json({msg:'Invalid password',status:'failed'})
            }
        }else{
            res.status(400).json({msg:"user not found",status:'failed'})
        }
        
    } catch (error) {
        res.status(400).json({msg:error.message,status:'failed'})                 
    }
}


export const Otpverify=async(req,res)=>{
    console.log('hjgfjhsdf');

        const {otp}=req.body;
        const user = await User.findOne({otp});
        console.log(user,'hjgfjhsdf');

        if(user){
            const result = await User.updateOne({otp},{$set:{isverify:true}})
            const password =generatePassword();

            sendPassword(user.email,password);
            const re = await User.updateOne({email:user.email},{password:encryptPassword(password)})

            res.status(200).json({msg:'OTP verified',data:{result},status:'success'});
        }else{
            res.status(400).json({msg:'Invalid OTP',status:'failed'})
        }
      
}


export const verificationOTP=async(req,res)=>{
    try {
        const {email}=req.body;
        console.log(req.body);
        
        const otp=generateOTP();
        const user = await User.findOne({email});
        console.log(user,email);
        console.log(user);
        
        if(!user){
            res.status(400).json({msg:"user not found",status:'failed'});
        }
       else{
        const result =await User.updateOne({email:user.email},{$set:{otp:otp}});
        sendOTP(email,otp);
       
       res.status(200).json({msg:'OTP sent successfully',data:result,status:'success'});
       
}
    } catch (error) {
        console.log('jhgsdf',error);
        
        res.status(400).json({msg:error,status:'failed'})
    }
}


export const otpVerified =async(req,res)=>{
    try {
        const {otp} =req.query;
        const user=await User.findOne({otp});
        console.log(user);
        
        if(user){
            res.status(200).json({msg:'otp verify success',status:'success',data:user})
        }   
    } catch (error) {
        console.log(error,':::verifi');
        
        res.status(400).json({msg:error,status:'failed'})
    }
}


export const newpass =async(req,res)=>{
    try {
        const {email,password,confirmPassword} =req.body;
        if(password===confirmPassword){
        const hashPassword= await bcrypt.hash(password,10);
        const user=await User.findOne({email});
            if(user){
                const result = await User.updateOne({email},{$set:{password:hashPassword}})
                res.status(200).json({msg:'changed',status:'success',data:user})
            }else{
                res.status(400).json({msg:'user not found',status:'failed'})
            }
        }else{
            res.status(400).json({msg:'password not match',status:'failed'})
        }
    } catch (error) {
        res.status(400).json({msg:error,status:'failed'})
    }
}

export const updateUserStatus =async (req,res)=>{
    try {
        const {status,id} = req.body;
        const user = await User.findOneAndUpdate({_id:id},{$set:{status}});
        res.status(200).json({msg:'Success',data:user});
    } catch (error) {
        res.status(400).json({msg:error.message,status:'failed',data:{}})                 
    }
}

export const deleteUserById =async (req,res)=>{
    try {
        const {id} = req.params;

        const user = await User.findOneAndDelete({_id:id});
        res.status(200).json({msg:'Success',data:user});
    } catch (error) {
        res.status(400).json({msg:error.message,status:'failed',data:{}})                 
    }
}

export const updateUser=async(req,res)=>{
    try {
        console.log();
        
        const {name,email}=req.body;
        const {id}=req.params; 
        const result = await User.findByIdAndUpdate({_id:id},{$set:{
            name,
            email,
        }})
        res.status(200).json({msg:"User updated successfully",status:'success',error:{},result})
    } catch (error) {
        res.status(400).json({msg:error.message,status:'failed'})
    }
   
}

export const uploadImage = async(req,res)=>{
    try {
        // Upload the file to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path , {
            folder:'upload'
         });
         // Delete the local file after a successful upload  
            fs.unlink(req.file.path,(error)=>{
                if(error){
                    console.log(error)
                    return
                }
                    console.log('file deleted')
            })
            res.status(200).json({msg:'success',data:result.secure_url})
    }
    catch (error) {
       
        res.status(400).json({msg:error,status:'failed',data:{}})
    }
}


export const getUsersList =async (req,res)=>{
    try {
        const offset = parseInt(req.query.offset) || 0;
        const limit = parseInt(req.query.limit) || 3;
        const skip = (offset-1 ) * limit;
        const user = await User.find({}).skip(skip).limit(limit);
        const count = await User.countDocuments({});

        res.status(200).json({msg:'Success',data:user,totalPages: Math.ceil(count / limit)});
    } catch (error) {
        console.log(error);
        res.status(400).json({msg:error,status:'failed',data:{}})                 
    }
}
//-----------------------------------------------------Password--------------------------------------------

export const getPassword=async(req,res)=>{
    try {
        const {id}=req.params;
        const user = await User.findOne({_id:id});
        
        const dePassword=decryptPassword(user.password);
        res.status(200).json({msg:'success',status:'success',data:dePassword})
    } catch (error) {
        res.status(400).json({msg:error.message,status:'failed',data:{}})  
    }
}




