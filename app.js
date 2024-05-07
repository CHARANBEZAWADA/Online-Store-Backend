const express =require('express')
const cookie=require('cookie-parser')
const app =express();


require('dotenv').config();


app.use(express.json())

//import all routes 
const home=require('./Src/routes/home')
const user=require('./Src/routes/user');
const product=require('./Src/routes/product')
const payment=require('./Src/routes/payment')
const order=require('./Src/routes/order')
//import middleware routes
app.use('/api',home)
app.use('/api',user)
app.use('/api',product)
app.use('/api',payment)
app.use('/api',order)

module.exports=app