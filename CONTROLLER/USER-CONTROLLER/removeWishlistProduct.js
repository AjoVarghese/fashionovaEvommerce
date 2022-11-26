var express = require('express');
var router = express.Router();
const db=require('../../config/connection')
const collection=require('../../config/collection')
//const userHelper=require('../helpers/user-helpers');
//const { render, response } = require('../app');
const config=require('../../config/config');
const { ObjectId } = require('bson');
//const userHelpers = require('../helpers/user-helpers');
const objId=require('mongodb').ObjectId
const client=require('twilio')(config.accountSID,config.authToken)
const bcrypt=require('bcrypt')



exports.removeWishlistProduct_post=(req,res)=>{
    try{
    console.log('wishlist');
    console.log(req.body);
    if(req.session.user){
       removeWishlistProduct(req.body).then((response)=>{
          res.json(response)
       })
    }
}catch(err){
    res.redirect('/404')
}
}


function removeWishlistProduct(data){
    return new Promise((resolve,reject)=>{
        db.get().collection(collection.WISHLIST_COLLECTION).updateOne({_id:objId(data.wishlist)},
        {
            $pull:{item:{item:objId(data.product)}}
        }
        ).then(()=>{
            resolve({removeWishlistProduct:true})
        })
    })
}