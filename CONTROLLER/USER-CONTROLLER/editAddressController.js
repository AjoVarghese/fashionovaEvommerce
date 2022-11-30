var express = require('express');
var router = express.Router();
const db = require('../../config/connection')
const collection = require('../../config/collection')
const config = require('../../config/config');
const {
    ObjectId
} = require('bson');
const objId = require('mongodb').ObjectId
const client = require('twilio')(config.accountSID, config.authToken)
const bcrypt = require('bcrypt')



exports.editAddress_get=(req,res)=>{
    try{
    if(req.session.user){
        var id=new objId(req.query.id)
        getEditAddress(id,req.session.user._id).then((data)=>{
          res.render('edit-address',{data,loggedUser:req.session.user})
      })
    }
  }catch(err){
    res.redirect('/404')
  }
    
}



function getEditAddress (id,userId){
    return new Promise(async(resolve,reject)=>{
       let address=await db.get().collection(collection.ADDRESS_COLLECTION).aggregate([
        {
            $match:{userId:objId(userId)}
        },
        {
            $unwind:'$address'
        },
        {
            $match:{'address.id':objId(id)}
        }
       ]).toArray()
       console.log("EDIT ADDRESS");
       console.log(address);
       resolve(address)
    })
}



exports.editAddress_post=(req,res)=>{
    if(req.session.user){
        console.log('aaaaa');
        doEditAddress(req.body,req.session.user._id,req.body.addressId).then(()=>{
           res.redirect('/all-addresses')
        })
    }
    
}


function doEditAddress(data,userId,addressId){
    return new Promise((resolve,reject)=>{
        db.get().collection(collection.ADDRESS_COLLECTION).updateOne({'address.id':objId(addressId),userId:objId(userId)},
         {
            $set:{
                'address.$.firstName':data.firstName,
                'address.$.lastName':data.lastName,
                'address.$.street':data.street,
                'address.$.appartment':data.appartment,
                'address.$.city':data.city,
                'address.$.pincode':data.pincode,
                'address.$.mobile':data.mobile,
                'address.$.email':data.email
            }
         }
        ).then((data)=>{
            resolve(data)
        })
            
    })
}