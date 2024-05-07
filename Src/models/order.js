const mongoose=require('mongoose')
const product=require('./product')
const user = require('./user')

const productSchema=new mongoose.Schema({

    shippingInfo:{
        address:{
            type:String,
            require:true
        },
        city:{
            type:String,
            require:true
        },
        phoneNo:{
            type:String,
            require:true
        },
        PinCode:{
            type:String,
            require:true
        },
        State:{
            type:String,
            require:true
        },
        
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        require:true,
    },
    orderItems:[
        {
            name:{
                type:String,
                require:true
            }, 
            quantity:{
                type:Number,
                require:true
            },
            Image:{
                type:String,
                require:true
            },
            price:{
                type:Number,
                require:true
            },
            product:{
                type:mongoose.Schema.ObjectId,
                ref:'Product',
                require:true
            },
        }
    ],
    paymentInfo:{
        id:{
            type:String,
        }
    },
    taxAmount:{
          type:Number,
          require:true
    },
    ShippingAmount:{
        type:Number,
        require:true
    },
    totalAmount:{
    type:Number,
    require:true
    },
    orderStatus:{
        type:String,
        default:'processing',
        require:true
    },
    deliveredAt:{
        type:Date
    },
    createdAt:{
        type:Date,
        default:Date.now
    }

})

module.exports=mongoose.model('product',productSchema)