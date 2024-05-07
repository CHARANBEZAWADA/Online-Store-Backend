// exports.testproduct=(req,res)=>{
//     console.log(req.query);
//     res.status(201).json({
//         success:true,
//         greeting:"life..i"
// })
// }
const product=require('../models/product')
const cloudinary=require('cloudinary')
const WhereClause=require('../utils/whereclause')
const Product = require('../models/product')

// const { propfind } = require('../routes/home')

exports.addProduct=async(req,res,next)=>{
    let imageArray=[]
    if(!req.files){
        return next(new Error('images are required'))

    }
    if(req.files){
        for(let index=0;index<req.files.photos.length;index++){
            let result=await cloudinary.v2.uploader.upload(req.files.photos[index].tempFilePath,{
                folder:"products"
            })
            imageArray.push({
                id: result.public_id,
                secure_url:result.secure_url,
            })
        }
    }


req.body.photos=imageArray
req.body.user=req.user.id


const product= await product.create(req.body)
res.staus(200).json({
    success:true,
    product
})



}

exports.getAllProduct=async(req,res,next)=>{


    const resultperPage=6
   const totalcountProduct=await product.countDocuments()

WhereClause
    const productsObj=new WhereClause(product.find(),req.query).search().filter();
    const filteredProductNumber=productsObj.length
    // products.limit().skip()

    productsObj.pager(resultperPage)
    products=await productsObj.base.clone()

    res.status(200).json({
        success:true,
        products,
        filteredProductNumber,
        totalcountProduct
    })
}

exports.getOneProduct=async(req,res,next)=>{
 const product=await product.find(req,params.id)
 if(!product){
    return next(new Error('no product found'))

 }
 res.status(200).json({
    success:true,
    product
 })

}

exports.addReview=async(req,res,next)=>{//repeat
    
    const {rating,comment,productId}=req.body
    const review={
        user:req.user._id,
        name:req.user.name,
        rating:Number(rating),
        comment
    }

    const product=await product.findById(productId)

    const AlreadyReview=product.reviews.find(
        (rev)=>rev.user.toString()===req.user._id.toString()
    )


    if(AlreadyReview){
        product.reviews.forEach(review => {
            if (review.user.toString()===req.user._id.toString()) {
                review.comment=comment
                review.rating=rating
                
            }
            
        });

    }else{
        product.reviews.push(review)
        product.numberOfReviews=product.reviews.length
    }
            //adjust ratings
            product.ratings=product.reviews.reduce((acc,item)=>item.rating+acc,0)/
            product.reviews.length
            //save
            await product.save({validateBeforeSave:false})
            res.status(200).json({
                success:true,
            })
      

   }

exports.DeleteReview=async(req,res,next)=>{
    
    const {productId}=req.query;
   
    const product=await product.findById(productId)

    const reviews=product.reviews.filter(
        (rev)=>rev.user.toString()===req.user._id.toString()
    )

    const AlreadyReview=product.reviews.find(
        (rev)=>rev.user.toString()===req.user._id.toString()
    )
        const numberOfReviews=reviews.length
            //adjust ratings
            product.ratings=product.reviews.reduce((acc,item)=>item.rating+acc,0)/
            product.reviews.length
            //update the product
            await product.findByIdAndUpdate(productId,{
                reviews,
                ratings,
                numberOfReviews
            },{
                new:true,
                runValidators:true,
                useFindAndModify:false
            })
            res.status(200).json({
                success:true,
            })
      

   }
exports.getOnlyReviewsForOneProduct=async(req,res,next)=>{
    const product=await product.findById(req.query.id)

    res.status(200).json({
        success:true,
        reviews:product.reviews
    })
}
//admin only controllers

exports.AdminGetAllProducts=async(req,res,next)=>{
    const products=await product.find()

// if(!products){

// }

    res.status(200).json({
        success:true,
        products
    })
}
exports.adminUpdateProduct=async(req,res,next)=>{
    let product=await product.find(req.params.id)

    if(!product){
        return next(new Error('no product found with this id '))
    }

    let imagesArray=[]

    if(req.files){

        //destroy the existing images
        for(let index=0;index<product.photos.length;index++){
        const res=  cloudinary.v2.uploader.destroy(product.photos[index].id)
        }
        //upload and save the images
            for(let index=0;index<req.files.photos.length;index++){
                let result=await cloudinary.v2.uploader.upload(
                    req.files.photos[index].tempFilePath,{
                    folder:"products"
                })
                imagesArray.push({
                    id: result.public_id,
                    secure_url:result.secure_url,
                })
            }
        }
        req.body.photos=imagesArray

        product=await product.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
            runValidators:true,
            useFindAndModify:false
        })


        res.status(200).json({
            success:true,
            product
        })
    
    }

exports.adminDeleteProduct=async(req,res,next)=>{
    const product=await product.find(req.params.id)

    if(!product){
        return next(new Error('no product found with this id '))
    }

        //destroy the existing images
        for(let index=0;index<product.photos.length;index++){
            const res=  cloudinary.v2.uploader.destroy(product.photos[index].id)
            }

            product.remove()


        res.status(200).json({
            success:true,
            message:'product was deleted'
        })
   
}




//rectifuy the cloudinary
//token.js
//middlewares