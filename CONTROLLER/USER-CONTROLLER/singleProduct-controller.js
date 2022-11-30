var express = require('express');
var router = express.Router();
const db=require('../../config/connection')
const collection=require('../../config/collection')
const config=require('../../config/config');
const { ObjectId } = require('bson');
const objId=require('mongodb').ObjectId



exports.singleProduct_get=async(req,res)=>{
  try{
    var cartCount=0
  if(req.session.user){
    var cartCount=await getCartCount(req.session.user._id)
    
  }else{
    res.redirect('/login')
  }
  var id=new objId(req.query.id)
  let reviews=await findReviews(id)
  productSingle(id).then((data)=>{
    res.render('product-single',{data,loggedUser:req.session.user,cartCount,reviews})
  })
}catch(err){
  res.redirect('/404')
}
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

function productSingle(id){
    return new Promise((resolve,reject)=>{
        db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:id}).then((result)=>{
        resolve(result)
        })
    })
}


function findReviews(id){
  return new Promise(async(resolve,reject)=>{
    let reviews=await db.get().collection(collection.REVIEW_COLLECTION).aggregate(
      [
        {
        $match:{
          productId:id
        }
      },
      {
        $unwind:'$reviews'
      },
      {
        $limit:2
      },
      {
        $sort:{_id:-1}
      }
      ]
    ).toArray()
     resolve(reviews)
  })
}

