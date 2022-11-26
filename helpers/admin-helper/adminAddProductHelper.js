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
    objectId, Int32
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

module.exports={

     findCategory() {
        return new Promise(async (resolve, reject) => {
            let data = await db.get().collection(collection.CATEGORY_COLLECTION).find().toArray()
            resolve(data)
        })
    },

     getEditCategory(eId) {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.CATEGORY_COLLECTION).findOne({
                _id: eId
            }).then((result) => {
               
                resolve(result)
            })
        })
    },

     addProduct(productData) {
    
        return new Promise((reslove, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION).insertOne(productData).then((data) => {
                reslove(data)
            })
        })
    }


}