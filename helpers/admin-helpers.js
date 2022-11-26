const db=require('../config/connection')
const collection=require('../config/collection')
const bcrypt=require('bcrypt')
const objId=require('mongodb').ObjectId

module.exports={

    //admin-signup
    doSignup:(adminData)=>{
        return new Promise(async(resolve,reject)=>{
            adminData.password=await bcrypt.hash(adminData.password,10)
            db.get().collection(collection.ADMIN_COLLECTION).insertOne(adminData).then((result)=>{
                resolve(result)
            })
        })
    },

    //admin-login
    doLogin:(loginData)=>{
        return new Promise(async(resolve,reject)=>{

            let response={}

            let admin=await db.get().collection(collection.ADMIN_COLLECTION).findOne({email:loginData.email})
           
            if(admin){
              bcrypt.compare(loginData.password,admin.password).then((result)=>{
               
                    if(result){
                       response.status=true
                       response.admin=admin
                       console.log('Login Success');
                       resolve(response)
                    }
                    else{ 
                        response.status=false
                        console.log("Login Failed");
                        resolve({status:false})
                    }
                })

            }
            else{
                console.log("Email not found");
                resolve(response)
                
            }
        })
    },


    //get-category
    getAllCategory:()=>{
       
       return new Promise((resolve,reject)=>{
        let viewCategory=db.get().collection(collection.CATEGORY_COLLECTION).find().toArray()

        resolve(viewCategory)
       })
    },



    //add-Category
    addCategory:(category)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.CATEGORY_COLLECTION).insertOne(category).then((data)=>{
                resolve(data)
            })
        })
    },



    //get-edit-category
    getEditCategory:(eId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.CATEGORY_COLLECTION).findOne({_id:eId}).then((result)=>{
                console.log(result+'ttttttttttt');
                resolve(result)
            })
        })
    },



//edit-category
    editCategory:(eId,data)=>{
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
    },



    //delete-category
    deleteCategory:(eId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.CATEGORY_COLLECTION).deleteOne({_id:eId}).then((result)=>{
                resolve(result)
            })
        })
    },



    //find-category
    findCategory:()=>{
       return new Promise(async(resolve,reject)=>{
           let data=await db.get().collection(collection.CATEGORY_COLLECTION).find().toArray()
           console.log('4444444444444444445555555555');
           
           resolve(data)
       })
    },



    //get-products
    getAllProducts:()=>{   
        return new Promise((resolve,reject)=>{
            let products=db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
            resolve(products)
        })
    },


    findOneProduct:()=>{
        return new Promise(async(resolve,reject)=>{
            let data=await db.get().collection(collection.PRODUCT_COLLECTION).findOne()
            console.log('111111111111111111');
            console.log(data);
            resolve(data)
        })
    },

    //add-products
    addProduct:(productData)=>{
        //console.log(productData);
        return new Promise((reslove,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).insertOne(productData).then((data)=>{
                reslove(data)
            })
        })
    },






    //getAllUSers
    getAllUsers:()=>{
        return new Promise(async(resolve,reject)=>{
            let users=await db.get().collection(collection.USER_COLLECTION).find().toArray()
            resolve(users)
        })
    },
   

    //update-users
    updateUser:(uId,data)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.USER_COLLECTION).updateOne({_id:uId},
                {
                    $set:{
                        signupStatus:false
                    }
                })
                .then((result)=>{
                    resolve(result)
                })
        })
    },


    //unblock-user
    unblockUser:(uId)=>{
       return new Promise((resolve,reject)=>{
        db.get().collection(collection.USER_COLLECTION).updateOne({_id:uId},
              {
                $set:{
                    signupStatus:true
                }
              }
            )
            .then((result)=>{
                resolve(result)
            })
       })
    },


    //find-edit-products
    findEditProducts:(uId)=>{
       return new Promise((resolve,reject)=>{
         db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:uId}).then((result)=>{
            resolve(result)
         })
       })
    },


    //edit-products
    editProducts:(uId,data)=>{
        //console.log(data);
        // console.log(uId);
       return new Promise((resolve,reject)=>{
         db.get().collection(collection.PRODUCT_COLLECTION).updateOne({_id:uId},
            {
                $set:{
                    productid:data.productid,
                    productname:data.productname,
                    description:data.description,
                    productimage:data.productimage,
                    quantity:data.quantity,
                    price:data.price,
                    category:data.category
                }
            }
            )
            .then((result)=>{
               console.log(result);
                resolve(result)
            })
       })
    },


    //delete-products
    deleteProduct:(delId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).deleteOne({_id:delId}).then((result)=>{
                resolve(result)
            })
        })
    },


    getAllOrders:()=>{
        return new Promise(async(resolve,reject)=>{
            let orders=await db.get().collection(collection.ORDER_COLLECTION).find().toArray()
            console.log('trtrtrtrtrtrtrtrtrtt');
            console.log(orders);
            resolve(orders)
        })
    },

    cancelOrder: (id) => {
        console.log('xxxxxxxxxxxxxxxxx');
        console.log(id);
        return new Promise((resolve, reject) =>{
            let cancelOrder=db.get().collection(collection.ORDER_COLLECTION).updateOne({_id:objId(id)},
              {
                $set:{status:'cancelled'}
              }
            )
            resolve(cancelOrder)
        })
    },
    





}
