const express=require('express')
const router=express.Router();


const {signup,login,logout,forgotPassword,PasswordReset,getLoggedInDetails,changePassword,updateuserdetails,adminAllUsers}=require('../controllers/user');
const { loggedIn } = require('../middleware/user');




router.post('/signup',signup)
router.get('/login',login)
router.get('/logout',logout)
router.get('/forgotPassword',forgotPassword)
router.get('/password/reset/:token',PasswordReset)
router.get('/userdashboard',loggedIn,getLoggedInDetails)
router.get('/password/update',loggedIn,changePassword)
router.get('/userdashboard/update',loggedIn,updateuserdetails)
router.get('/admin/users',loggedIn,adminAllUsers)

module.exports=router;