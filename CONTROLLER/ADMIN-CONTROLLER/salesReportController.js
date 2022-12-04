var express = require('express');
var router = express.Router();
const collection=require('../../config/collection')
const db=require('../../config/connection')
const { render } = require('ejs');
const { response } = require('express');

const { order } = require('paypal-rest-sdk');

const salesRevenue=require('../ADMIN-CONTROLLER/admin-home')

let revenue=salesRevenue.revenue

exports.salesReport_get=async(req,res)=>{
    try{
    if(req.session.admin){
        let orders=await getOrders()
        res.render('salesReport',{orders,revenue:salesRevenue.revenue})
    }else{
        res.redirect('/admin-login')
    }
}catch{
    res.redirect('/404')
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
        },
        {
            $sort:{
                _id:-1
            }
        }
        ]).toArray()
          console.log("SALES REPORT");
          console.log(orders);
            resolve(orders)
      
    })
}