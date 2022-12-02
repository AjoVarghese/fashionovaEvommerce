var express = require('express');
var router = express.Router();
const db = require('../../config/connection')
const collection = require('../../config/collection')
const config = require('../../config/config');
const {
    ObjectId
} = require('bson');
const objId = require('mongodb').ObjectId
let coupon
let couponTotal = 0
let couponData
const total = require('../USER-CONTROLLER/cartController');
const { userSignup_get } = require('./user-signup');
const { getTotalPrice } = require('../../helpers/user-helpers');


exports.applyCoupon_post = async (req, res) => {
    try{
    if (req.session.user) {
        couponData = req.body
        exports.couponCode = couponData
        let price=await getPrice(req.session.user._id)
        getCoupon(couponData, req.session.user._id,price).then(async (response) => {
            res.json(response)
        })
    } else {
        
        res.redirect('/login')
    }
}catch(err){
    console.log(err,'error occured in apply coupon post');
    res.redirect('/404')
}

}



function getCoupon(data, userId,price) {
    let date_obj = new Date();
        try{
    return new Promise(async (resolve, reject) => {
        coupon = await db.get().collection(collection.COUPON_COLLECTION).findOne({
            couponCode: data.couponCode
        })
        
        let user = await checkUser(userId, data)
        if(user==null){
       
            if (coupon && coupon.couponQuantity >=1 && date_obj <= new Date(coupon.endingDate)) {
               
                
                if (parseInt(price) >= parseInt(coupon.minPrice)) {
                    couponTotal = parseInt(price) - parseInt(coupon.couponAmount)
                    exports.cartAmount = couponTotal
                    resolve({
                        couponApplied: true,
                        couponTotal
                    })
                } else if(price < coupon.minPrice){
                    resolve({
                        invalidCoupon: true
                    })
                }    
            
        } else {
            resolve({
                couponExpired: true
            })
        }
    }else{
       resolve({
        couponUsed:true
       })
    }
        couponTotal = 0
    })

        }catch(err){
            res.redirect('/404')
            console.log(err,'error at get coupon function');
        }
}

function getPrice(userId){
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

function checkUser(userId,coupon){
    return new Promise((resolve,reject)=>{
        db.get().collection(collection.COUPON_COLLECTION).findOne({couponCode:coupon.couponCode,'users.userId':objId(userId)}).then((data)=>{
            resolve(data)
        })
    })
}


