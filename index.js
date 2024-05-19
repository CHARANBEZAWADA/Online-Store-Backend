const app = require('./app');
const connectwithdb = require('./config/db');
require('dotenv').config();
const cloudinary=require('cloudinary')
//connect wuth db
connectwithdb()

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET

})

app.listen(process.env.PORT,(req,res)=>{
    console.log(`server is connected at port:${process.env.PORT}`);
})