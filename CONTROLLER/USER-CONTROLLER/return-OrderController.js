var express = require('express');
var router = express.Router();
const db=require('../../config/connection')
const collection=require('../../config/collection')
//const userHelper=require('../helpers/user-helpers');
//const { render, response } = require('../app');
const config=require('../../config/config');
const { ObjectId } = require('bson');
//const userHelpers = require('../helpers/user-helpers');
const objId=require('mongodb').ObjectId
const client=require('twilio')(config.accountSID,config.authToken)
const bcrypt=require('bcrypt');
const { response } = require('../../app');
const moment=require('moment')



exports.returnOrder_post=async(req,res)=>{
    try{
   var id=objId(req.query.id)
   let totalPurchaseAmount=await getTotalPurchaseAmount(id)
   let orderDetails=await getOrderDetails(id)
   returnOrder(id).then(async(response)=>{
    let orders=await getOrders(id,req.session.user._id)
         doIncrementQuantity(orderDetails)
       addToWallet(req.session.user._id,id,totalPurchaseAmount,orders)
    res.json(response)
   })
}catch(err){
    console.log(err,'error in return order ');
    res.redirect('/404')
}
}


function returnOrder(id){
    return new Promise((resolve,reject)=>{
        db.get().collection(collection.ORDER_COLLECTION).updateOne(
            {
                _id:objId(id)
            },
            {
                $set:{
                    status:'Returned'
                }
            }
        ).then(()=>{
            console.log("RETURNED");
           
            resolve({orderReturned:true})
        })

    })
}


function getTotalPurchaseAmount(orderId){
    return new Promise((resolve,reject)=>{
         db.get().collection(collection.ORDER_COLLECTION).aggregate([
            {
                $match:{_id:orderId}
            },
            {
                $project:{'totalAmount':1}
            },
            {
                $unwind:'$totalAmount'
            },
            {
                $project:{total:'$totalAmount.total'}
            }
            
        ]).toArray().then((response)=>{
            resolve(response[0].total)
        })
            
    })
}

function getOrders(orderId,userId){
    return new Promise(async(resolve,reject)=>{
        let orders=await db.get().collection(collection.ORDER_COLLECTION).aggregate([
            {
                $match:{_id:objId(orderId)}
            },
            
        ]).toArray()
        resolve(orders)
    })
}


function addToWallet(userId,proId,totalPurchaseAmount,orders){
    console.log("ORDERs");
    console.log(orders);
    let historyObj={
        date:moment().format('MMMM Do YYYY, h:mm:ss a'),
        total:totalPurchaseAmount,
        paymentMethod:orders[0].paymentMethod,
       }
    return new Promise(async(resolve,reject)=>{
                
                // if(orders[0].paymentMethod != 'COD'){
                
                let userWallet=await db.get().collection(collection.WALLET_COLLECTION).findOne({userId:objId(userId)})
               
                if(userWallet){
                    db.get().collection(collection.WALLET_COLLECTION).updateOne(
                        {
                        userId:objId(userId)  
                        },
                    {
                        $inc:{walletAmount:totalPurchaseAmount}
                    },
                    )
                    db.get().collection(collection.WALLET_COLLECTION).updateOne(
                        {
                            userId:objId(userId)
                        },
                        {
                            $push:{
                                history:historyObj
                            }
                        }
                    ).then((data)=>{
                        resolve()
        
                    })
                    
                    
                }else{
                    walletObj={
                        userId:objId(userId),
                       walletAmount:totalPurchaseAmount,
                       history:[historyObj]
                       
                    }
                       
                    db.get().collection(collection.WALLET_COLLECTION).insertOne(walletObj).then((response)=>{
                        resolve(response)
                    })
                
            }
        //}
        
    })
}



function getOrderDetails(orderId){
    return new Promise(async(resolve,reject)=>{
       let orderDetails=await db.get().collection(collection.ORDER_COLLECTION).aggregate(
            [
                {
                    $match:{_id:objId(orderId)}
                },
                // {
                //     $project:{'productDetails':1}
                // },
                {
                    $unwind:'$productDetails'
                },
                {
                    $project:{products:'$productDetails.products'}
                }
                
            ]
        ).toArray()
        console.log("ORDER DETAILS");
        console.log(orderDetails);
        resolve(orderDetails)
    })
   
}



function doIncrementQuantity(orderDetails){
    console.log("ORDER DETAILS LENGTH");
    console.log(orderDetails);
    console.log(orderDetails.length);
    for(var i=0;i<orderDetails.length;i++){
        return new Promise(async(resolve,reject)=>{
        let quantityIncrement=await db.get().collection(collection.PRODUCT_COLLECTION).updateOne(
            {
                _id:objId(orderDetails[i].products._id)
            },
            {
                $inc:{
                    quantity:orderDetails[i].products.itemQuantity
                }
            }
        )
        resolve(quantityIncrement)
    })
    }
    
   
}