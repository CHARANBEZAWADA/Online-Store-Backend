const express = require('express');
const router = express.Router();

const {SendRazorpayKey,sendStripeKey,CaptureRazorPayPayment,CaptureStripePayment}=require('../controllers/paymentController')
//loggedin for
router.get('/stripekey', sendStripeKey);
router.get('/razorpaykey',SendRazorpayKey);

router.get('/CaptureRazorPay',CaptureRazorPayPayment);
router.get('/CaptureStripe',CaptureStripePayment);


module.exports=router;