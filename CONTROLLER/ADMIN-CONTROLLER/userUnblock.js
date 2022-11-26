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


exports.admin_unblockUser_get=(req,res)=>{
    if(req.session.admin){
        var uId=new objId(req.query.id)
        unblockUser(uId).then(()=>[
            res.redirect('/users')
        ])
    }
}


function unblockUser(uId){
    return new Promise((resolve,reject)=>{
     db.get().collection(collection.USER_COLLECTION).updateOne({_id:uId},
           {
             $set:{
                 signupStatus:true
             }
           }
         )
         .then((result)=>{
             resolve(result)
         })
    })
 }
