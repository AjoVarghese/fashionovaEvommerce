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
const bcrypt=require('bcrypt');
const { response } = require('../../app');


exports.orderDelivered_post=(req,res)=>{
   try{
    var id=new objId(req.query.id)
    deliverOrder(id).then((response)=>{
      res.json(response)
    })
  }catch{
    res.redirect('/404')
  }
}


function deliverOrder(id){
    return new Promise((resolve, reject) =>{
        db.get().collection(collection.ORDER_COLLECTION).updateOne({_id:objId(id)},
          {
            $set:{status:'Deliverd'}
          }
        ).then((response))
        resolve({deliveredOrder:true})
    })
}