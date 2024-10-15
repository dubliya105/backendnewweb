import mongoose from "mongoose";

const mongooseConnection= (url)=>{
   mongoose.connect(url);
   console.log('DbConnected');
}

export default mongooseConnection;