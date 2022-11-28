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
const bcrypt=require('bcryptjs')
const moment=require('moment')


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

exports.userSignup_get=(req,res)=>{
  try{
    if(userSession){
        res.redirect('/')
      }
      else{
        res.render('signup',{signupStatus,emailError,mobileSignupErr})
        emailError=false
      }
    }catch(err){
      res.redirect('/404')
    }
}


exports.userSignup_post=async(req,res)=>{
  try{
    console.log(req.body.email);
  let getEmail=await db.get().collection(collection.USER_COLLECTION).findOne({email:req.body.email})
  let mobile=await db.get().collection(collection.USER_COLLECTION).findOne({mobile:req.body.mobile})
  if(getEmail){
     emailError=true
     res.redirect('/signup')
  }
  else if(mobile){
    mobileSignupErr=true
    res.redirect('/signup')
  }
  else{
    doSignup(req.body).then((response)=>{
      signupStatus=true
      res.redirect('/login')
    })
  } 
}catch(err){
  res.redirect('/404')
}
}

function doSignup(userData){
        userData.date=moment().format('L')
           userData.signupStatus=true
    return new Promise(async(resolve,reject)=>{
        userData.password=await bcrypt.hash(userData.password,10)
        db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data)=>{
              resolve(data)
        })
    })
}

