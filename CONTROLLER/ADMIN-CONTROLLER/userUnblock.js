var express = require('express');
var router = express.Router();
const collection=require('../../config/collection')
const db=require('../../config/connection')
const { render } = require('ejs');
const { response } = require('express');
const {objectId}=require('bson');
const objId=require('mongodb').ObjectId



exports.admin_unblockUser_get=(req,res)=>{
    try{
    if(req.session.admin){
        var uId=new objId(req.query.id)
        unblockUser(uId).then(()=>[
            res.redirect('/users')
        ])
    }
}catch{
    res.redirect('/404')
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
