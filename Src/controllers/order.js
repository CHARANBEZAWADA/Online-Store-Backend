const Order=require('../models/order')
const Product=require('../models/product')

exports.createOrder=async(req,res,next)=>{
    const {shippingInfo,
        orderItems,
        paymentInfo,
        taxAmount,
        ShippingAmount,
        totalAmount,}=req.body


        const order =await Order.create({
            shippingInfo,
        orderItems,
        paymentInfo,
        taxAmount,
        ShippingAmount,
        totalAmount,
        user:req.user._id

        })
        res.status.json({
            success:true,
            order
        })
}

exports.getOneOrder=async(req,res,next)=>{
       const order= Order.findById(req.params.id).populate('user','name email')
if(!order){
    return next(new Error('please check order id'))
}

        res.status.json({
            success:true,
            order
        })
}

