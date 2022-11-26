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
const phonenumber1=require('../USER-CONTROLLER/otp-login')




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


exports.otpVerify_get=(req,res)=>{
  try{
    res.render('otp-verify')
  }catch(err){
    res.redirect('/404')
  }
}

exports.otpVerify_post= async(req,res)=>{
  let userdetails = await db.get().collection(collection.USER_COLLECTION).findOne({mobile:phonenumber1.phonenumber1})
  console.log(userdetails);
  console.log("THIS IS THE USED DETAILS");
    client
  .verify
  .services(config.serviceID)
  .verificationChecks
  .create({
    to:`+91${phonenumber}`,
    code:req.body.otp
  })
  .then((data)=>{
    console.log('DATA');
    console.log(data);
    if(data.status == 'approved'){
      req.session.user=userdetails
      userSession=req.session.user
      loggedUser=userSession.name
      console.log(userSession);
      res.redirect('/')
    }
    else{
      res.redirect('/otp-login')
    }
  })
}




exports.resendotp = async(req,res)=>{
 
    phonenumber=phonenumber1.phonenumber1
    
   console.log(phonenumber);
   let mobile=await db.get().collection(collection.USER_COLLECTION).findOne({mobile:req.body.mobile})
    // if(mobile){
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
  //  }
  //  else{
    // mobileError=true 
    // res.redirect('/otp-login')
  //  }
  

}