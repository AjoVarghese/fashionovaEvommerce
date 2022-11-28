var express = require('express');
var router = express.Router();
const db = require('../../config/connection')
const collection = require('../../config/collection')
//const userHelper=require('../helpers/user-helpers');
//const { render, response } = require('../app');
const config = require('../../config/config');
const {
    ObjectId
} = require('bson');
//const userHelpers = require('../helpers/user-helpers');
const objId = require('mongodb').ObjectId
const client = require('twilio')(config.accountSID, config.authToken)
const bcrypt = require('bcrypt');
const { response } = require('../../app');


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