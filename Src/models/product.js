const mongoose=require('mongoose')
const user = require('./user')
const productSchema=new mongoose.Schema({

    name:{
        type:String,
        require:[true,'please provide the product name'],
        trim:true,//removing the extra spaces at end
        maxlength:[120,'product name should not be more than 120 char']
    },
    price:{
        type:Number,
        require:[true,'please provide the product details'],
        maxlength:[5]
    }, 
    Description:{
        type:String,
        require:[true,'please provide the product description'],
    },
    Photos:[
        {
            id:{
                type:String,
                require:true
            },
            secure_url:{
                type:String,
                require:true
            },
        }
    ],
    category:{
        type:String,
        require:[true,'please select the category from short-sleves,long-sleves,sweat-shirts,hoodies'],
        enum:{
            values:['short-sleves','long-sleves','sweat-shirts','hoodies'],
            message:'please select the category only from short-sleves,long-sleves,sweat-shirts,hoodies',
        }
    },
    Brand:{
        type:String,
        require:true

    },
   ratings:{
        type:Number,
        default:0
    },
    numberOfReviews:{
        type:Number,
        default:0
    },
    reviews:[
        {
            user:{
                type:mongoose.Schema.ObjectId,
                ref:'User',
                require:true
            },
            name:{
                type:String,
                require:true
            },
            rating:{
                type:Number,
                require:true
            },
            comment:{
                type:String,
                require:true
            }
        }
    ],
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        require:true
    },
    createdAt:{
        type:Date,
        default:Date.now,
    }
    





})

module.exports=mongoose.model('Product',productSchema)