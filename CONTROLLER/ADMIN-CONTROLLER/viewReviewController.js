var express = require('express');
var router = express.Router();
const collection=require('../../config/collection')
const db=require('../../config/connection')
//const adminHelper=require('../helpers/admin-helpers')
const { render } = require('ejs');
const { response } = require('express');
const {objectId}=require('bson');
const objId=require('mongodb').ObjectId
const multer=require('multer')
const fs=require('fs')
const path=require('path');
const { log } = require('console');
const bcrypt=require('bcrypt')


exports.viewReview_get=async(req,res)=>{
    if(req.session.admin){
   let reviews=await getReviews()
   res.render('view-reviews',{reviews})
 }else{
    res.redirect('/admin-login')
 }
}


function getReviews(){
    return new Promise(async(resolve,reject)=>{
        let reviews=await db.get().collection(collection.REVIEW_COLLECTION).find().toArray()
            resolve(reviews)
        
    })
}