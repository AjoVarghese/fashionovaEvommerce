var express = require('express');
var router = express.Router();
const collection=require('../../config/collection')
const db=require('../../config/connection')
const { render } = require('ejs');
const { response } = require('express');
const {objectId}=require('bson');
const objId=require('mongodb').ObjectId


exports.productReview_get=async(req,res)=>{
    try{
    if(req.session.admin){
        let id=objId(req.query.id)
        let productReview=await viewProductReview(id)
         res.render('productReview',{productReview})
    }else{
        res.redirect('/admin-login')
    }
}catch{
    res.redirect('/404')
}
}


function viewProductReview(id){
    return new Promise(async(resolve,reject)=>{
        let productReview=await db.get().collection(collection.REVIEW_COLLECTION).find(
            {
                _id:objId(id)
            }
        ).sort({_id:-1}).toArray()
        resolve(productReview)
    })
}

