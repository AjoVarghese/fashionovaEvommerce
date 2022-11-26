var express = require('express');
var router = express.Router();
const db = require('../../config/connection')
const collection = require('../../config/collection')
const config = require('../../config/config');
const {
    ObjectId
} = require('bson');

const objId = require('mongodb').ObjectId
const client = require('twilio')(config.accountSID, config.authToken)
const bcrypt = require('bcrypt')
const changeProductQuantity = require('../USER-CONTROLLER/placeOrder');
const { getAddress } = require('../../helpers/user-helpers');


exports.userProfile_get=async(req,res)=>{
    try{
    if(req.session.user){
        let userDetails=await getDetails(req.session.user._id)
        let address=await doGetAddress(req.session.user._id)
        let coupons=await displayCoupons()
        res.render('user-profile',{coupons,userDetails,address,userSession:req.session.user})
    }else{
        res.redirect('/login')
    }
}catch(err){
    res.redirect('/404')
}
   
}

function getDetails(id){
    return new Promise((resolve,reject)=>{
        db.get().collection(collection.USER_COLLECTION).findOne({_id:objId(id)}).then((data)=>{
            resolve(data)
        })
    })
}

function doGetAddress(id){
    return new Promise((resolve,reject)=>{
        db.get().collection(collection.ADDRESS_COLLECTION).findOne({userId:objId(id)}).then((data)=>{
            resolve(data)
        })
    })
}

function displayCoupons(){
    return new Promise((resolve,reject)=>{
        db.get().collection(collection.COUPON_COLLECTION).find().sort({date:-1}).toArray().then((data)=>{
            resolve(data)
        })
    })
}