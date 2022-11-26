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
    objectId, Int32
} = require('bson');
const objId = require('mongodb').ObjectId
const multer = require('multer')
const fs = require('fs')
const path = require('path');
const {
    log
} = require('console');
const bcrypt = require('bcrypt');
const {
    resolve
} = require('path');


module.exports={
     addCoupon:(details) =>{
        return new Promise(async (resolve, reject) => {
            let couponExists = await db.get().collection(collection.COUPON_COLLECTION).findOne(
                {
                couponCode:details.couponCode
                }
            )
            if(couponExists){
                resolve(couponExists)
            }else{
                let coupon = await db.get().collection(collection.COUPON_COLLECTION).insertOne(details)
                
                resolve(coupon)
            }
           
        })
    }
}