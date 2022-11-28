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


exports.admin_profile_get=(req,res)=>{
    try{
    res.render('admin-profile')
    }catch{
        res.redirect('/404')
    }
}