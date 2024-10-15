import express from 'express';
import multer from 'multer';
import { otpVerified, handleLogin, handleSignUp, Otpverify, verificationOTP ,newpass, getAllUsers, searchAllUser, updateUserStatus, deleteUserById, updateUser, uploadImage, getUsersList, getPassword} from '../controllers/userController.js'
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
router.route('/')
.post(handleSignUp)
.get(authenticateToken,getAllUsers)
.patch(updateUserStatus)

router.route('/:id')
.delete(deleteUserById)
.patch(updateUser)
router.route('/pass/:id')
.get(getPassword)   

router.route('/search/:key')
.get(searchAllUser)

router.route('/login')
.post(handleLogin)

router.route('/sendotp')
.post(verificationOTP);

router.route('/forget') 
.patch(otpVerified);

router.route('/otpverify')
.patch(Otpverify)

router.route('/newpass')
.patch(newpass)

router.route('/userList')
.get(authenticateToken,getUsersList)

const upload=multer({storage:multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./upload')
    },
    filename:function(req,file,cb){
        cb(null,Date.now()+'-'+file.originalname)
    }
  })})


router.route('/upload')
.post(upload.single('image'),uploadImage)


export default router;