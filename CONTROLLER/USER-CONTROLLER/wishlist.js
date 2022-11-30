var express = require('express');
var router = express.Router();
const db=require('../../config/connection')
const collection=require('../../config/collection')
const objId=require('mongodb').ObjectId

exports.wishlist_get=(req,res)=>{
    try{
    if(req.session.user){
        getWishlist(req.session.user._id).then((wishlist)=>{
            res.render('wishlist',{wishlist,userSession:req.session.user})
        })
    }else{
        res.redirect('/login')
    }
}catch(err){
    res.redirect('/404')
}
}



function getWishlist(userId){
    return new Promise(async(resolve,reject)=>{
        let wishlist=await db.get().collection(collection.WISHLIST_COLLECTION).aggregate([
            {
                $match:{userId:objId(userId)}
            },
            {
                $unwind:'$item'
            },
            {
               $project:{
                item:'$item.item'
               }
            },
            {
                $lookup:{
                    from:collection.PRODUCT_COLLECTION,
                    localField:'item',
                    foreignField:'_id',
                    as:'products'
                }
            },{
                $project: {
                    item: 1,
                    quantity: 1,
                    products: {
                        $arrayElemAt: ['$products', 0]
                    }
                }
            }
            
            
           
        ]).toArray()
        resolve(wishlist)
    })
}