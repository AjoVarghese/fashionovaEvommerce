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


exports.admin_users_get=(req,res)=>{
    try{
    if(req.session.admin){
        getAllUsers().then((users)=>{
            res.render('users',{users})
        })
    }else{
        res.redirect('/admin-login')
    }  
}catch{
    res.redirect('/404')
}
}

function getAllUsers(){
    return new Promise(async(resolve,reject)=>{
        let users=await db.get().collection(collection.USER_COLLECTION).find().toArray()
        resolve(users)
    })
}