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


exports.admin_userBlock_get=(req,res)=>{
    try{
    if(req.session.admin){
        var uId=new objId(req.query.id)
        updateUser(uId,req.body).then(()=>{
            res.redirect('/users')
        })
    }
    else{
        res.redirect('/admin-login')
    }
}catch{
    res.redirect('/404')
}
}


function updateUser(uId,data){
    return new Promise((resolve,reject)=>{
        db.get().collection(collection.USER_COLLECTION).updateOne({_id:uId},
            {
                $set:{
                    signupStatus:false
                }
            })
            .then((result)=>{
                resolve(result)
            })
    })
}