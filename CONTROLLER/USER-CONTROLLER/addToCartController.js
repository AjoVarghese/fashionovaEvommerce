var express = require('express');
var router = express.Router();
const db = require('../../config/connection')
const collection = require('../../config/collection')
//const userHelper=require('../helpers/user-helpers');
//const { render, response } = require('../app');
const config = require('../../config/config');
const {
  ObjectId
} = require('bson');
//const userHelpers = require('../helpers/user-helpers');
const objId = require('mongodb').ObjectId
const client = require('twilio')(config.accountSID, config.authToken)
const bcrypt = require('bcrypt')

exports.addToCart_get = async (req, res) => {
  try{
  if (req.session.user) {
    if(req.session.user.signupStatus == true){
    userCart = true
    var id = req.query.id
    var result = await addtoCart(id, req.session.user._id).then((data) => {
      ;
      res.json({
        status: true
      })
    })
  }else{
    res.json({signupStatus:false})
  }
  } else {
    userCart = false
    res.json({
      status: false
    })
  }
}catch{
  res.redirect('/404')
}
}


exports.increaseQuantity_post = (req, res) => {
  try{
  if (req.session.user) {
    increase(req.query.id, req.session.user._id)
  } else {
    res.redirect('/login')
  }
}catch{
  res.redirect('/404')
}

}


exports.decreaseQuantity_post = (req, res) => {
  try{
  if (req.session.user) {

    decrease(req.query.id, req.session.user._id)
  } else {
    res.redirect('/login')
  }
}catch{
  res.redirect('/404')
}

}

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------
function addtoCart(proId, userId) {
  let proObj = {
    item: objId(proId),
    quantity: 1
  }
  return new Promise(async (resolve, reject) => {
    let userCart = await db.get().collection(collection.CART_COLLECTION)
      .findOne({
        userId: objId(userId)
      })

    if (userCart) {
      let proExist = userCart.products.findIndex(product => product.item == proId)
      if (proExist != -1) {
        db.get().collection(collection.CART_COLLECTION).updateOne({
          'products.item': objId(proId),
          userId: objId(userId)
        }, {
          $inc: {
            'products.$.quantity': 1
          }

        }).then((data) => {
          console.log('quantity');
          resolve()
        })
      } else {
        db.get().collection(collection.CART_COLLECTION)
          .updateOne({
              userId: objId(userId)
            },

            {
              $push: {
                products: proObj
              }
            }
          ).then((response) => {

            resolve(response)
          })
      }

    } else {

      let cartObj = {
        userId: objId(userId),
        products: [proObj]
      }
      db.get().collection(collection.CART_COLLECTION).insertOne(cartObj).then((response) => {

        resolve({
          response
        })
      })
    }
  })
}


function increase(proId, userId) {
  return new Promise(async (resolve, reject) => {

    let cart = await db.get().collection(collection.CART_COLLECTION).find({
      userId: objId(userId)
    }).toArray()
    db.get().collection(collection.CART_COLLECTION).updateOne({
      userId: objId(userId),
      'products.item': objId(proId)
    }, {
      $inc: {
        'products.$.quantity': 1
      }
    })

  })
}


function decrease(proId, userId) {
  return new Promise((resolve, reject) => {
    db.get().collection(collection.CART_COLLECTION).updateOne({
      userId: objId(userId),
      'products.item': objId(proId)
    }, {
      $inc: {
        'products.$.quantity': -1
      }
    })


  })
}