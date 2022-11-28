var express = require('express');
var router = express.Router();
const db = require('../../config/connection')
const collection = require('../../config/collection')
//const userHelper=require('../helpers/user-helpers');
//const { render, response } = require('../app');
const config = require('../../config/config');
const {
  ObjectId
} = require('bson');
//const userHelpers = require('../helpers/user-helpers');
const objId = require('mongodb').ObjectId
const client = require('twilio')(config.accountSID, config.authToken)
const bcrypt = require('bcrypt');
const { response } = require('../../app');


let erormsg='12';
let newPassword
let oldPassword

exports.changePassword_get=(req,res)=>{
    try{
    if(req.session.user){
        res.render('change-password',{userDetails:req.session.user,newPassword,oldPassword,erormsg})
        erormsg="12";
        newPassword=false
        oldPassword=false
        
    }else{
        req.session.returnTo = req.originalUrl;
        res.redirect('/login')
    }
}catch{
    res.redirect('/404')
}
}


exports.changePassword_post= async (req,res)=>{
    try{
  if(req.session.user){
    let oldPassword = req.body.oldPassword;
    let newPassword = req.body.newPassword;
    let newPassword1 = await bcrypt.hash(newPassword,10);

    bcrypt.compare(oldPassword,req.session.user.password).then((status)=>{
        if(status){
            console.log("PASSWORD VALIDATED");
            if(oldPassword==newPassword){
                erormsg="NEW PASSWORD CANNOT BE SAME AS THE OLD PASSWORD"
                res.redirect("/change-password")
            }else{
                db.get().collection(collection.USER_COLLECTION).updateOne({
                    _id:objId(req.session.user._id)
                },
                {
                    $set:{
                        password:newPassword1
                    }
                }
                )
                res.redirect("/logout")
            }
        }else{
            erormsg="INCORRECT PASSWORD"
            res.redirect("/change-password")
        }
    })
  
}
    }catch{
        res.redirect('/404')
    }

}

function checkOldPassword(data,user){
    return new Promise((resolve,reject)=>{
        let response={}
        bcrypt.compare(data.oldPassword,user.password).then((status)=>{
            if(status){
             response.oldPassword=true
             resolve(response)
            }else{
                resolve(response)   
            }
        })
    })
}

function checkNewPassword(data,user){
    return new Promise(async(resolve,reject)=>{
        newPassword=data.newPassword
      let result={}
      newPassword=await bcrypt.hash(newPassword,10)
      bcrypt.compare(newPassword,user.password).then((status)=>{
        if(status){
            resolve(result)
        }else{
            result.newPassword= true
            db.get().collection(collection.USER_COLLECTION).updateOne({
                _id:objId(user._id)
            },
            {
                $set:{
                    password:newPassword
                }
            }
            )
            resolve(result)
        }
      })
    })
}

