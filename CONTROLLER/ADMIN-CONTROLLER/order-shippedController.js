var express = require('express');
var router = express.Router();
const db=require('../../config/connection')
const collection=require('../../config/collection')
const objId=require('mongodb').ObjectId


exports.orderShipped_post=(req,res)=>{
try{
    var id=new objId(req.query.id)
    shipOrder(id).then((response)=>{
        res.json(response)
    })
  }catch{
    res.redirect('/404')
  }
}


function shipOrder(id){
    return new Promise((resolve, reject) =>{
        db.get().collection(collection.ORDER_COLLECTION).updateOne({_id:objId(id)},
          {
            $set:{status:'Shipped'}
          }
        )
        resolve({shipOrder:true})
    })
}