var express = require('express');
var router = express.Router();
const db=require('../../config/connection')
const collection=require('../../config/collection')
const config=require('../../config/config');
const { ObjectId } = require('bson');


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


