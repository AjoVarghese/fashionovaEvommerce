var express = require('express');
var router = express.Router();
const collection=require('../../config/collection')
const db=require('../../config/connection')
const { render } = require('ejs');
const { response } = require('express');


exports.viewReview_get=async(req,res)=>{
    try{
    if(req.session.admin){
   let reviews=await getReviews()
   res.render('view-reviews',{reviews})
 }else{
    res.redirect('/admin-login')
 }
}catch{
    res.redirect('/404')
}
}


function getReviews(){
    return new Promise(async(resolve,reject)=>{
        let reviews=await db.get().collection(collection.REVIEW_COLLECTION).find().sort({time:-1}).toArray()
            resolve(reviews)
        
    })
}