var express = require('express');
var router = express.Router();
const db=require('../../config/connection')
const collection=require('../../config/collection')
const objId=require('mongodb').ObjectId
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