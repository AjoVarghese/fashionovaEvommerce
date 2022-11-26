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


exports.deleteCoupon_post=(req,res)=>{
    console.log("COUPON ID");
    console.log(req.query.id);
    var id=objId(req.query.id)
    doDeleteCoupon(id).then((response)=>{
        res.json(response)
    })
   
}


function doDeleteCoupon(couponId){
    return new Promise((resolve,reject)=>{
      db.get().collection(collection.COUPON_COLLECTION).deleteOne({_id:couponId}).then((data)=>{
        resolve({couponDeleted:true})
      })
    })
}