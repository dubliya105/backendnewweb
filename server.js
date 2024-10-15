import express from "express";
import dotenv from 'dotenv'
import bodyParser from "body-parser";
import cors from 'cors';
import Dbconnection from './src/config/dbconnection.js' 
import userRouter from "./src/routes/userRoute.js";
const app=express();

dotenv.config();
const url = process.env.MONGOURL;
const port=process.env.PORT || 3000;
Dbconnection(url);
app.use(cors());
app.use('/upload', express.static('upload'));

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
    
app.use('/api/user',userRouter);

app.listen(port,()=>{
    console.log(`server is running on port ${port}`)
})