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

var loggedUser
var loginError
var emailError
var blockedStatus
var validate
var mobileError
var mobileSignupErr
var noEmail
var findEmail
var phonenumber
var userSession
var signupStatus=true
var userId
var userCart

exports.otpLogin_get=(req,res)=>{
  try{
    res.render('otp-login',{mobileError}) 
  mobileError=false 
  }catch(err){
    res.redirect('/404')
  }  
}

exports.otLogin_post=async(req,res)=>{
    try{
    phonenumber=req.body.mobile
    exports.phonenumber1=phonenumber
   console.log(phonenumber);
   let mobile=await db.get().collection(collection.USER_COLLECTION).findOne({mobile:req.body.mobile})
    if(mobile){
    client
    .verify
    .services(config.serviceID)
    .verifications
    .create({
      to:`+91${phonenumber}`,
       channel:"sms"
    })

    .then((data)=>{
      console.log(data);
    res.redirect('/otp-verify')
    
    }).catch((err)=>{
      console.log(err);
    })
   }
   else{
    mobileError=true
    res.redirect('/otp-login')
   }
  }catch{
    res.redirect('/404')
  }
  
}