var express = require('express');
var router = express.Router();
const db=require('../../config/connection')
const collection=require('../../config/collection')
const objId=require('mongodb').ObjectId


exports.removeCartProduct_post=(req,res)=>{
    try{
removeCartProduct(req.body).then((response)=>{
        res.json(response)
       
      })
    }catch(err){
        res.redirect('/404')
    }
}


function removeCartProduct(data){
    return new Promise((resolve,reject)=>{
        db.get().collection(collection.CART_COLLECTION)
            .updateOne({_id:objId(data.cart)},
             {
                $pull:{products:{item:objId(data.product)}}
             }
            ).then((response)=>{
                
                resolve({removeCartProduct:true})
            })
    })
}