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



//-------------------------------------productsGet--------------------------------------------

exports.admin_products_get=(req,res)=>{
    try{
    if(req.session.admin){
        getAllProducts().then((products)=>{
            res.render('products',{products})
        })
    }else{
        res.redirect('/admin-login')
    }
}catch{
    res.redirect('/404')
}
}


function getAllProducts(){   
    return new Promise((resolve,reject)=>{
        let products=db.get().collection(collection.PRODUCT_COLLECTION).find().sort({date:-1}).toArray()
        resolve(products)
    })
}