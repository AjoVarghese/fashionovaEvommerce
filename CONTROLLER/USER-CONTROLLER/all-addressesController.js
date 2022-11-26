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


exports.allAddresses_get=async(req,res)=>{
    if(req.session.user){
        let savedAddress=await getAllAddress(req.session.user._id)
    res.render('all-addresses',{savedAddress})
    }else{
        res.redirect('/login')
    }
}



function getAllAddress(userId){
    return new Promise(async(resolve,reject)=>{
        let addresses=await db.get().collection(collection.ADDRESS_COLLECTION).findOne({userId:objId(userId)}) 
        resolve(addresses)
    })
}