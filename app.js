const express =require('express')
const cookieParser=require('cookie-parser')
const fileUpload=require('express-fileupload')
const app =express();


require('dotenv').config();


app.use(express.json())

app.use(cookieParser())
app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:"/tmp/"
}))

//tmp check
app.set("view engine","ejs")
//import all routes 
const home=require('./Src/routes/home')
const user=require('./Src/routes/user');
const product=require('./Src/routes/product')
const payment=require('./Src/routes/payment')
const order=require('./Src/routes/order');
//import middleware routes
app.use('/api',home)
app.use('/api',user)
app.use('/api',product)
app.use('/api',payment)
app.use('/api',order)

app.get('/signuptest',(ewq,res)=>{
    res.render('signuptest')
})

module.exports=app