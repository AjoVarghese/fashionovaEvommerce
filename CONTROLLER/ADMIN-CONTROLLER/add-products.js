var express = require('express');
var router = express.Router();
const collection = require('../../config/collection')
const db = require('../../config/connection')
const product=require('../../helpers/admin-helper/adminAddProductHelper')
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
const bcrypt = require('bcrypt')
const moment=require('moment')


//---------------------------------------------------addProductGet-----------------------------------------------------------

exports.admin_addProducts_get = (req, res) => {
    if (req.session.admin) {
        product.findCategory().then((data) => {
            res.render('add-products', {
                data
            })
        })
    } else {
        res.redirect('/admin-login')
    }
}





//---------------------------------------addProductPost---------------------------------------------------

exports.admin_addProducts_post = (req, res) => {
    var categoryName
    var id = objId(req.body.category)
    
    product.getEditCategory(id).then((data) => {
        
        categoryName = data.categoryname
        if(req.body.offerPrice){
           
        }else{
            req.body.offerPrice = req.body.price
        }
        const details = {
            productname: req.body.productname,
            productimage1: {

                data: fs.readFileSync(path.join(req.files.productimage1[0].path)),
                contentType: "image/png",
            },
            productimage2: {

                data: fs.readFileSync(path.join(req.files.productimage2[0].path)),
                contentType: "image/png",
            },
            productimage3: {

                data: fs.readFileSync(path.join(req.files.productimage3[0].path)),
                contentType: "image/png",
            },

            productid: req.body.productid,
            quantity: parseInt(req.body.quantity),
            price: parseInt(req.body.price),
            offerPrice:parseInt(req.body.offerPrice),
            description: req.body.description,
            date:moment().format('MMMM Do YYYY, h:mm:ss a'),
            categoryname: categoryName,
            categoryId: objId(req.body.category)
        }
        product.addProduct(details)
        
        res.redirect('/products')
    })
}





