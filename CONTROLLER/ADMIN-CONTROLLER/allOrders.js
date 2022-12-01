var express = require('express');
var router = express.Router();
const collection=require('../../config/collection')
const db=require('../../config/connection')
const { render } = require('ejs');
const { response } = require('express');
const {objectId}=require('bson');
const objId=require('mongodb').ObjectId




exports.admin_allOrders_get=  (req,res)=>{
    try{
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
}catch{
    res.redirect('/404')
}
}


function getAllOrders(limit,page,startIndex,endIndex){
   
    return new Promise(async(resolve,reject)=>{
        let count12 =  await db.get().collection(collection.ORDER_COLLECTION).count({})
        let orders = await db.get().collection(collection.ORDER_COLLECTION).find({}).sort({_id:-1}).limit(limit).skip((page - 1) * parseInt(limit)).toArray()
        resolve(orders,count12)
    })
}
