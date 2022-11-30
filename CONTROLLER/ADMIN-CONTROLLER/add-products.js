var express = require('express');
var router = express.Router();
const product=require('../../helpers/admin-helper/adminAddProductHelper')
const {
    render
} = require('ejs');
const {
    response
} = require('express');
const objId = require('mongodb').ObjectId

const moment=require('moment')

require('dotenv').config();


const cloudinary = require('../../cloudinary')



//---------------------------------------------------addProductGet-----------------------------------------------------------

exports.admin_addProducts_get = (req, res) => {
    try{
    if (req.session.admin) {
        product.findCategory().then((data) => {
            res.render('add-products', {
                data
            })
        })
    } else {
        res.redirect('/admin-login')
    }
}catch{
    res.redirect('/404')
}
}





//---------------------------------------addProductPost---------------------------------------------------

exports.admin_addProducts_post = async(req, res) => {
    const cloudinaryImageUploadMethod=(file)=>{
        return new Promise((resolve)=>{
          cloudinary.uploader.upload(file,(err,res)=>{
            if(err) return res.status(500).send('upload image error')
            resolve(res.secure_url)
          })
        })
      }
      const files=req.files
      let arr1=Object.values(files)
      let arr2=arr1.flat()
      
      const urls=await Promise.all(
        arr2.map(async (file)=>{
          const {path} = file;
          const result= await cloudinaryImageUploadMethod(path)
          return result
        })
        
      )
      console.log("URLS");
      console.log(urls);
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
           
            image1:urls[0],
            image2:urls[1],
            image3:urls[2],
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





