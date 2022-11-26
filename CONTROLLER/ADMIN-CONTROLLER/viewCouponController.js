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
const objId = require('mongodb').ObjectId
const multer = require('multer')
const fs = require('fs')
const path = require('path');
const {
    log
} = require('console');
const bcrypt = require('bcrypt')


exports.viewCoupon_get=async(req,res)=>{
    if(req.session.admin){
        let coupon=await getCoupon()
        res.render('coupons',{coupon})
    }else{
        res.redirect('/admin-login')
    }
}


function getCoupon(){
    return new Promise(async(resolve,reject)=>{
        let coupon=await db.get().collection(collection.COUPON_COLLECTION).find().sort({date:-1}).toArray()
        resolve(coupon)
    })
}