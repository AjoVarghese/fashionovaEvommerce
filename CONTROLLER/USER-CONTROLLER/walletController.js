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
const date = require("date-and-time");
const moment = require('moment');


exports.wallet_get=async(req,res)=>{
    try{
    if(req.session.user){
        let wallet=await getwalletTotal(req.session.user._id)
        console.log("WALLET");
        console.log(wallet);
        res.render('wallet',{wallet})
    }else{
        res.redirect('/login')
    }
}catch(err){
    res.redirect('/404')
}
}

function getwalletTotal(userId){
    return new Promise(async(resolve,reject)=>{
        let walletExists=await db.get().collection(collection.WALLET_COLLECTION).findOne({userId:objId(userId)})
        if(walletExists){
            db.get().collection(collection.WALLET_COLLECTION).findOne({userId:objId(userId)}).then((data)=>{
                console.log('sssssssssssssssssss');
               console.log(data.walletAmount);
                resolve(data.walletAmount)
             })
            
        }else{
            data=0;
            resolve(data)
        }
         
    })
}