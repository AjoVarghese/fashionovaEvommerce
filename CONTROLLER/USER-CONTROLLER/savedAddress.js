var express = require('express');
var router = express.Router();
const db=require('../../config/connection')
const collection=require('../../config/collection')
//const userHelper=require('../helpers/user-helpers');
//const { render, response } = require('../app');
const config=require('../../config/config');
const { ObjectId } = require('bson');
//const userHelpers = require('../helpers/user-helpers');
const objId=require('mongodb').ObjectId
const client=require('twilio')(config.accountSID,config.authToken)
const bcrypt=require('bcrypt')
const date = require("date-and-time");
const moment = require('moment');

exports.savedAddress_get=async(req,res)=>{
  try{
    if(req.session.user){
        let savedAddress=await getAddress(req.session.user._id)
        console.log("SAVED ADDRESSES");
        console.log(savedAddress);
          res.render('saved-addresses',{savedAddress,loggedUser:req.session.user})
      }else{
        res.redirect('/login')
      }
    }catch(err){
      res.redirect('/404')
    }
}

function getAddress(userId){
    return new Promise(async(resolve,reject)=>{
      let address=await db.get().collection(collection.ADDRESS_COLLECTION).aggregate([
         {
            $match:{userId:objId(userId)}
         },
         {
             $unwind:'$address'
         }
     ]).toArray()
     
     resolve(address)
    })
  }


  exports.savedAddress_post=(req,res)=>{
   
    res.redirect('/checkout')
  }