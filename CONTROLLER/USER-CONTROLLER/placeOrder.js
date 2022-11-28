var express = require('express');
var router = express.Router();
const db = require('../../config/connection')
const collection = require('../../config/collection')
const objId = require('mongodb').ObjectId
const moment = require('moment');
const {
    changeProductQuantity
} = require('../../helpers/user-helpers');


const total = require('../USER-CONTROLLER/cartController')
const cartTotal = require('../USER-CONTROLLER/applyCouponController')
const couponCode = require('../USER-CONTROLLER/applyCouponController')

let purchaseAmount
let couponTotal

let changeQty

exports.placeOrder_post = async (req, res) => {
    try{
    if (req.session.user) {

        console.log("CART TOTAL");
        console.log(total.totalPrice);
        let products = await getCartProductsList(req.session.user._id)

        exports.products = products
        let cart = await getCartProduct(req.session.user._id)

        exports.cartqty = cart
        let cartQuantity = await getCartQuantity(req.session.user._id)

        exports.cart = cartQuantity

        let signupStatus = await checkSignupStatus(req.session.user._id)

        if (signupStatus[0].signupStatus === false) {
            res.json({
                signupStatus: false
            })
        } else {
            couponTotal = cartTotal.cartAmount
            offerTotal = total.totalPrice

            if (couponTotal == 0 || couponTotal == undefined) {
                purchaseAmount = offerTotal
            } else if (couponTotal != 0) {
                purchaseAmount = couponTotal
            }

            await placeOrder(req.body, products, cartQuantity, purchaseAmount, req.session.user._id, cart)

            if (req.body.paymentMethod === 'Paypal') {
                console.log('paypal');
                res.json({
                    paypal: true
                })
            } else if (req.body.paymentMethod === 'Razorpay') {
                console.log('razorPay');
                res.json({
                    razorPay: true
                })

            } else if(req.body.paymentMethod === 'COD'){
                console.log('COD');
                res.json({
                    status: true
                })
              } else if(req.body.paymentMethod === 'Wallet'){
                let wallet=await walletPayment(req.session.user._id)
                if(wallet !=null ){
                    if(wallet.walletAmount >= total.totalPrice){
                console.log('Wallet');
                res.json({
                    wallet:true
                })
            }
            }
              }
           
        }
    }
}catch{
    res.redirect('/404')
}
}


function getCartProductsList(userId) {

    return new Promise(async (resolve, reject) => {
        let cart = await db.get().collection(collection.CART_COLLECTION).aggregate([{
                $match: {
                    userId: objId(userId)
                }
            },
            {
                $unwind: '$products'
            },
            {
                $project: {
                    'products.item': 1,
                    'products.quantity': 1
                }
            },
            {
                $lookup: {
                    from: collection.PRODUCT_COLLECTION,
                    localField: 'products.item',
                    foreignField: '_id',
                    as: 'products'
                }
            },
            {
                $unwind: '$products'
            },
            {
                $project: {
                    'products': 1
                }
            }

        ]).toArray()

        resolve(cart)
    })
}




function getCartQuantity(userId) {
    return new Promise(async (resolve, reject) => {
        let quantity = await db.get().collection(collection.CART_COLLECTION).aggregate([{
                $match: {
                    userId: objId(userId)
                }
            },
            {
                $unwind: '$products'
            }, {
                $project: {
                    quantity: '$products.quantity',
                    item: '$products.item'
                }
            }, {
                $project: {
                    item: 1,
                    quantity: 1,
                }
            }

        ]).toArray()

        resolve(quantity)

    })
}


function placeOrder(address, products, cartQuantity, totalPrice, userId, cart) {

    let totalAmount = {
        total: totalPrice
    }

    let total = [totalAmount]
    let status = address['paymentMethod'] === 'COD' || 'Wallet' ? 'placed' : 'pending'
    for (var i = 0; i < products.length; i++) {
        products[i].products.itemQuantity = cartQuantity[i].quantity
        products[i].products.orderStatus = status
    }
    return new Promise((resolve, reject) => {

        let orderObj = {
            deliveryDetails: {
                name: address.fname,
                appartment: address.appartment,
                street: address.street,
                city: address.city,
                mobile: address.mobile,
                email: address.email
            },
            userId: objId(userId),
            productDetails: products,
            quantity: cartQuantity,
            totalAmount: total,
            paymentMethod: address['paymentMethod'],
            status: status,
            date: moment().format('L'),
            time: moment().format('MMMM Do YYYY, h:mm:ss a')
        }
   
        db.get().collection(collection.ORDER_COLLECTION).insertOne(orderObj).then((data) => {

            exports.placeOrderId = data.insertedId
            changeQuantity(cart)

            if( couponCode.couponCode != undefined || couponCode.couponCode != null ){
            changeCouponQuantity(couponCode.couponCode)
            checkUser(couponCode.couponCode,userId)
            }
        })

        db.get().collection(collection.CART_COLLECTION).deleteOne({
            userId: objId(userId)
        })
        cartTotal.cartAmount=0
        resolve()
    })
}



function getCartProduct(id) {

    return new Promise(async (resolve, reject) => {
        let cart = await db.get().collection(collection.CART_COLLECTION).aggregate([{
                $match: {
                    userId: objId(id)
                }
            },
            {
                $unwind: '$products'
            }
        ]).toArray()

        resolve(cart)
    })
}



function changeQuantity(cart) {
    for (var i = 0; i < cart.length; i++) {
        if(cart[i].products.quantity != 0){
        console.log(cart[i].products.quantity);
        return new Promise(async (resolve, reject) => {
            let decreaseQuantity = await db.get().collection(collection.PRODUCT_COLLECTION).updateOne({
                _id: objId(cart[i].products.item)
            }, {
                $inc: {
                    quantity: -cart[i].products.quantity
                }
            })
            resolve(decreaseQuantity)
        })
    }
}
}



function checkSignupStatus(userId) {
    return new Promise(async (resolve, reject) => {
        let userStatus = await db.get().collection(collection.USER_COLLECTION).find({
            _id: objId(userId)
        }).toArray()
        resolve(userStatus)
    })
}



function changeCouponQuantity(coupon) {
    console.log("COUPON QUANTITY");
    console.log(coupon);
    return new Promise(async (resolve, reject) => {
        console.log(couponCode);

        if(couponCode.couponCode != undefined ){

        let decreaseCouponQuantity = await db.get().collection(collection.COUPON_COLLECTION).updateOne({
            couponCode: coupon.couponCode
        }, {
            $inc: {

              couponQuantity: -1
            }
        })
        
        resolve(decreaseCouponQuantity)
    }
    })

}


function checkUser(coupon,userId){
    const users={
        userId:objId(userId)
    }
    let redeemedUsers=users
    if(couponCode.couponCode != undefined){
    return new Promise((resolve,reject)=>{
        db.get().collection(collection.COUPON_COLLECTION).updateOne(
            {
                couponCode:coupon.couponCode
            },
            {
                $push:{
                    users:redeemedUsers
                }
            }
        )
        resolve()
    })
}
}

function walletPayment(userId){
    return new Promise((resolve,reject)=>{
        db.get().collection(collection.WALLET_COLLECTION).findOne({userId:objId(userId)}).then((data)=>{
            console.log("WALLET PURCHASE");
            console.log(data);
            resolve(data)
        })
    })
}