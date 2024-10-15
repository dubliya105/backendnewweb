import mongoose from "mongoose";

const userSchema =new mongoose.Schema({
    name:{
        type:String,
        require:true,
    },
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true,
    },
    otp:{
        type:String,
        default:null
    },
    isverify:{
        type:Boolean,
        default:false
    },
    status:{
        type:Boolean,
        default:true
    },
    image:{
        type:String,
    }
},{
    timestamps:true
});

 const User = mongoose.model('Users', userSchema);
 export default User;