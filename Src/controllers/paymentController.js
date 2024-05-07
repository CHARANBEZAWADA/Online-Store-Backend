// const { default: orders } = require('razorpay/dist/types/orders')

const stripe=require('stripe')(process.env.STRIPE_SECRET)

exports.sendStripeKey=async(req,res,next)=>{
    res.status(200).json({
        stripekey:process.env.STRIPE_API_KEY,
    })

}

exports.CaptureStripePayment=async(req,res,next)=>{
    const paymentIntent=await stripe.paymentIntents.create({
        amont:req.body.amount,
        currency:'inr',


        //optional
        metadata:{integration_check:'accept_a_payment'}
    })


    res.status(200).json({
        success:true,
        amount:req.body.amount,
        client_secret:paymentIntent.client_secret
    })
}


exports.SendRazorpayKey=async(req,res,next)=>{
   
    res.status(200).json({
        stripekey:process.env.RAZORPAY_API_KEY,
    })
}


exports.CaptureRazorPayPayment=async(req,res,next)=>{
    var instance = new Razorpay({ 
        key_id: process.env.RAZORPAY_API_KEY,
        key_secret:process.env.RAZORPAY_SECRET
     })

     var options={
        amount:req.body.amount,
        currency:"INR",
        // receipt:"" nanoid
     }

    const myOrder=await instance.orders.create(options);

    res.status(200).json({
      success:true,
      order:myOrder
    })
  
}
