const express = require('express');
const router = express.Router();
// const { isLoggedIn } = require('../middleware/user'); 

const { addProduct, getAllProduct,AdminGetAllProducts,getOneProduct,adminUpdateProduct,adminDeleteProduct,addReview,DeleteReview,getOnlyReviewsForOneProduct} = require('../controllers/product');

// User routes
router.get('/product', getAllProduct);
// Admin routes
router.post('/admin/product/add', addProduct); //middleware problem
router.get('/admin/products',AdminGetAllProducts );
router.post('/product/:id', getOneProduct);
router.put('/admin/product/:id', adminUpdateProduct);
router.delete('/admin/product/:id', adminDeleteProduct);//is logged in
router.put('/review', addReview);
router.delete('/review', DeleteReview);
router.post('/reviews', getOnlyReviewsForOneProduct);

module.exports = router;
// adminUpdateProduct