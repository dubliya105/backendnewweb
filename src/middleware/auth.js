import dotenv from 'dotenv'
import jwt  from 'jsonwebtoken';
dotenv.config();


export const authenticateToken= async(req,res,next)=>{
  try {
  const authHeader = req.headers['authorization'];    
  const token =  authHeader.split(' ')[1];
  
  if(!token){
    return res.status(401).json({message:'Access denied. No token provided.'});
  }

  const data=jwt.verify(token,process.env.SCKRET_KEY)
  if(data){
    next()
  }
  } catch (error) {
   
       if (error.message === 'jwt expired')  {
        return res.status(401).json({ msg: 'Token has expired. Please log in again.' });
      }
      // Handle other errors
      console.log(error);
      
      return res.status(403).json({ msg: 'Invalid token.',error });
    }
  
}
