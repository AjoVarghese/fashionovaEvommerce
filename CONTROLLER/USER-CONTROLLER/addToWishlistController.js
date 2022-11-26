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


exports.addToWishlist_get=(req,res)=>{
    try{
    if(req.session.user){
        console.log('qqqq');
        console.log(req.query.id);
        var id=req.query.id
        addToWishlist(id,req.session.user._id).then((response)=>{
            res.json(response)
        })
    }
}catch(err){
    res.redirect('/404')
}
}


function addToWishlist(proId,userId){
   
    let proObj={
        item:objId(proId)
    }
   return new Promise(async(resolve,reject)=>{
    let wishlist=await db.get().collection(collection.WISHLIST_COLLECTION).findOne({userId:objId(userId)})
    if(wishlist){
        let itemExist=wishlist.item.findIndex(product => product.item == proId)
        if(itemExist != -1){
            db.get().collection(collection.WISHLIST_COLLECTION).updateOne({'item.item':objId(proId),userId:objId(userId)},
             {
                $pull:{item:{item:objId(proId)}}
             }
            )
            resolve({itemRemoved:true})
        }else{
        console.log('this');
        db.get().collection(collection.WISHLIST_COLLECTION).updateOne({userId:objId(userId)},
         {
            $push:{item:proObj}
         }
        ).then((data)=>{
            console.log('updating wishlist');
            console.log(data);
            resolve({itemAdded:true})
        })
      }
    }else{
        console.log('that');
        let wishlistObj={
            userId:objId(userId),
            item:[proObj]
        }
        db.get().collection(collection.WISHLIST_COLLECTION).insertOne(wishlistObj).then((data)=>{
            
            resolve({itemAdded:true})
        })
       

    }
   })
}
