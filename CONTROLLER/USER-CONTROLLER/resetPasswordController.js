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

const userId=require('../USER-CONTROLLER/verifyEmailController')

exports.resetPassword_get=(req,res)=>{
    try{
    res.render('reset-password',{userId:userId.userId})
    }catch(err){
        res.redirect('/404')
    }
}


exports.resetPassword_post=(req,res)=>{
    try{
    let userId=objId(req.query.id)
    updatePassword(req.body,userId).then((response)=>{
        res.redirect('/login')
    })
}catch(err){
    res.redirect('/404')
}
}



function updatePassword(data,userId){
    return new Promise(async(resolve,reject)=>{
        data.password=await bcrypt.hash(data.password,10)
        db.get().collection(collection.USER_COLLECTION).updateOne(
            {
                _id:userId
            },
            {
                $set:{
                   password:data.password
                }
            }
            ).then((data)=>{
                resolve()
            })
            
    })

}