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



exports.admin_allOrders_get=  (req,res)=>{
    if(req.session.admin){
        let limit =5;
        let page = 1;
        const startIndex = (page-1)*limit;
        const endIndex = page*limit
  
        if(req.query.page){
          page = req.query.page;
        }
        getAllOrders(limit,page,startIndex,endIndex).then(async(orders)=>{
            let count12 = await db.get().collection(collection.ORDER_COLLECTION).count({})
            res.render('orders',{orders,totalPages: Math.ceil(count12  / limit),
            previous: page - 1})
         })         
    }else{
        res.redirect('/admin-login') 
    }
}


function getAllOrders(limit,page,startIndex,endIndex){
   
    return new Promise(async(resolve,reject)=>{
        let count12 =  await db.get().collection(collection.ORDER_COLLECTION).count({})
        console.log(count12+"THis is the length of orders");
        
        let orders = await db.get().collection(collection.ORDER_COLLECTION).find({}).sort({time:-1}).limit(limit).skip((page - 1) * parseInt(limit)).toArray()
        // let orders=await db.get().collection(collection.ORDER_COLLECTION).find().sort({time:1}).toArray()
       console.log('ALL ORERS');
       console.log(orders);
        resolve(orders,count12)
    })
}
