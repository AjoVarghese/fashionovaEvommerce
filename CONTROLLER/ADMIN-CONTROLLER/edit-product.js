var express = require('express');
var router = express.Router();
const collection=require('../../config/collection')
const db=require('../../config/connection')
const { render } = require('ejs');
const { response } = require('express');
const {objectId}=require('bson');
const objId=require('mongodb').ObjectId
const multer=require('multer')
const fs=require('fs')
const path=require('path');
const { log } = require('console');
const bcrypt=require('bcrypt')




exports.admin_editProduct_get=async(req,res)=>{
    if(req.session.admin){
        var uId=new objId(req.query.id)
        let result=await db.get().collection(collection.CATEGORY_COLLECTION).find().toArray()
        findEditProducts(uId).then((data)=>{
            
            res.render('edit-product',{data,result})
        })
        findOneProduct().then((data)=>{
            image1=data.productimage1,
            image2=data.productimage2,
            image3=data.productimage3
        })
    }else{
        res.redirect('/admin-login')
    }  
}


function findEditProducts(uId){
    return new Promise((resolve,reject)=>{
      db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:uId}).then((result)=>{
         resolve(result)
      })
    })
 }

 function findOneProduct(){
    return new Promise(async(resolve,reject)=>{
        let data=await db.get().collection(collection.PRODUCT_COLLECTION).findOne()
        resolve(data)
    })
}



exports.admin_editProduct_post=(req,res)=>{
    var uId=new objId(req.query.id)
        if(req.file){
            // categoryName = .categoryname
            const details = {
            productname : req.body.productname,
            productimage1: {
               data: fs.readFileSync(path.join(req.file.path)),
               contentType: "image/png",
             },
             productimage2: {
                data: fs.readFileSync(path.join(req.file.path)),
                contentType: "image/png",
              },
              productimage3: {
                data: fs.readFileSync(path.join(req.file.path)),
                contentType: "image/png",
              },
             productid:req.body.productid,
             quantity : parseInt(req.body.quantity),
            price : parseInt(req.body.price),
            offerPrice:parseInt(req.body.offerPrice),
            description : req.body.description,
            //categoryname :categoryname,
            categoryId : objId(req.body.category)
        }
        editProducts(uId,details)
      }
        else{
            //categoryName = data.categoryname
            const details = {
                productname : req.body.productname,
                productimage1:image1,
                productimage2:image2,
                productimage3:image3,
                 productid:req.body.productid,
                 quantity : parseInt(req.body.quantity),
                price : parseInt(req.body.price),
                offerPrice:parseInt(req.body.offerPrice),
                description : req.body.description,
                categoryId : objId(req.body.category)
            }
            editProducts(uId,details)
        }
        res.redirect('/products')
}


function editProducts(uId,data){ 
   return new Promise((resolve,reject)=>{
     db.get().collection(collection.PRODUCT_COLLECTION).updateOne({_id:uId},
        {
            $set:{
                productid:data.productid,
                productname:data.productname,
                description:data.description,
                productimage1:data.productimage1,
                productimage2:data.productimage2,
                productimage3:data.productimage3,
                quantity:parseInt(data.quantity),
                price:parseInt(data.price),
                offerPrice:parseInt(data.offerPrice),
                category:data.category
            }
        }
        )
        .then((result)=>{
           
            resolve(result)
        })
   })
}





