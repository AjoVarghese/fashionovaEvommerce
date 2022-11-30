var express = require('express');
var router = express.Router();
const db = require('../../config/connection')
const collection = require('../../config/collection')
const config = require('../../config/config');
const {
    ObjectId
} = require('bson');
const objId = require('mongodb').ObjectId


exports.deleteAddress_post=(req,res)=>{
    try{
    if(req.session.user){
        var id=new objId(req.query.id)
        doDeleteAddress(id,req.session.user._id).then((response)=>{
          res.json(response)
        }) 
    }
  }catch(err){
    res.redirect('/404')
  }
    
}



function doDeleteAddress(id,userId){
    return new Promise((resolve,reject)=>{
        db.get().collection(collection.ADDRESS_COLLECTION).updateOne({'address.id':id,userId:objId(userId)},
         {
            $pull:{address:{id:id}}
         }
        ).then((response)=>{
            
            resolve({addressDeleted:true})
        })
    })
}