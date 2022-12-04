var express = require('express');
var router = express.Router();
const db=require('../../config/connection')
const collection=require('../../config/collection')
const config=require('../../config/config');
const { ObjectId } = require('bson');
const objId=require('mongodb').ObjectId

const cartTotal=require('../USER-CONTROLLER/applyCouponController')

exports.myOrders_get=async(req,res)=>{
    try{
    if(req.session.user){
        let totalPrice=await getTotalPrice(req.session.user._id)
        
       getAllOrders(req.session.user._id,totalPrice).then((orders)=>{
        
        res.render('my-orders',{orders,couponTotal:cartTotal.cartAmount})
      })
      
      }else{
        res.redirect('/login')
      }
    }catch(err){
        res.redirect('/404')
    }
}

function getTotalPrice(userId){
    return new Promise(async(resolve,reject)=>{
       var totalPrice= await db.get().collection(collection.CART_COLLECTION).aggregate([
            {
                $match:{userId:objId(userId)}
        
            },
            {
                $unwind:'$products'
            },
            {
                $project:{
                    item:'$products.item',
                    quantity:'$products.quantity'
                }
            },
            {
                $lookup:{
                    from:collection.PRODUCT_COLLECTION,
                    localField:'item',
                    foreignField:'_id',
                    as:'products'
                }
            },
            {
                $project:{
                    item:1,quantity:1,
                    products:{$arrayElemAt:['$products',0]}
                }
            },
            {
               $group:{
                _id:null,
                total:{$sum:{$multiply:[{$toInt:'$quantity'},{$toInt:'$products.price'}]}}
               }
            }
        ]).toArray() 
       
            resolve(totalPrice)   
    })
}



function getAllOrders(userId,totalPrice){   
return new Promise(async(resolve,reject)=>{
   let orders=await db.get().collection(collection.ORDER_COLLECTION).aggregate([
    {
        $match:{userId:objId(userId)}
    }, 
    {
        $sort:{time:-1}
    }
   ]).toArray()
    resolve(orders)
 })
}
