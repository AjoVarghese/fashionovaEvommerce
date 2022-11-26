// const collection=require('../../config/collection')
// const db=require('../../config/connection')
// const bcrypt=require('bcrypt')
// const objId=require('mongodb').ObjectId

// module.exports={
//  addtoCart(proId, userId) {
//     let proObj = {
//       item: objId(proId),
//       quantity: 1
//     }
//     return new Promise(async (resolve, reject) => {
//       let userCart = await db.get().collection(collection.CART_COLLECTION)
//         .findOne({
//           userId: objId(userId)
//         })
  
//       if (userCart) {
//         let proExist = userCart.products.findIndex(product => product.item == proId)
//         if (proExist != -1) {
//           db.get().collection(collection.CART_COLLECTION).updateOne({
//             'products.item': objId(proId),
//             userId: objId(userId)
//           }, {
//             $inc: {
//               'products.$.quantity': 1
//             }
  
//           }).then((data) => {
//             console.log('quantity');
//             resolve()
//           })
//         } else {
//           db.get().collection(collection.CART_COLLECTION)
//             .updateOne({
//                 userId: objId(userId)
//               },
  
//               {
//                 $push: {
//                   products: proObj
//                 }
//               }
//             ).then((response) => {
  
//               resolve(response)
//             })
//         }
  
//       } else {
  
//         let cartObj = {
//           userId: objId(userId),
//           products: [proObj]
//         }
//         db.get().collection(collection.CART_COLLECTION).insertOne(cartObj).then((response) => {
  
//           resolve({
//             response
//           })
//         })
//       }
//     })
//   },
  
  
//    increase(proId, userId) {
//     return new Promise(async (resolve, reject) => {
  
//       let cart = await db.get().collection(collection.CART_COLLECTION).find({
//         userId: objId(userId)
//       }).toArray()
//       db.get().collection(collection.CART_COLLECTION).updateOne({
//         userId: objId(userId),
//         'products.item': objId(proId)
//       }, {
//         $inc: {
//           'products.$.quantity': 1
//         }
//       })
  
//     })
//   },
  
  
//    decrease(proId, userId) {
//     return new Promise((resolve, reject) => {
//       db.get().collection(collection.CART_COLLECTION).updateOne({
//         userId: objId(userId),
//         'products.item': objId(proId)
//       }, {
//         $inc: {
//           'products.$.quantity': -1
//         }
//       })
  
  
//     })
//   },
  
// }