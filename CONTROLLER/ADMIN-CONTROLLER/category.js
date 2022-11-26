var express = require('express');
var router = express.Router();
const collection=require('../../config/collection')
const db=require('../../config/connection')
//const adminHelper=require('../helpers/admin-helpers')
const { render } = require('ejs');
const { response } = require('express');
const {objectId}=require('bson');
const objId=require('mongodb').ObjectId
const multer=require('multer')
const fs=require('fs')
const path=require('path');
const { log } = require('console');
const bcrypt=require('bcrypt')


//----------------------------------addCategoryGet---------------------------------------------
exports.admin_addCategory_get=(req,res)=>{
    if(req.session.admin){
        res.render('add-category')
    }
    else{
        res.redirect('/admin-login')
    }
}


//----------------------------------adCategoryPost-----------------------------------------------

exports.admin_addCategory_post=(req,res)=>{
    addCategory(req.body).then((data)=>{
        res.redirect('/view-category')
    })
}



function addCategory(category){
    return new Promise((resolve,reject)=>{
        db.get().collection(collection.CATEGORY_COLLECTION).insertOne(category).then((data)=>{
            resolve(data)
        })
    })
}



//----------------------------------------viewCategoryget----------------------------------
exports.admin_viewCategory_get=(req,res)=>{
    if(req.session.admin){
        getAllCategory().then((viewCategory)=>{
            
            res.render('view-category',{viewCategory})
        })
    }else{
        res.redirect('/admin-login')
    }
}



function getAllCategory(){
       
    return new Promise((resolve,reject)=>{
     let viewCategory=db.get().collection(collection.CATEGORY_COLLECTION).find().toArray()
     resolve(viewCategory)
    })
 }



 //-----------------------------------------------editCategoryGet--------------------------------------------

  exports.admin_editCategory_get=(req,res)=>{
    if(req.session.admin){
        var eId=new objId(req.query.id)
        getEditCategory(eId).then((data)=>{
            
            res.render('edit-category',{data})
        })
    }else{
        res.redirect('/admin-login')
    }
  }


 function getEditCategory(eId){
    return new Promise((resolve,reject)=>{
        db.get().collection(collection.CATEGORY_COLLECTION).findOne({_id:eId}).then((result)=>{
           
            resolve(result)
        })
    })
}



//----------------------------------------------------editCategoryPost----------------------------------------

exports.admin_editCategory_post=(req,res)=>{
    var eId=new objId(req.query.id)
    editCategory(eId,req.body).then((data)=>{
        res.redirect('/view-category')
    })
}


function editCategory(eId,data){
    return new Promise((resolve,reject)=>{
        db.get().collection(collection.CATEGORY_COLLECTION).updateOne({_id:eId},
            {
                $set:{
                    categoryid:data.categoryid,
                    categoryname:data.categoryname
                }
                
            })
            .then((result)=>{
                resolve(result)
            })
    })
}


exports.admin_deleteCategory_get=(req,res)=>{
    if(req.session.admin){
        var eId=new objId(req.query.id)
        deleteCategory(eId).then((data)=>{
            res.redirect('/view-category')
        })
    }else{
        res.redirect('/admin-login')
    } 
}


function deleteCategory(eId){
    return new Promise((resolve,reject)=>{
        db.get().collection(collection.CATEGORY_COLLECTION).deleteOne({_id:eId}).then((result)=>{
            resolve(result)
        })
    })
}
