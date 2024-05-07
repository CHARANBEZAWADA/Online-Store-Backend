const express = require('express');
const router = express.Router();

const {createOrder, getOneOrder} = require('../controllers/order');

router.post('/order/create',createOrder);//is loggedin
router.post('/order:id',getOneOrder);

module.exports=router

