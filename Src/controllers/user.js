const mailhelper = require('../utils/mailhelper');
const user = require('../models/user');
const {generateForgotPasswordToken}=require("../models/user")
const User = require('../models/user');
const mongoose = require('mongoose');
const crypto=require('crypto');
const jwt=require('jsonwebtoken')
const { error } = require('console');
const cookie=require('cookie-parser')
const {getToken} = require("../middleware/user")

exports.signup = async (req, res, next) => {
   
    const { email, password, name } = req.body;
    console.log(req.body);
    if (!name || !password || !email) {
        return next(new Error(`please provide the name, password, and email`));
    }

    try {
        const user = await User.create({
            name,
            email,
            password
        });

        const token = user.generateJwtToken();
        const options = {
            expiresIn: Date.now() + 3 * 24 * 60 *60* 1000
        };
         user.password=undefined;
        res.status(201).cookie('token', token, options).json({
            success: true,
            token,
            user
        });
    } catch (error) {
        next(error); // Pass error to the error handling middleware
    }
};

exports.login=async(req,res,next)=>{
    const{email,password}=req.body

    //check for presence of email and password
    if(!email ||!password){
        return next(new Error('please provide email and password'))
    }
    const user=await User.findOne({email}).select('+password')

 if(!user){
        return next(new Error('email or  password is not match or doesnt exist'))
    }

    const isPasswordCorrect=await user.isvalidatedPassword(password)
    if(!password){
        return next(new Error('email or  password is not match or doesnt exist'))
    }
    const token = user.generateJwtToken();
    const options = {
        expiresIn:new Date( Date.now() + 3 * 24 * 60 *60* 1000),
        httpOnly:true,
    };
     user.password=undefined;
    res.status(201).cookie('token', token, options).json({
        success: true,
        token,
        user
    });
    
}

exports.logout=async(req,res,next)=>{
    res.cookie('token',null,{
        expiresIn:new Date(
            Date.now()
        ),
        httpOnly:true,
    })
    res.status(200).json({
        success:true,
        message:"logout succesfully"
    })
}

exports.forgotPassword = async (req, res, next) => {
    const {email}=req.body

    const User=await user.findOne({email})

    if(!User){
        return next (new Error('email not found'));
    }
    const forgotToken=generateResetToken()

    User.save({validateBeforeSave:false})

    const MyUrl=`${req.protocol}://${req.get('host')}/api/password/reset/${forgotToken}`
    console.log(MyUrl)

    const message=`copy paste this link in your url:\n ${MyUrl}`
console.log(message);
    try {
        await mailhelper({
            email:User.email,
            subject:"Online store -password reset mail",
            message:message,
            text:`${MyUrl}`
        });

        res.status(200).json({
            success:true,
            message:"message sent succesfully"
        })

    } catch (error) {
        User.forgotpasswordToken=undefined
        User.forgotpasswordExpiry=undefined
        await User.save({validateBeforeSave:false})

        return next(new Error(error.message))
    }

};

exports.PasswordReset = async (req, res, next) => {
    const {token}= req.params;

    try {
        const encrypToken = crypto
            .createHash('sha256')
            .update(token) // Use the provided token here
            .digest('hex');

        const user = await User.findOne({
            encrypToken,
            forgotpasswordExpiry: { $gt: Date.now() }
        });

        if (!user) {
            return next(new Error('Invalid or expired token'));
        }

        if (req.body.password !== req.body.confirmPassword) {
            return next(new Error('Password and confirm password do not match'));
        }

        // Update user's password and reset token
        user.password = req.body.password;
        user.forgotpasswordToken = undefined;
        user.forgotpasswordExpiry = undefined;

        await user.save();

        // Send a JSON response or send token
        const token = user.generateJwtToken();
        const options = {
            expiresIn: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly: true,
        };

        user.password = undefined;
        res.status(201).cookie('token', token, options).json({
            success: true,
            token,
            user
        });
    } catch (error) {
        return next(error);
    }
};

exports.getLoggedInDetails=async(req,res,next)=>{//error in moddleware
   try {
        const user = await User.findById(req.user.id);
        res.status(200).json({
            success: true,
            user 
        });
    } catch (error) {
        next(error); 
    }
} 

exports.changePassword=async(req,res,next)=>{
    const userId=req.user.id

   const user=await User.findById(userId).select('+password')

   const IsCorrectOldPassword=await user.isvalidatedPassword(req.body.oldpassword)

if(!IsCorrectOldPassword){
    return next(new Error('old password is incorrect'))
}

user.password=req.body.newPassword
await User.save()

const token = user.generateJwtToken();
    const options = {
        expiresIn:new Date( Date.now() + 3 * 24 * 60 *60* 1000),
        httpOnly:true,
    };
     user.password=undefined;
    res.status(201).cookie('token', token, options).json({
        success: true,
        token,
        user
    });
    

}


exports.updateuserdetails=async(req,res,next)=>{

    const newData={
        name:req.body.name,
        email:req.body.email
    }

const user=user.findByIdAndUpdate(req.user.id,newData,{
    new:true,
    runValidators:true,
    useFindAndModify:false
});

res.status(200).json({
    success:true,
    
})

    
}


exports.adminAllUsers=async(req,res,next)=>{
   const users=await User.find({});
   res.status(201).json({
    success:true,
    users

   })
}

function generateResetToken() {
    
    return (
      Math.random().toString(4).substring(2, 15) +
      Math.random().toString(4).substring(2, 15)
    );
  }
// const info=await getToken.sendMail(mailOptions)