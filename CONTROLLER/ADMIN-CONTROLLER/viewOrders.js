var express = require('express');
var router = express.Router();
const collection = require('../../config/collection')
const db = require('../../config/connection')
//const adminHelper=require('../helpers/admin-helpers')
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



exports.admin_viewOrders_get = (req, res) => {
    try{
    if (req.session.admin) {
        var id = new objId(req.query.id)
        viewSingleOrder(id).then((orders) => {
            res.render('view-orders', {
                orders
            })
        })
    } else {
        res.redirect('/admin-login')
    }
}catch{
    res.redirect('/404')
}
}

function viewSingleOrder(orderId) {
    return new Promise(async (resolve, reject) => {
        let orders = await db.get().collection(collection.ORDER_COLLECTION).aggregate([{
            $match: {
                _id: orderId
            }, 
        },
    {
        $sort:{_id:-1}
    } ]).toArray()

        resolve(orders)
    })
}