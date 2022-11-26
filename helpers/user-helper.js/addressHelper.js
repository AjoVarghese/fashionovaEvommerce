// const collection=require('../../config/collection')
// const db=require('../../config/connection')
// const bcrypt=require('bcrypt')
// const objId=require('mongodb').ObjectId

// module.exports={
//  addAddress(data){
   
//     let addressObj={
//              id:objId(),
//              firstName:data.firstName,
//              lastName:data.lastName,
//              street:data.street,
//              appartment:data.appartment,
//              city:data.city,
//              pincode:data.pincode,
//              mobile:data.mobile,
//              email:data.email
//      }
//      return new Promise(async(resolve,reject)=>{
//       try{
//      let address=await db.get().collection(collection.ADDRESS_COLLECTION).findOne({userId:objId(data.userId)})
  
//      if(address){
//          db.get().collection(collection.ADDRESS_COLLECTION).updateOne({userId:objId(data.userId)},
//           {
//              $push:{address:addressObj}
//           }
//          ).then((data)=>{
             
//              resolve({addressAdded:true})
//          })
//      }else{
//          let detailsObj={
//              userId:objId(data.userId),
//              address:[addressObj]
//          }
//          db.get().collection(collection.ADDRESS_COLLECTION).insertOne(detailsObj).then((data)=>{
            
//              resolve({addressAdded:true})
//          })
//      }
//   }catch(err){
//       reject()
//   }
//   })
  
//   }
// }