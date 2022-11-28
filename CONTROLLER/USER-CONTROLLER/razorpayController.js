// /*---------------------------------------------Global Variable---------------------------------------------------*/
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
const date = require("date-and-time");
const paypal = require('paypal-rest-sdk');
const Razorpay = require('razorpay');


var instance = new Razorpay({
    key_id: 'rzp_test_KyX1VZVHh9D2jK',
    key_secret: 'KMMpWOt1XflpvSlRYFnebWMd',
  });


  //------------------------------exported Variables------------------------------------------------------------------------------
const totalprice = require('../USER-CONTROLLER/placeOrder')
const cartProducts = require('../USER-CONTROLLER/placeOrder')
const total = require('../USER-CONTROLLER/cartController')

let orderId = totalprice.placeOrderId

let cartTotal=require('../USER-CONTROLLER/applyCouponController')
//----------------------------------exported Variables----------------------------------------------------


exports.razorPay_get = (req, res) => {
    try{
    console.log('razorpay');
    console.log(total.totalPrice);
    if (req.session.user) {
       console.log("TOTAL PRICE");
       console.log(totalprice);
       generateRazorPay(totalprice.placeOrderId,total.totalPrice).then((data)=>{
        res.render('razorPay', {
            products: cartProducts.products,
            loggedUser: req.session.user,
            total: total.totalPrice,
            orderId: totalprice.placeOrderId,
            data,
            couponTotal:cartTotal.cartAmount
        })
       })
       
    
    } else {
        res.redirect('/login')
    }
}catch(err){
    res.redirect('/404')
}
}



exports.razorPay_post=(req,res)=>{
    try{
    if(req.session.user){
        verifyPayment(req.body).then(()=>{
          changeOrderStatus(totalprice.placeOrderId).then(()=>{
            console.log('Pyment successful');
            res.json({razorpay:true})
          })
        }).catch((err)=>{
            console.log(err);
            res.json({razorpay:false,errMsg:'Error'})
        })
    }
}catch{
    res.redirect('/404')
}
}


exports.razorPaySuccess_get=(req,res)=>{
    try{
    if(req.session.user){
        res.render('success-page')
    }
}catch{
    res.redirect('/404')
}
}

exports.razorPayCancel_get=(req,res)=>{
    try{
    if(req.session.user){
        res.render('cancel-page')
    }
}catch{
    res.redirect('/404')
}
}


function generateRazorPay(order,totalAmount){
    return new Promise((resolve,reject)=>{
        
         var options = {
            amount: 50000,  // amount in the smallest currency unit
            currency: "INR",
            receipt: ""+order
          };
          instance.orders.create(options, function(err, order) {
            if(err){
                console.log('error');
                console.log(err);
            }else{
                console.log("New Order :",order);
                resolve(order)
            }
            
          });
    })
}


function verifyPayment(details){
   return new Promise((resolve,reject)=>{
    const crypto=require('crypto')
    let hmac=crypto.createHmac('sha256','KMMpWOt1XflpvSlRYFnebWMd')

    hmac.update(details['payment[razorpay_order_id]'] + '|' +details['payment[razorpay_payment_id]'])

    //-----------convert to hex---------------//
    hmac=hmac.digest('hex')

    if(hmac == details['payment[razorpay_signature]']){
        resolve()
    }else{
        reject()
    }
    
   })
}

function changeOrderStatus(orderId){
    return new Promise((resolve,reject)=>{
        db.get().collection(collection.ORDER_COLLECTION)
        .updateOne({_id:objId(orderId)},
        {
            $set:{status:'placed'}
        }
        ).then(()=>{
            resolve()
        })
    })
}