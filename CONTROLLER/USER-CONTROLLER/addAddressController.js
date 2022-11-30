var express = require('express');
var router = express.Router();
const db=require('../../config/connection')
const collection=require('../../config/collection')
const objId=require('mongodb').ObjectId


exports.addAddress_get=(req,res)=>{
    try{
    if(req.session.user){
        res.render('add-address',{loggedUser:req.session.user})
      }
    }catch(err){
        res.redirect('/404')
    }
}

exports.addAdress_post=(req,res)=>{
    try{
    addAddress(req.body).then((response)=>{
      //res.redirect('/saved-addresses')
      res.json(response)
    })
}catch{
    res.redirect('/404')
}
}

function addAddress(data){
  let addressObj={
           id:objId(),
           firstName:data.firstName,
           lastName:data.lastName,
           street:data.street,
           appartment:data.appartment,
           city:data.city,
           pincode:data.pincode,
           mobile:data.mobile,
           email:data.email
       
   }
   return new Promise(async(resolve,reject)=>{
   let address=await db.get().collection(collection.ADDRESS_COLLECTION).findOne({userId:objId(data.userId)})

   if(address){
       db.get().collection(collection.ADDRESS_COLLECTION).updateOne({userId:objId(data.userId)},
        {
           $push:{address:addressObj}
        }
       ).then((data)=>{
           
           resolve({addressAdded:true})
       })
   }else{
       let detailsObj={
           userId:objId(data.userId),
           address:[addressObj]
       }
       db.get().collection(collection.ADDRESS_COLLECTION).insertOne(detailsObj).then((data)=>{
          
           resolve({addressAdded:true})
       })
   }
})

}