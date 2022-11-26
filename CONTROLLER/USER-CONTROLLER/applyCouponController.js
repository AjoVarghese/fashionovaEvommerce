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

let coupon
let couponTotal = 0
let couponData
const total = require('../USER-CONTROLLER/cartController');
const { userSignup_get } = require('./user-signup');


exports.applyCoupon_post = async (req, res) => {
    try{
    if (req.session.user) {
        couponData = req.body
        exports.couponCode = couponData

        getCoupon(couponData, req.session.user._id).then(async (response) => {
            res.json(response)
        })
    } else {
        console.log(err,'error occured in apply coupon post');
        res.redirect('/login')
    }
}catch(err){
    res.redirect('/404')
}

}



function getCoupon(data, userId) {
    let date_obj = new Date();
        try{
    return new Promise(async (resolve, reject) => {
        coupon = await db.get().collection(collection.COUPON_COLLECTION).findOne({
            couponCode: data.couponCode
        })
        
        let user = await checkUser(userId, data)
        console.log("REDEEMED USERS");
        console.log(user+"THIS IS THE PLACE WHERE OUPO ");

      
    
    
        if(user==null){
       
            if (coupon && coupon.couponQuantity > 0 && date_obj <= new Date(coupon.endingDate)) {
               
                
                if (total.totalPrice >= coupon.minPrice) {

                    couponTotal = parseInt(total.totalPrice) - parseInt(coupon.couponAmount)
                    exports.cartAmount = couponTotal
                    resolve({
                        couponApplied: true,
                        couponTotal
                    })
                } else {
                    resolve({
                        couponApplied: true
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

    //deleting expired coupon
    // if(date_obj > expiry){
    //     deleteCoupon(coupon.couponCode)
    // }
        couponTotal = 0
    })

        }catch(err){
            console.log(err,'error at get coupon function');
        }
}



function checkUser(userId,coupon){
    return new Promise((resolve,reject)=>{
        db.get().collection(collection.COUPON_COLLECTION).findOne({couponCode:coupon.couponCode,'users.userId':objId(userId)}).then((data)=>{
            console.log("USERS");
            console.log(data);
            resolve(data)
        })
    })
}


// function deleteCoupon(code){
//     return new Promise((resolve,reject)=>{
//         db.get().collection(collection.COUPON_COLLECTION).deleteOne({couponCode:code})
//     })
// }