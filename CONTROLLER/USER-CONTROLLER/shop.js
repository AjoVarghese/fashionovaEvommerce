var express = require('express');
var router = express.Router();
const db=require('../../config/connection')
const collection=require('../../config/collection')
const objId=require('mongodb').ObjectId


exports.shop_get=async(req,res)=>{
  try{
    var cartCount=0
  if(req.session.user){
    
    var cartCount=await getCartCount(req.session.user._id)
  }
  let limit =3;
        let page = 1;
        const startIndex = (page-1)*limit;
        const endIndex = page*limit
  
        if(req.query.page){
          page = req.query.page;
        }
  doDisplayProducts(limit,page,startIndex,endIndex).then(async(data)=>{
    let count12=await db.get().collection(collection.PRODUCT_COLLECTION).count({})
    res.render('shop',{data,loggedUser :req.session.user,cartCount,totalPages: Math.ceil(count12  / limit), previous: page - 1})
  })
}catch(err){
  res.redirect('/404')
}
}

function doDisplayProducts(limit,page,startIndex,endIndex){
    return new Promise(async(resolve,reject)=>{
         let result=await db.get().collection(collection.PRODUCT_COLLECTION).find().sort({date:-1}).limit(limit).skip((page-1) * parseInt(limit)).toArray()
            resolve(result)
        
        
    })
}

function getCartCount(userId){
    return new Promise(async(resolve,reject)=>{
        let count=0
        let cart=await db.get().collection(collection.CART_COLLECTION).findOne({userId:objId(userId)})
        if(cart){
          count=cart.products.length
        }
        resolve(count)
    })
}