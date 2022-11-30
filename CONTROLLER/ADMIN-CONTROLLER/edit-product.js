var express = require('express');
var router = express.Router();
const collection=require('../../config/collection')
const db=require('../../config/connection')
const objId=require('mongodb').ObjectId
const cloudinary=require('../../cloudinary')

let images1,images2,images3


exports.admin_editProduct_get=async(req,res)=>{
    if(req.session.admin){
        var uId=new objId(req.query.id)
        let result=await db.get().collection(collection.CATEGORY_COLLECTION).find().toArray()
        findEditProducts(uId).then((data)=>{
            res.render('edit-product',{data,result})
        })
        findOneProduct(uId).then((data)=>{
            images1=data.image1
            images2=data.image2
            images3=data.image3
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
 

 function findOneProduct(id){
    return new Promise(async(resolve,reject)=>{
        let data=await db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:objId(id)})
        resolve(data)
    })
}



exports.admin_editProduct_post=async(req,res)=>{
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

      let url1
      let url2
      let url3
      
      if (req.files.image1 == undefined && req.files.image2 != undefined && req.files.image3 != undefined){
        url1 = images1,
        url2 = urls[0],
        url3 = urls[1]
      } else if(req.files.image1 != undefined && req.files.image2 == undefined && req.files.image3 != undefined){
        url1 =urls[0] ,
        url2 = images2,
        url3 = urls[1]
      } else if(req.files.image1 != undefined && req.files.image2 != undefined && req.files.image3 == undefined){
        url1 =urls[0] ,
        url2 = urls[1],
        url3 = images3
      } else   if(req.files.image1 == undefined && req.files.image2 == undefined && req.files.image3 != undefined){
        url1 = images1,
        url2 = images2,
        url3 = urls[0]
      } else if(req.files.image1 != undefined && req.files.image2 == undefined && req.files.image3 == undefined){
        url1 =urls[0] ,
        url2 = images2,
        url3 = images3
        
      } else if(req.files.image1 == undefined && req.files.image2 != undefined && req.files.image3 == undefined){
        url1 =images1 ,
        url2 = urls[0],
        url3 = images3
      } else if(req.files.image1 == undefined && req.files.image2 == undefined && req.files.image3 == undefined){
        url1 =images1 ,
        url2 = images2,
        url3 = images3
      } else if(req.files.image1 != undefined && req.files.image2 != undefined && req.files.image3 != undefined){
        url1 = urls[0] ,
        url2 = urls[1],
        url3 = urls[2]
      }
    var uId=new objId(req.query.id)
       
            const details = {
            productname : req.body.productname,
            image1:url1,
            image2:url2,
            image3:url3,
             productid:req.body.productid,
             quantity : parseInt(req.body.quantity),
            price : parseInt(req.body.price),
            offerPrice:parseInt(req.body.offerPrice),
            description : req.body.description,
            categoryId : objId(req.body.category)
        }
        editProducts(uId,details)
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
                image1:data.image1,
                image2:data.image2,
                image3:data.image3,
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





