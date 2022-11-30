var express = require('express');
var router = express.Router();
const db = require('../../config/connection')
const collection = require('../../config/collection')
const config = require('../../config/config');
const moment=require('moment')
const {
    ObjectId
} = require('bson');
const objId = require('mongodb').ObjectId

let product

exports.userReviews_get = async (req, res) => {
    try{
    if (req.session.user) {
        let id = objId(req.query.id)
        product = await getProduct(id)
        res.render('product-reviews', {
            product
        })
    } else {
        res.redirect('/login')
    }
}catch(err){
    res.redirect('/404')
}
}


exports.userReviews_post = async (req, res) => {
    try{
    addReviews(req.body, req.session.user._id,product).then((data) => {
        res.redirect('/my-orders')
    })
}catch(err){
    res.redirect('/404')
}
}


function addReviews(details, userId,product) {
    let reviewObj = {
        userId: userId,
        reviewerName:details.name,
        title:details.title,
        reviewDescription: details.description,
        date: moment().format('L'),
        time: moment().format('LTS')
    }
    return new Promise(async (resolve, reject) => {
        let reviewExists = await checkProductReview(details.productId)

        if (reviewExists) {
            db.get().collection(collection.REVIEW_COLLECTION).updateOne({
                productId: product._id
            }, {
                $push: {
                    reviews: reviewObj
                }
            }).then((data) => {
                resolve(data)
            })

        } else {
            let productReview = {
                productId: product._id,
                productName: product.productname,
                productImage: product.
                productimage1,
                reviews: [reviewObj]
            }

            db.get().collection(collection.REVIEW_COLLECTION).insertOne(productReview).then((data) => {
                resolve(data)
            })
        }

    })


}


function getProduct(proId) {
    return new Promise((resolve, reject) => {
        db.get().collection(collection.PRODUCT_COLLECTION).findOne({
            _id: proId
        }).then((data) => {
            resolve(data)
        })
    })
}


function checkProductReview(proId) {
    return new Promise((resolve, reject) => {
        db.get().collection(collection.REVIEW_COLLECTION).findOne({
            productId: objId(proId)
        }).then((data) => {
            resolve(data)
        })
    })
}