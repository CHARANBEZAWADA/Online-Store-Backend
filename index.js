const app = require('./app');
const connectwithdb = require('./config/db');
require('dotenv').config();
//connect wuth db
connectwithdb()


app.listen(process.env.PORT,(req,res)=>{
    console.log(`server is connected at port:${process.env.PORT}`);
})