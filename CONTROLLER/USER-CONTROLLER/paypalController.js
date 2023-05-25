var express = require('express');
var router = express.Router();
const db = require('../../config/connection')
const collection = require('../../config/collection')
const objId = require('mongodb').ObjectId
const paypal = require('paypal-rest-sdk');
const totalprice = require('../USER-CONTROLLER/placeOrder')
const cartProducts = require('../USER-CONTROLLER/placeOrder')
const total = require('../USER-CONTROLLER/cartController')
let cartTotal=require('../USER-CONTROLLER/applyCouponController')
let orderId = totalprice.placeOrderId

paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'AS71Hd25PZF-kAXBfXQmvxXIsCts9ZrEw4j9BpQA6pEWIbVW3Hje-mbDgsEgP3Xc4U_aMA35hfGgvfvk',
  'client_secret': 'EDafMzwv5Ra4pgn2f74zzffqLafeQr2xNqUL6tfIARp6tsIE2Sna3GxIeYWRo4oXF8XLTzND2XnBk6Q3'
});



exports.paypal_get = async (req, res) => {
  try{
  if (req.session.user) {
   
    res.render('paypal', {
      products: cartProducts.products,
      loggedUser: req.session.user,
      total: total.totalPrice,
      orderId: totalprice.placeOrderId,
      couponTotal:cartTotal.cartAmount
    })

  } else {
    res.redirect('/login')
  }
}catch(err){
   res.redirect('/404')
}
}



exports.paypal_post = (req, res) => {
  if (req.session.user) {
    const create_payment_json = {
      "intent": "sale",
      "payer": {
        "payment_method": "paypal"
      },
      "redirect_urls": {
        "return_url": "https://localhost:3000/paypal-success",
        "cancel_url": "https://localhost:3000/paypal-cancel"
      },
      "transactions": [{
        "item_list": {
          "items": [{
            "name": "Red Sox Hat",
            "sku": "001",
            "price": "25.00",
            "currency": "USD",
            "quantity": 1
          }]
        },
        "amount": {
          "currency": "USD",
          "total": "25.00"
        },
        "description": "Hat for the best team ever"
      }]
    }



    paypal.payment.create(create_payment_json, function (error, payment) {
      if (error) {
        throw error;
      } else {

        for (let i = 0; i < payment.links.length; i++) {
          if (payment.links[i].rel === 'approval_url') {
            res.redirect(payment.links[i].href);
          }
        }
      }
    });
  }
}




exports.paypalSuccess_get = (req, res) => {
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;

  const execute_payment_json = {
    "payer_id": payerId,
    "transactions": [{
      "amount": {
        "currency": "USD",
        "total": "25.00"
      }
    }]
  }


  paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
    if (error) {
      console.log(error.response);
      throw error;
    } else {
      updateOrderStatus().then((data) => {
        res.render('success-page')
      })

    }
  });
};



function updateOrderStatus() {
  return new Promise(async (resolve, reject) => {

    var orderStatus = await db.get().collection(collection.ORDER_COLLECTION).updateOne({
      _id: objId(totalprice.placeOrderId)
    }, {
      $set: {
        status: 'placed'
      }
    })
    resolve()
  })
}


exports.paypalCancelled_get = (req, res) => {
  cancelOrderStatus().then((data) => {
    res.render('cancel-page')
  })
}

function cancelOrderStatus() {
  return new Promise(async (resolve, reject) => {

    var orderStatus = await db.get().collection(collection.ORDER_COLLECTION).updateOne({
      _id: objId(totalprice.placeOrderId)
    }, {
      $set: {
        status: 'failed'
      }
    })

    resolve()
  })
}