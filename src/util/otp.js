import nodemailer from 'nodemailer';

export const generateOTP=()=>{
    return Math.floor(1000 + Math.random() * 9000);
}

export const sendOTP =async(email,otp)=>{
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: 'rohandubliya@gmail.com',
            pass: 'pqse dqwp kvht foro'
        }
    })  

   const mailOptions={
    from: `'OTP Verification' <rohandubliya@gmail.com>`,
    to:email,
    subject: 'OTP',
    text: `Your OTP is ${otp} Login`,
    html: `<b>Your OTP is </b>${otp}`   
   }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
}

export const sendPassword =async(email,otp)=>{
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: 'rohandubliya@gmail.com',
            pass: 'pqse dqwp kvht foro'
        }
    })  

   const mailOptions={
    from: `'New Password' <rohandubliya@gmail.com>`,
    to:email,
    subject: 'Password',
    text: `Your password is ${otp} Login`,
    html: `<b>Your Password is </b>${otp}`   
   }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
}
export function generatePassword(length = 6) {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@&$";
    let password = "";
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      password += chars.charAt(randomIndex);
    }
  
    return password;
  }