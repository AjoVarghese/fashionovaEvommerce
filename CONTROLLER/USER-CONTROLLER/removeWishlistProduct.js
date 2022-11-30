var express = require('express');
var router = express.Router();
const db=require('../../config/connection')
const collection=require('../../config/collection')
const objId=require('mongodb').ObjectId



exports.removeWishlistProduct_post=(req,res)=>{
    try{
    if(req.session.user){
       removeWishlistProduct(req.body).then((response)=>{
          res.json(response)
       })
    }
}catch(err){
    res.redirect('/404')
}
}


function removeWishlistProduct(data){
    return new Promise((resolve,reject)=>{
        db.get().collection(collection.WISHLIST_COLLECTION).updateOne({_id:objId(data.wishlist)},
        {
            $pull:{item:{item:objId(data.product)}}
        }
        ).then(()=>{
            resolve({removeWishlistProduct:true})
        })
    })
}