var express = require('express');
var router = express.Router();
const collection = require('../../config/collection')
const db = require('../../config/connection')
const {
    render
} = require('ejs');
const {
    response
} = require('express');
const {
    objectId
} = require('bson');


exports.viewCoupon_get=async(req,res)=>{
    try{
    if(req.session.admin){
        let coupon=await getCoupon()
        res.render('coupons',{coupon})
    }else{
        res.redirect('/admin-login')
    }
}catch{
    res.redirect('/404')
}
}


function getCoupon(){
    return new Promise(async(resolve,reject)=>{
        let coupon=await db.get().collection(collection.COUPON_COLLECTION).find().sort({date:-1}).toArray()
        resolve(coupon)
    })
}