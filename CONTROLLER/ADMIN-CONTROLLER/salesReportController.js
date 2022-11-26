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
const bcrypt=require('bcrypt');
const { resolve } = require('path');
const { order } = require('paypal-rest-sdk');

const salesRevenue=require('../ADMIN-CONTROLLER/admin-home')

let revenue=salesRevenue.revenue

exports.salesReport_get=async(req,res)=>{
    if(req.session.admin){
        let orders=await getOrders()
        console.log('orders');
        console.log(orders);
        // let users=await getAlUsers()

        res.render('salesReport',{orders,revenue:salesRevenue.revenue})
    }else{
        res.redirect('/admin-login')
    }
}





function getOrders(){
    return new Promise(async(resolve,reject)=>{
        let orders=await db.get().collection(collection.ORDER_COLLECTION).aggregate([
            {
                $lookup:{
                 from:collection.USER_COLLECTION,
                 localField:'userId',
                foreignField:'_id',
                as:'users'
               
            }
        },{
            $unwind:'$users'
        }
        ]).toArray()
            console.log('USERS');
            console.log(orders);
            resolve(orders)
      
    })
}