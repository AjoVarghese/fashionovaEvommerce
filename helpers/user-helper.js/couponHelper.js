const collection=require('../../config/collection')
const db=require('../../config/connection')
const bcrypt=require('bcrypt')
const objId=require('mongodb').ObjectId



module.exports={
     getCoupon(data, userId,total) {
        let date_obj = new Date();
            try{
        return new Promise(async (resolve, reject) => {
            coupon = await db.get().collection(collection.COUPON_COLLECTION).findOne({
                couponCode: data.couponCode
            })
            
            let user = await checkUser(userId, data)
            console.log("REDEEMED USERS");
            console.log(user+"THIS IS THE PLACE WHERE COUPON ");
           
            if(user==null){
           
                if (coupon && coupon.couponQuantity > 0 ) {
                    console.log("DATE");
                    console.log(date_obj);
                    console.log(coupon.endingDate);
                    if(date_obj <= coupon.endingDate){
                      if (total.totalPrice >= coupon.minPrice) {
                        
                        couponTotal = parseInt(total.totalPrice) - parseInt(coupon.couponAmount)
                        console.log("COUPON AMOUNTTTTTTTTT");
                        console.log(coupon.couponAmount);
                        exports.cartAmount = couponTotal
                        resolve({
                            couponApplied: true,
                            couponTotal
                        })
                    } else {
                        resolve({
                            notApplicable: true
                        })
                    }    
                } else{
                        resolve({
                            couponExpired:true
                        })
                    }
            } else {
                resolve({
                    invalidCoupon: true
                })
            }
        }else{
           resolve({
            couponUsed:true
           })
        }
            couponTotal = 0
        })
    
            }catch(err){
                console.log(err,'error at get coupon function');
            }
    }
}

function checkUser(userId,coupon){
    return new Promise((resolve,reject)=>{
        db.get().collection(collection.COUPON_COLLECTION).findOne({couponCode:coupon.couponCode,'users.userId':objId(userId)}).then((data)=>{
            console.log("USERS");
            console.log(data);
            resolve(data)
        })
    })
}