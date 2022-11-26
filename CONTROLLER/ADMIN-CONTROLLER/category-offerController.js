var express = require('express');
var router = express.Router();
const collection = require('../../config/collection')
const db = require('../../config/connection')
const {
    render
} = require('ejs');
const {
    response
} = require('express');
const {
    objectId
} = require('bson');
const objId = require('mongodb').ObjectId
const multer = require('multer')
const fs = require('fs')
const path = require('path');
const {
    log
} = require('console');
const bcrypt = require('bcrypt');
const {
    resolve
} = require('path');


exports.categoryOffer_get = async (req, res) => {
    if (req.session.admin) {
        let category = await getCategory()
        let newOffer = await getOffers()
        res.render('category-offer', {
            category,
            newOffer
        })
    }else{
        res.redirect('/admin-login')
    }
}



exports.categoryOffer_post = async (req, res) => {
    console.log("Added Offer");
    console.log(req.body);
    let coupen = await coupenExist(req.body)
    if (coupen) {
        res.json({
            status: true
        })
    } else {
        doAddCoupen(req.body)
        getCategoryOffer(req.body)
        res.json({
            status: false
        })
    }  
}


function getCategory() {
    return new Promise(async (resolve,reject) => {
        let category = await db.get().collection(collection.CATEGORY_COLLECTION).find().toArray()
        resolve(category)
    })
}

function coupenExist(coupon) {
    return new Promise((resolve, reject) => {
        db.get().collection(collection.OFFER_COLLECTION).findOne({
            categoryname: coupon.categoryname
        }).then((data) => {
            resolve(data)
        })


    })
}


function doAddCoupen(coupon) {
    return new Promise((resolve, reject) => {
        db.get().collection(collection.OFFER_COLLECTION).insertOne(coupon).then((data) => {
            resolve(data)
        })
    })
}


function getOffers() {
    return new Promise((resolve, reject) => {
        let offers = db.get().collection(collection.OFFER_COLLECTION).find().toArray()
        resolve(offers)
    })
}


function getCategoryOffer(data){
    let offerPrice=0
    let categoryOfferPrice=0
    return new Promise(async(resolve,reject)=>{
        let category=await db.get().collection(collection.PRODUCT_COLLECTION).find({categoryname:data.categoryname}).toArray()
        console.log("APPLY COUPON");
        console.log(category);
        console.log(category.length);
        
        
        for(var i=0;i < category.length;i++){
            offerPrice=parseInt(data.offerPercentage)/100 * parseInt(category[i].price)
            categoryOfferPrice=parseInt(category[i].price)-parseInt(offerPrice)
            console.log("CATEGORY OFFER PRICE");
            console.log(categoryOfferPrice);

            db.get().collection(collection.PRODUCT_COLLECTION).updateOne(
                {
                   _id:category[i]._id
                },
                {
                    $set:{
                        categoryOfferPrice:categoryOfferPrice
                    }
                }
                
                )
        }
       
        resolve(category)

    })
}