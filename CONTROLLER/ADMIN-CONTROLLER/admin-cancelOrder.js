var express = require('express');
var router = express.Router();
const collection=require('../../config/collection')
const db=require('../../config/connection')
//const adminHelper=require('../helpers/admin-helpers')
const { render } = require('ejs');
const { response } = require('express');
const {objectId}=require('bson');
const objId=require('mongodb').ObjectId
const multer=require('multer')
const fs=require('fs')
const path=require('path');
const { log } = require('console');
const bcrypt=require('bcrypt')
const moment=require('moment')

exports.admin_cancelOrder_post=async(req,res)=>{ 
    try{
    let totalPurchaseAmount=await getTotalPurchaseAmount(req.body)
    let orderDetails=await getOrderDetails(req.body)
    cancelOrder(req.body).then(async(response)=>{
       let orders=await getOrders(req.body)
         doIncrementQuantity(orderDetails)
        addToWallet(req.body,totalPurchaseAmount,orders)
      res.json(response)
    })
}catch{
    res.redirect('/404')
}
}


function cancelOrder(data)  {
    return new Promise((resolve, reject) =>{
        db.get().collection(collection.ORDER_COLLECTION).updateOne({_id:objId(data.order)},
          {
            $set:{status:'cancelled'}
          }
        ).then((response))
        resolve({cancelOrder:true})
    })
}




function getTotalPurchaseAmount(details){
  return new Promise((resolve,reject)=>{
       db.get().collection(collection.ORDER_COLLECTION).aggregate([
          {
              $match:{_id:objId(details.order)}
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
        console.log("total AMOUNT");
        console.log(response[0].total);
          resolve(response[0].total)
      })
          
  })
}


function getOrderDetails(data){
  return new Promise(async(resolve,reject)=>{
     let orderDetails=await db.get().collection(collection.ORDER_COLLECTION).aggregate(
          [
              {
                  $match:{_id:objId(data.order)}
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


function getOrders(data){
  return new Promise(async(resolve,reject)=>{
      let orders=await db.get().collection(collection.ORDER_COLLECTION).aggregate([
          {
              $match:{_id:objId(data.order)}
          },
          
      ]).toArray()
      console.log("GET ORDER");
      console.log(orders);
      resolve(orders)
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

function addToWallet(data,totalPurchaseAmount,orders){
  console.log("ORDERs");
  console.log(orders);
  let historyObj={
      date:moment().format('MMMM Do YYYY, h:mm:ss a'),
      total:totalPurchaseAmount,
      paymentMethod:orders[0].paymentMethod,
     }
  return new Promise(async(resolve,reject)=>{
              
               if(orders[0].paymentMethod != 'COD'){
              
              let userWallet=await db.get().collection(collection.WALLET_COLLECTION).findOne({userId:objId(data.user)})
             
              if(userWallet){
                  db.get().collection(collection.WALLET_COLLECTION).updateOne(
                      {
                      userId:objId(data.user)  
                      },
                  {
                      $inc:{walletAmount:totalPurchaseAmount}
                  },
                  )
                  db.get().collection(collection.WALLET_COLLECTION).updateOne(
                      {
                          userId:objId(data.user)
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
                      userId:objId(data.user),
                     walletAmount:totalPurchaseAmount,
                     history:[historyObj]
                     
                  }
                     
                  db.get().collection(collection.WALLET_COLLECTION).insertOne(walletObj).then((response)=>{
                      resolve(response)
                  })
              
          }
      }
      
  })
}