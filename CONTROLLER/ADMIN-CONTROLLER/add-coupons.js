var express = require('express');
var router = express.Router();
const coupon=require('../../helpers/admin-helper/adminCouponHelper')
const {
    render
} = require('ejs');
const {
    response
} = require('express');

const moment=require('moment')



exports.admin_Coupons_get = (req, res) => {
    try{
    if (req.session.admin) {
        res.render('add-coupon', )
    } else {
        res.redirect('/admin-login')
    }
}catch{
    res.redirect('/404')
}
}



exports.admin_Coupons_post = async (req, res) => {
    
    const details={
        couponCode:req.body.couponCode,
        minPrice:parseInt(req.body.minPrice),
        couponAmount:parseInt(req.body.couponAmount),
        couponQuantity:parseInt(req.body.couponQuantity),
        startingDate:req.body.startingDate,
        endingDate:req.body.endingDate,
        date:moment().format()
    }
     coupon.addCoupon(details).then((response)=>{
       
        res.redirect('/coupons')
     })
}




