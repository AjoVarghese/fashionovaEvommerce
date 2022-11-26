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
const bcrypt=require('bcrypt');
const { get } = require('../../routes/admin');

let emailError;

exports.verifyEmail_get=(req,res)=>{
    try{
    res.render('verify-email',{emailError})
    emailError=false
    }catch(err){
        res.redirect('/404')
    }
}

exports.verifyEmail_post=async(req,res)=>{
    try{
    console.log("VERIFY EMAIL");
    console.log(req.body);
    let getEmail=await db.get().collection(collection.USER_COLLECTION).findOne({email:req.body.email})
    console.log("GET EMAIL");
    console.log(getEmail);
    console.log(getEmail._id);
    exports.userId=getEmail._id
    if(getEmail){
        res.redirect('/reset-password')
    } else{
        emailError=true
        res.redirect('/verify-email')
    } 
}catch(err){
    res.redirect('/404')
}   
}


