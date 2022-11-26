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


exports.productReview_get=async(req,res)=>{
    if(req.session.admin){
        let id=objId(req.query.id)
        let productReview=await viewProductReview(id)
         res.render('productReview',{productReview})
    }else{
        res.redirect('/admin-login')
    }
}


function viewProductReview(id){
    return new Promise(async(resolve,reject)=>{
        let productReview=await db.get().collection(collection.REVIEW_COLLECTION).find(
            {
                _id:objId(id)
            }
        ).toArray()
        resolve(productReview)
    })
}

