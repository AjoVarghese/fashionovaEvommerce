var express = require('express');
var router = express.Router();
const db=require('../../config/connection')
const collection=require('../../config/collection')
const config=require('../../config/config');
const client=require('twilio')(config.accountSID,config.authToken)



var mobileError

var phonenumber


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