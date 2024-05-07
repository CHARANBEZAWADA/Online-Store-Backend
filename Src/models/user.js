const mongoose=require('mongoose')
const jwt=require('jsonwebtoken')
const crypto =require('crypto')
const bcrypt=require('bcryptjs')
const cookieParser = require('cookie-parser')


const userSchema=new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true,
        Select:false
    },
    role:{
        type:String,
        default:'user',
    },
    forgotpasswordToken:String,
    
    forgotpasswordExpiry:Date,
    createdAt:{
        type:Date,
        default:Date.now()
    },
})
userSchema.pre('save',async function(next){
    if(!this.isModified('password')){
    return next();
    }
    this.password=bcrypt.hash(this.password,10)
})

userSchema.methods.isvalidatedPassword=async function(usersendPassword){
    return await bcrypt.compare(this.password,usersendPassword)
},

userSchema.methods.generateJwtToken = function() {
    return jwt.sign(
        { id: this._id },
        process.env.JWT_SECRET, 
        { expiresIn: process.env.EXPIRES_IN }
    );
};

userSchema.methods.getToken=async function() {
    // Generating a random long bites
    const forgotToken = crypto.randomBytes(20).toString('hex');
    
    // Getting a hash - make sure to get a hash on
    this.forgotpasswordToken = crypto.createHash('sha256').update(forgotToken).digest('hex');

    // Time of token
    this.forgotpasswordExpiry = Date.now() + 20 * 60 * 1000;

    // Returning the generated token
    return forgotToken;
};
userSchema.methods.generateForgotPasswordToken = async function() {
    const token = crypto.randomBytes(20).toString('hex');
    this.forgotpasswordToken = token;
    return token;
};



module.exports=mongoose.model('User',userSchema)