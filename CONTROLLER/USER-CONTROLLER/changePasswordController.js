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
    if(req.session.user){
        res.render('change-password',{userDetails:req.session.user,newPassword,oldPassword,erormsg})
        erormsg="12";
        newPassword=false
        oldPassword=false
        
    }else{
        req.session.returnTo = req.originalUrl;
        res.redirect('/login')
    }
}


exports.changePassword_post= async (req,res)=>{
  if(req.session.user){
    console.log("change password");
    console.log(req.body);
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
    
//   checkOldPassword(req.body,req.session.user).then((response)=>{
//     console.log("RESPONSE");
//     console.log(response);
//     if(response.oldPassword == true){
//         checkNewPassword(req.body,req.session.user).then((response)=>{
//            if(response.newPassword){
//             console.log("Shit");
//             console.log(response);
//             newPassword=true
//             res.redirect('/change-password')
//            }else{
//             req.session.user=false
//             res.redirect('/login')
//            }
//         })
//     }else{
//         console.log("FAILED");
//         console.log(response);
//         oldPassword=true
//         res.redirect('/change-password')
//     }
     
        
//   })
  
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

// function checkOldPassword(data,user){
//     return new Promise(async(resolve,reject)=>{
//       let result={}
//      bcrypt.compare(data.oldPassword,user.password).then((status)=>{
//       if(status ){
//           result.oldPassword=true
//           resolve(result)
//       }else{
//           resolve(response)
//       }
//      })
         
//     })
//   }
  
  
  
//   function checkNewPassword(data,user){
//       return new Promise((resolve,reject)=>{
//           let value={}
//           let newPassword=data.newPassword
//           newPassword=bcrypt.hash(newPassword,10)
//           if(newPassword == user.password){
//               value.samePassword = true
//               resolve(value)
//           }else{
//               db.get().collection(collection.USER_COLLECTION).updateOne({_id:objId(user._id)},{
//                              $set:{
//                               password:newPassword
//                            }
//                          }
//                          )
//           }
  
//       })
//   }