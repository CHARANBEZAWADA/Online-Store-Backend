const mongoose=require('mongoose')



const connectwithdb=()=>{
mongoose.connect(process.env.DB_url,{
    // useNewUrlParser:true,
    // useUnifiedTopology:true,
})
    .then(console.log(`Db CONNECTED SUCCESFULLY`))
    .catch(error=>{
        console.log(`DB connection issues`);
        console.log(error)
        process.exit(1)
    })
}


module.exports=connectwithdb