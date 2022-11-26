var express = require('express');
var router = express.Router();
const collection = require('../../config/collection')
const db = require('../../config/connection')
//const adminHelper=require('../helpers/admin-helpers')
const {
    render
} = require('ejs');
const {
    response
} = require('express');
const {
    objectId
} = require('bson');
const objId = require('mongodb').ObjectId
const multer = require('multer')
const fs = require('fs')
const path = require('path');
const {
    log
} = require('console');
const bcrypt = require('bcrypt');
const {
    resolve
} = require('path');




exports.editCategoryOffer_get=(req,res)=>{
    if(req.session.admin){
        dogetOffer(req.query.id).then((data)=>{
            res.render('edit-categoryOffer',{data})
        })
        
    }
}



exports.editCategoryOffer_post=(req,res)=>{
    console.log('EDITED Id');
    console.log(req.query.id);
    editOfferCategory(req.query.id,req.body).then(()=>{
        res.redirect('/category-offer')
    })
}



function dogetOffer(id){
    return new Promise((resolve,reject)=>{
        db.get().collection(collection.OFFER_COLLECTION).findOne({_id:objId(id)}).then((data)=>{
            console.log("EDIT OFFER");
            console.log(data);
            resolve(data)
        })
    })
}


function editOfferCategory(id,details){
    return new Promise((resolve,reject)=>{
        db.get().collection(collection.OFFER_COLLECTION).updateOne(
            {
            _id:objId(id)
        },
        {
            $set:{
                categoryname:details.categoryname,
                offerPercentage:details.offerPercentage
            }
        }
        ).then((data)=>{
            console.log("OFFER EDITED");
            console.log(data);
            resolve(data)
        })
    })
}