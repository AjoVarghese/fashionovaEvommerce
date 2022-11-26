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


exports.orderShipped_post=(req,res)=>{
    var id=new objId(req.query.id)
    shipOrder(id).then((response)=>{
        res.json(response)
    })
}


function shipOrder(id){
    return new Promise((resolve, reject) =>{
        db.get().collection(collection.ORDER_COLLECTION).updateOne({_id:objId(id)},
          {
            $set:{status:'Shipped'}
          }
        ).then((response))
        resolve({shipOrder:true})
    })
}