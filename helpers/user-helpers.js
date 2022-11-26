

const db=require('../config/connection')
const collection=require('../config/collection')
const bcrypt=require('bcrypt');
const objId=require('mongodb').ObjectId
const { resolveInclude } = require('ejs');
const { response } = require('../app');
const date = require("date-and-time");
const moment = require('moment');

module.exports={

    doSignup:(userData)=>{
        
               userData.signupStatus=true
        return new Promise(async(resolve,reject)=>{
            userData.password=await bcrypt.hash(userData.password,10)
            db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data)=>{
                  resolve(data)
            })
        })
    },

    doLogin:(loginData)=>{
        console.log(loginData);
        return new Promise(async(resolve,reject)=>{
         let loginStatus=true
         let response={}
         
         let user=await db.get().collection(collection.USER_COLLECTION).findOne({email:loginData.email})
          
         if(user){

            bcrypt.compare(loginData.password,user.password).then((status)=>{
                  
                if(status){
                   response.status=true
                   response.user=user
                   console.log('77777777777777777777');
                   
                    console.log('Login Success');
                    resolve(response)
                }
                else{
                    console.log('Login Failed');
                    resolve(response)
                }
            })
         }
         else{
            console.log('Email not found');
            resolve(response)
         }
        })
    },

    doDisplayProducts:()=>{
        return new Promise(async(resolve,reject)=>{
            var result=await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
            
                resolve(result)
            
            
        })
    },


    productSingle:(id)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:id}).then((result)=>{
            resolve(result)
            })
        })
    },
    



    //add-to-cart
    addtoCart:(proId,userId)=>{
           let proObj={
              item:objId(proId),
              quantity:1
           }
        return new Promise(async(resolve,reject)=>{
            let userCart=await db.get().collection(collection.CART_COLLECTION)
            .findOne({userId:objId(userId)})
            console.log(objId(userId));
            if(userCart){
                let proExist=userCart.products.findIndex(product=> product.item == proId)
                 if(proExist != -1){
                    db.get().collection(collection.CART_COLLECTION).updateOne({'products.item':objId(proId),userId:objId(userId)},
                      {
                        $inc:{'products.$.quantity':1}
                        
                      }
                    ).then((data)=>{
                        console.log('quantity');
                        resolve()
                    })
                 }else{
                    db.get().collection(collection.CART_COLLECTION)
                    .updateOne({userId:objId(userId)},
                       
                        {
                            $push:{ products:proObj}
                        }
                    ).then((response)=>{
                        console.log('hiii');
                        console.log(response);
                        resolve(response)
                    })
                 }
                

            }else{
                console.log('creating Cart');
               let cartObj={
                userId:objId(userId),
                products:[proObj]
               }
               db.get().collection(collection.CART_COLLECTION).insertOne(cartObj).then((response)=>{
                console.log('creating cartttttt');
                resolve({response})
               })
            }
        })
    },




    //getCartProducts
    getCartProducts:(userId)=>{
        return new Promise(async(resolve,reject)=>{
           let cartItems=await db.get().collection(collection.CART_COLLECTION).aggregate([
            {
                $match:{userId:objId(userId)}
            },
            {
                $unwind:'$products'
            },
            {
                $project:{
                    item:'$products.item',
                    quantity:'$products.quantity'
                }

            },

            {
                $lookup:{
                    from:collection.PRODUCT_COLLECTION,
                    localField:'item',
                    foreignField:'_id',
                    as:'products'
                }
            },
            
            {
                $project:{
                   item:1,
                   quantity:1,
                   products:{$arrayElemAt:['$products',0]}
                }
            }
           ]).toArray()
           console.log('hhhhh');
           //console.log(cartItems[0].products);
           resolve(cartItems)
        })
    },

    getCartCount:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            let count=0
            let cart=await db.get().collection(collection.CART_COLLECTION).findOne({userId:objId(userId)})
            if(cart){
              count=cart.products.length
            }
            resolve(count)
        })
    },


    changeProductQuantity:(details)=>{
        count=parseInt(details.count)
        quantity=parseInt(details.quantity)
       
        return new Promise((resolve,reject)=>{
            if(count == -1 && quantity == 1){
                
                db.get().collection(collection.CART_COLLECTION)
                .updateOne({_id:objId(details.cart)},
                 {
                    $pull:{products:{item:objId(details.product)}}
                 }
                ).then((response)=>{
                    resolve({removeProduct:true})
                })
            }else{
            db.get().collection(collection.CART_COLLECTION)
            .updateOne({_id:objId(details.cart),'products.item':objId(details.product)},
              {
                $inc:{'products.$.quantity':count}
              }
            ).then(()=>{
                resolve({status:true})
            })
        }
        })
    },

    getTotalPrice:(userId)=>{
        return new Promise(async(resolve,reject)=>{
           var totalPrice= await db.get().collection(collection.CART_COLLECTION).aggregate([
                {
                    $match:{userId:objId(userId)}
            
                },
                {
                    $unwind:'$products'
                },
                {
                    $project:{
                        item:'$products.item',
                        quantity:'$products.quantity'
                    }
                },
                {
                    $lookup:{
                        from:collection.PRODUCT_COLLECTION,
                        localField:'item',
                        foreignField:'_id',
                        as:'products'
                    }
                },
                {
                    $project:{
                        item:1,quantity:1,
                        products:{$arrayElemAt:['$products',0]}
                    }
                },
                {
                   $group:{
                    _id:null,
                    total:{$sum:{$multiply:[{$toInt:'$quantity'},{$toInt:'$products.price'}]}}
                   }
                }
            ]).toArray() 
              console.log('ooooooooooooooooo');
              console.log(totalPrice);
                resolve(totalPrice)
            
            
        })
    },


    // removeCartProduct

    removeCartProduct:(data)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.CART_COLLECTION)
                .updateOne({_id:objId(data.cart)},
                 {
                    $pull:{products:{item:objId(data.product)}}
                 }
                ).then((response)=>{
                    
                    resolve({removeCartProduct:true})
                })
        })
    },

    addAddress:(data)=>{
         console.log('ffrfrfrf');
         console.log(data.userId);
       let addressObj={
                id:objId(),
                firstName:data.fname,
                lastName:data.lname,
                street:data.street,
                appartment:data.appartment,
                city:data.city,
                pincode:data.pincode,
                mobile:data.mobile,
                email:data.email
            
        }
        return new Promise(async(resolve,reject)=>{
        let address=await db.get().collection(collection.ADDRESS_COLLECTION).findOne({userId:objId(data.userId)})

        if(address){
            db.get().collection(collection.ADDRESS_COLLECTION).updateOne({userId:objId(data.userId)},
             {
                $push:{address:addressObj}
             }
            ).then((data)=>{
                
                resolve(data)
            })
        }else{
            let detailsObj={
                userId:objId(data.userId),
                address:[addressObj]
            }
            db.get().collection(collection.ADDRESS_COLLECTION).insertOne(detailsObj).then((data)=>{
               
                resolve(data)
            })
        }
    })
    },

    // getAddress
     getAddress:(userId)=>{
       return new Promise(async(resolve,reject)=>{
         let address=await db.get().collection(collection.ADDRESS_COLLECTION).aggregate([
            {
               $match:{userId:objId(userId)}
            },
            {
                $unwind:'$address'
            }
        ]).toArray()
        console.log('ffffff');
        console.log(address.length);
        resolve(address)
       })
     },

    //  getSelectedAddress:(userId,Id)=>{
    //     return new Promise((resolve,reject)=>{
    //         db.get().collection(collection.ADDRESS_COLLECTION).findOne({userId:objId(userId)},{_id:Id}).then((result)=>{
    //             console.log('ssasasasasasasasasasas');
    //             console.log(result);
    //              resolve(result)
    //         })
    //     })
    //  },
    getSelectedAddress:(userId,Id)=>{
        console.log('rrrrrrrrrrrrrrrrrr');
        console.log(Id);
        console.log(userId);
        return new Promise(async(resolve,reject)=>{
           let selectedAddress=await db.get().collection(collection.ADDRESS_COLLECTION).aggregate([
                {
                    $match:{userId:objId(userId)}
                },
                
                {
                    $unwind:'$address'
                },
                {
                    $match:{'address.id':Id}
                }
                
            ]).toArray()
            console.log('ggggggggggggggggg');
            console.log(selectedAddress);
            resolve(selectedAddress)
        })
    },

    //placeOrder
   placeOrder:(address,products,cartQuantity,totalPrice,userId)=>{
    console.log('quantity');
    console.log(cartQuantity);
    console.log('555555555555555555');
    console.log(userId);
    console.log('lllllllllll');
    console.log(products);
    return new Promise((resolve,reject)=>{
        let status=address['payment-method'] === 'COD'?'placed':'pending'
      let orderObj={
        deliveryDetails:{
            name:address.fname,
            appartment:address.appartment,
            street:address.street,
            city:address.city,
            mobile:address.mobile,
            email:address.email
        },
        userId:objId(userId),
        productDetails:products,
        quantity:cartQuantity,
        totalAmount:totalPrice,
        status:status,
        date:moment().format('MMMM Do YYYY, h:mm:ss a'),
      }
      db.get().collection(collection.ORDER_COLLECTION).insertOne(orderObj)
       
        db.get().collection(collection.CART_COLLECTION).deleteOne({userId:objId(userId)})
      resolve()
    })
    
   },


    getCartProductsList:(userId)=>{
        console.log('errrrrrrrrrr');
        console.log(userId);
        return new Promise(async(resolve,reject)=>{
            let cart=await db.get().collection(collection.CART_COLLECTION).aggregate([
                {
                $match:{userId:objId(userId)}
                },
                {
                    $unwind:'$products'
                },
                {
                    $project:{
                        'products.item':1,'products.quantity':1
                    }
                },
                {
                    $lookup:{
                        from:collection.PRODUCT_COLLECTION,
                        localField:'products.item',
                        foreignField:'_id',
                        as:'products'
                    }
                },
                {
                    $unwind:'$products'
                },
                {
                    $project:{
                        'products':1
                    }
                }
                
            ]).toArray()
            console.log('nnnnnnnnnnnnn');
            console.log(cart);
            resolve(cart)
        })
    },


    getCartQuantity:(userId)=>{
      return new Promise(async(resolve,reject)=>{
        let quantity=await db.get().collection(collection.CART_COLLECTION).aggregate([
            {
                $match:{userId:objId(userId)}
            },
            {
                $unwind:'$products'
            }
            
        ]).toArray()
          console.log('qqqqqqqqqqq');
          console.log(quantity[0].products.quantity);
          resolve(quantity[0].products.quantity)
      
    })
},

    //getAllOrders
    getAllOrders:(userId,totalPrice)=>{
        console.log('dsdsdsdsdsdsdsdsdsdsdsdsd');
        console.log(userId);
    return new Promise(async(resolve,reject)=>{
       let orders=await db.get().collection(collection.ORDER_COLLECTION).aggregate([
        {
            $match:{userId:objId(userId)}
        },
        
        
       ]).toArray()
       console.log('1111111111111111111111111');
       //console.log(orders[0].productDetails);
        resolve(orders)
     })
    },


    //cancelOrder
    cancelOrder:(details)=>{
        console.log('+++++++++++++++++++++');
        console.log(details);
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.ORDER_COLLECTION)
            .updateOne({_id:objId(details.order)},
               
               {
                $set:{status:'Cancelled'}
               }
            ).then((response)=>{
                console.log('hhhhhhhhhhhhhhhhh');
                console.log(response);
                resolve({cancelOrder:true})
            })
        })
    }
}
