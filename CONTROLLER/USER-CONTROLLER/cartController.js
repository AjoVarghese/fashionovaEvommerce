var express = require('express');
var router = express.Router();
const db = require('../../config/connection')
const collection = require('../../config/collection')
const config = require('../../config/config');
const {
    ObjectId
} = require('bson');
const objId = require('mongodb').ObjectId
let cartdiscountprice=0;

exports.cart_get = async (req, res) => {
    try{
    if (req.session.user) {

        let cartCount = await getCartCount(req.session.user._id)
        let cart = await getCartProducts(req.session.user._id)
        let totalPrice = await getTotalPrice(req.session.user._id)
        let coupon=await getCoupons()
        res.render('cart', {
            cartCount,
            cart,
            totalPrice,
            userSession: req.session.user,
            coupon
        })

    } else {
        req.session.returnTo = req.originalUrl;
        res.redirect('/login')
    }
}catch(err){
    res.redirect('/404')
}
}



function getCartCount(userId) {
    return new Promise(async (resolve, reject) => {
        let count = 0
        let cart = await db.get().collection(collection.CART_COLLECTION).findOne({
            userId: objId(userId)
        })
        if (cart) {
            count = cart.products.length
        }
        resolve(count)
    })
}



function getCartProducts(userId) {
    
    return new Promise(async (resolve, reject) => {
        let cartItems = await db.get().collection(collection.CART_COLLECTION).aggregate([{
                $match: {
                    userId: objId(userId)
                }
            },
            {
                $unwind: '$products'
            },
            {
                $project: {
                    item: '$products.item',
                    quantity: '$products.quantity'
                }
            },
            {
                $lookup: {
                    from: collection.PRODUCT_COLLECTION,
                    localField: 'item',
                    foreignField: '_id',
                    as: 'products'
                }
            },
            {
                $project: {
                    item: 1,
                    quantity: 1,
                    products: {
                        $arrayElemAt: ['$products', 0]
                    }
                }
            }
        ]).toArray()
       
        resolve(cartItems)
    })
}


function getTotalPrice(userId) {
    
    return new Promise(async (resolve, reject) => {
        var totalPrice = await db.get().collection(collection.CART_COLLECTION).aggregate([{
                $match: {
                    userId: objId(userId)
                }
            },
            {
                $unwind: '$products'
            },
            {
                $project: {
                    item: '$products.item',
                    quantity: '$products.quantity'
                }
            },
            {
                $lookup: {
                    from: collection.PRODUCT_COLLECTION,
                    localField: 'item',
                    foreignField: '_id',
                    as: 'products'
                }
            },
            {
                $project: {
                    item: 1,
                    quantity: 1,
                    products: {
                        $arrayElemAt: ['$products', 0]
                    }
                }
            },
        ]).toArray()
        
         let total=0

        for(var i=0;i<totalPrice.length;i++){
            if(totalPrice[i].price == totalPrice[i].products.offerPrice && totalPrice[i].products.categoryOfferPrice == NaN || totalPrice[i].products.categoryOfferPrice ==0 || totalPrice[i].products.categoryOfferPrice == undefined ){

                total=parseInt(total) + (parseInt(totalPrice[i].products.price) * parseInt(totalPrice[i].quantity))

            }else if(totalPrice[i].products.offerPrice < totalPrice[i].products.price && totalPrice[i].products.categoryOfferPrice == undefined || totalPrice[i].products.categoryOfferPrice == null || totalPrice[i].products.categoryOfferPrice == 0){

                total=parseInt(total) + (parseInt(totalPrice[i].products.offerPrice) * parseInt(totalPrice[i].quantity))

            }else if(totalPrice[i].products.offerPrice > totalPrice[i].products.categoryOfferPrice && totalPrice[i].products.offerPrice != totalPrice[i].products.price){

                total=parseInt(total) + (parseInt(totalPrice[i].products.categoryOfferPrice) * parseInt(totalPrice[i].quantity))
            } else{

                total=parseInt(total) + (parseInt(totalPrice[i].products.offerPrice) * parseInt(totalPrice[i].quantity))
            }
            }
            exports.totalPrice=total
            
            resolve(total)
            
    })
}


function getCoupons(){
    return new Promise((resolve,reject)=>{
        db.get().collection(collection.COUPON_COLLECTION).find().toArray().then((data)=>{
            resolve(data)
        })
    })
}



function checkProductQuantity(productId){
    return new Promise((resolve,reject)=>{
        db.get().collection(collection.PRODUCT_COLLECTION).findOne({
            _id:objId(productId)
        }).then((data)=>{
            resolve(data)
        })

    })
}

