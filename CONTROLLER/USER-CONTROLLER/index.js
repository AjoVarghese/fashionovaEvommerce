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

exports.index_get=async(req,res)=>{
    var cartCount=0
    var wallet=0   
    try{
    if(req.session.user){ 
      var cartCount=await getCartCount(req.session.user._id)  
      var wallet=await getwalletTotal(req.session.user._id)   
    }
    res.render('index',{ loggedUser :req.session.user,cartCount,wallet}) 
  }catch(err){
    res.redirect('/404')
  }
      
}


function getCartCount(userId){
    return new Promise(async(resolve,reject)=>{
        let count=0
        let cart=await db.get().collection(collection.CART_COLLECTION).findOne({userId:objId(userId)})
        if(cart){
          count=cart.products.length
        }
        resolve(count)
    })
}


function getwalletTotal(userId){
  return new Promise(async(resolve,reject)=>{
    let total=0
      let walletExists=await db.get().collection(collection.WALLET_COLLECTION).findOne({userId:objId(userId)})
      if(walletExists){
          db.get().collection(collection.WALLET_COLLECTION).findOne({userId:objId(userId)}).then((data)=>{
              resolve(data.walletAmount)
           })
          
      }else{
          total=0;
          resolve(total)
      }
       
  })
}