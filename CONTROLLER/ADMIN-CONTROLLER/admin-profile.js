var express = require('express');
var router = express.Router();
const { render } = require('ejs');
const { response } = require('express');


exports.admin_profile_get=(req,res)=>{
    try{
    res.render('admin-profile')
    }catch{
        res.redirect('/404')
    }
}