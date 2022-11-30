var express = require('express');
var router = express.Router();
const db = require('../../config/connection')
const collection = require('../../config/collection')
const objId = require('mongodb').ObjectId


const total=require('../USER-CONTROLLER/cartController')
const cartTotal=require('../USER-CONTROLLER/applyCouponController')


exports.checkoutController_post = async (req, res) => {
  try{
    if (req.session.user) {
        var id = new objId(req.query.id)
        let orderedProducts = await getOrderedProducts(req.session.user._id)
        var totalPrice = await getTotalPrice(req.session.user._id)
        let selectedAddress = await getSelectedAddress(req.session.user._id, id)
        let wallet=await getWalletTotal(req.session.user._id)
        res.render('checkout', {
            totalPrice:total.totalPrice,
            loggedUser: req.session.user,
            selectedAddress,
            orderedProducts,
            wallet,
            couponTotal:cartTotal.cartAmount
        })
    } else {
        res.redirect('/login')
   }
}catch{
    res.redirect('/404')
}

}


function getSelectedAddress(userId, Id) {
    return new Promise(async (resolve, reject) => {
        let selectedAddress = await db.get().collection(collection.ADDRESS_COLLECTION).aggregate([{
                $match: {
                    userId: objId(userId)
                }
            },

            {
                $unwind: '$address'
            },
            {
                $match: {
                    'address.id': Id
                }
            }

        ]).toArray()

        resolve(selectedAddress)
    })
}


function getTotalPrice(userId) {
    return new Promise(async (resolve, reject) => {
        var totalPrice = await db.get().collection(collection.CART_COLLECTION).aggregate([{
                $match: {
                    userId: objId(userId)
                }

            },
            {
                $unwind: '$products'
            },
            {
                $project: {
                    item: '$products.item',
                    quantity: '$products.quantity'
                }
            },
            {
                $lookup: {
                    from: collection.PRODUCT_COLLECTION,
                    localField: 'item',
                    foreignField: '_id',
                    as: 'products'
                }
            },
            {
                $project: {
                    item: 1,
                    quantity: 1,
                    products: {
                        $arrayElemAt: ['$products', 0]
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: {
                            $multiply: [{
                                $toInt: '$quantity'
                            }, {
                                $toInt: '$products.price'
                            }]
                        }
                    }
                }
            }
        ]).toArray()

        resolve(totalPrice)


    })
}



function getOrderedProducts(id) {

    return new Promise(async (resolve, reject) => {
        let products = await db.get().collection(collection.CART_COLLECTION).aggregate([{
                $match: {
                    userId: objId(id)
                }
            },
            {
                $unwind: '$products'
            },
            {
                $project: {
                    item: '$products.item',
                    quantity: '$products.quantity'
                }
            },
            {
                $lookup: {
                    from: collection.PRODUCT_COLLECTION,
                    localField: 'item',
                    foreignField: '_id',
                    as: 'products'
                }
            },
            {
                $unwind: '$products'
            }

        ]).toArray()

        resolve(products)

    })
}

function getWalletTotal(userId){
    return new Promise(async(resolve,reject)=>{
      let total=0
        let walletExists=await db.get().collection(collection.WALLET_COLLECTION).findOne({userId:objId(userId)})
       
        if(walletExists){
            db.get().collection(collection.WALLET_COLLECTION).findOne({userId:objId(userId)}).then((data)=>{
                console.log("WALLET AMOUNT");
                console.log(data);
                resolve(data.walletAmount)
             })
            
        }else{
            total=0;
            console.log("ELSE");
            console.log(total);
            resolve(total)
        }
         
    })
  }