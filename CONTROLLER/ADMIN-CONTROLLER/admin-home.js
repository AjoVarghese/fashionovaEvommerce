var express = require('express');
var router = express.Router();
const collection = require('../../config/collection')
const db = require('../../config/connection')

const {
    render
} = require('ejs');
const {
    response
} = require('express');
const {
    objectId
} = require('bson');
const objId = require('mongodb').ObjectId

const path = require('path');
const {
    log
} = require('console');


const moment = require('moment');


let week = moment().subtract(7, 'days').calendar()
let month = moment().subtract(30, 'days').calendar()
let year=moment().subtract(365,'days').calendar()

console.log('SSSSSSS');
console.log(week);
console.log(month);
console.log(year);

exports.admin_home_get = async (req, res) => {
    try{
    let revenue = 0
    let weeklyRevenue=0
    let monthlyRevenue=0
    exports.revenue = revenue
    if (req.session.admin) {

        let totalOrders = await getTotalOrders()
        let totalUsers = await getTotalUsers()
        let totalRevenue = await getTotalRevenue()
        let totalProducts = await getTotalProducts()
        let weeklyOrders = await getWeeklyOrders(week)
        let monthlyOrders=await getMonthlyOrders(month)
        let COD=await getAllCOD()
        let razorPay=await getAllRazorPay()
        let payPal=await getAllPaypal()
        let weeklyRazorPay=await getWeeklyRazorPay(week)
        let monthlyRazorPay=await getMOnthlyRazorPay(month)
        let yearlyRazorPay=await getYearlyRazorPay(year)
        let weeklyPayPal=await getWeeklyPayPal(week)
        let monthlyPayPal=await getMonthlyPayPal(month)
        let yearlyPayPal=await getYearlyPayPal(year)
        let weeklyCOD=await getWeeklyCOD(week)
        let monthlyCOD=await geMonthlyCOD(month)
        let yearlyCOD=await getYearlyCOD(year)
        let activeUsers=await getActiveUsers()
        let blockedUsers=await getBlockedUsers()

        for (var i = 0; i < totalRevenue.length; i++) {
            if (totalRevenue[i].status == 'Deliverd') {
                revenue = parseInt(revenue) + parseInt(totalRevenue[i].totalAmount[0].total)
            }

        }

        // -------------------------weekly Revenue-----------------------------------//
        for(vari=0;i<weeklyOrders.length;i++){
            if(weeklyOrders[i].status == 'Deliverd'){
                weeklyRevenue=parseInt(weeklyRevenue) + parseInt(weeklyOrders[i].totalAmount[0].total)
            }
        }

       //--------------------------------monthly Revenue--------------------------------------//
         for(var i=0;i<monthlyOrders.length;i++){
            if(monthlyOrders[i].status == 'Deliverd'){
                monthlyRevenue=parseInt(monthlyRevenue) + parseInt(monthlyOrders[i].totalAmount[0].total)
            }
         }
        res.render('admin-index', {
            totalOrders,
            totalUsers,
            revenue,
            totalProducts,
            weeklyOrders,
            monthlyOrders,
            weeklyOrdersCount:weeklyOrders.length,
            monthlyOrdersCount:monthlyOrders.length,
            monthlyRevenue,
            weeklyRevenue,
            COD,
            CODCount:COD.length,
            razorPay,
            razorPayCount:razorPay.length,
            payPal,
            payPalCount:payPal.length,
            weeklyRazorPay,
            weeklyRazorPayCount:weeklyRazorPay.length,
            monthlyRazorPay,
            monthlyRazorPayCount:monthlyRazorPay.length,
            yearlyRazorPay,
            yearlyRazorPayCount:yearlyRazorPay.length,
            weeklyPayPal,
            weeklyPayPalCount:weeklyPayPal.length,
            monthlyPayPal,
            monthlyPayPalCount:monthlyPayPal.length,
            yearlyPayPal,
            yearlyPayPalCount:yearlyPayPal.length,
            weeklyCOD,
            weeklyCOD:weeklyCOD.length,
            monthlyCOD,
            monthlyCODCount:monthlyCOD.length,
            yearlyCOD,
            yearlyCODCount:yearlyCOD.length,
            activeUsers,
            activeUsersCount:activeUsers.length,
            blockedUsers,
            blockedUsersCount:blockedUsers.length
        });
    } else {
        res.redirect('/admin-login')
    }
}catch{
    res.redirect('/404')
}
}



function getTotalOrders() {
    return new Promise(async (resolve, reject) => {
        let totalOrders = await db.get().collection(collection.ORDER_COLLECTION).find().count()
        resolve(totalOrders)
    })

}

function getTotalRevenue() {
    return new Promise(async (resolve, reject) => {
        let totalRevenue = await db.get().collection(collection.ORDER_COLLECTION).find().toArray()
        resolve(totalRevenue)
    })

}


function getTotalUsers() {
    return new Promise(async (resolve, reject) => {
        let totalUsers = await db.get().collection(collection.USER_COLLECTION).find().count()
        resolve(totalUsers)
    })
}


function getTotalProducts() {
    return new Promise(async (resolve, reject) => {
        let totalProducts = await db.get().collection(collection.PRODUCT_COLLECTION).find().count()
        resolve(totalProducts)
    })
}


function getWeeklyOrders(week) {
    return new Promise(async(resolve, reject) => {
        let weeklyOrders=await db.get().collection(collection.ORDER_COLLECTION).find({
            date:{$gte:week}
        }).toArray()
        resolve(weeklyOrders)     
    })
}


function getMonthlyOrders(month){
    return new Promise(async(resolve,reject)=>{
        let monthlyOrders=await db.get().collection(collection.ORDER_COLLECTION).find({
            date:{$gte:month}
        }).toArray()
        resolve(monthlyOrders)
    })
}


function getAllCOD(){
    return new Promise(async(resolve,reject)=>{
        let COD=await db.get().collection(collection.ORDER_COLLECTION).find({
            paymentMethod:"COD"
        }).toArray()
        resolve(COD)
    })
    
}

function getAllRazorPay(){
    return new Promise(async(resolve,reject)=>{
        let razorPay=await db.get().collection(collection.ORDER_COLLECTION).find({
            paymentMethod:"Razorpay"
        }).toArray()
        resolve(razorPay)
    })
}


function getAllPaypal(){
    return new Promise(async(resolve,reject)=>{
        let payPal=await db.get().collection(collection.ORDER_COLLECTION).find({
            paymentMethod:"Paypal"
        }).toArray()
        resolve(payPal)
    })
}



function getWeeklyRazorPay(week){
   return new Promise(async(resolve,reject)=>{
    let weeklyRazorPay=await db.get().collection(collection.ORDER_COLLECTION).find({
        $and:[
            {
            date:{$gte:week}
           },
           {
            paymentMethod:"Razorpay"
           }
    ]
    }).toArray()
    
    resolve(weeklyRazorPay)
   })
}


function getMOnthlyRazorPay(month){
    return new Promise(async(resolve,reject)=>{
        let monthlyRazorPay=await db.get().collection(collection.ORDER_COLLECTION).find({
            $and:[
                {
                date:{$gte:month}
               },
               {
                paymentMethod:"Razorpay"
               }
        ]
        }).toArray()
        resolve(monthlyRazorPay)
       })
}



function getYearlyRazorPay(year){
    return new Promise(async(resolve,reject)=>{
        let yearlyRazorPay=await db.get().collection(collection.ORDER_COLLECTION).find({
            $and:[
                {
                date:{$gte:year}
               },
               {
                paymentMethod:"Razorpay"
               }
        ]
        }).toArray()
        resolve(yearlyRazorPay)
       })
}



function getWeeklyPayPal(week){
    return new Promise(async(resolve,reject)=>{
        let weeklyPaypal=await db.get().collection(collection.ORDER_COLLECTION).find({
            $and:[
                {
                date:{$gte:week}
               },
               {
                paymentMethod:"Paypal"
               }
        ]
        }).toArray()
        resolve(weeklyPaypal)
       })
}


function getMonthlyPayPal(month){
    return new Promise(async(resolve,reject)=>{
        let monthlyPaypal=await db.get().collection(collection.ORDER_COLLECTION).find({
            $and:[
                {
                date:{$gte:month}
               },
               {
                paymentMethod:"Paypal"
               }
        ]
        }).toArray()
        resolve(monthlyPaypal)
       })
}


function getYearlyPayPal(year){
    return new Promise(async(resolve,reject)=>{
        let yearlyPaypal=await db.get().collection(collection.ORDER_COLLECTION).find({
            $and:[
                {
                date:{$gte:year}
               },
               {
                paymentMethod:"Paypal"
               }
        ]
        }).toArray()
        resolve(yearlyPaypal)
       })
}



function getWeeklyCOD(week){
    return new Promise(async(resolve,reject)=>{
        let weeklyCOD=await db.get().collection(collection.ORDER_COLLECTION).find({
            $and:[
                {
                date:{$gte:week}
               },
               {
                paymentMethod:"COD"
               }
        ]
        }).toArray()
        resolve(weeklyCOD)
       })
}



function geMonthlyCOD(month){
    return new Promise(async(resolve,reject)=>{
        let monthlyCOD=await db.get().collection(collection.ORDER_COLLECTION).find({
            $and:[
                {
                date:{$gte:month}
               },
               {
                paymentMethod:"COD"
               }
        ]
        }).toArray()
        
        resolve(monthlyCOD)
       })
}

function getYearlyCOD(year){
    return new Promise(async(resolve,reject)=>{
        let yearlyCOD=await db.get().collection(collection.ORDER_COLLECTION).find({
            $and:[
                {
                date:{$gte:year}
               },
               {
                paymentMethod:"COD"
               }
        ]
        }).toArray()
        
        resolve(yearlyCOD)
       })
}

function getActiveUsers(){
    return new Promise(async(resolve,reject)=>{
        let activeUsers=await db.get().collection(collection.USER_COLLECTION).find({
            signupStatus:true
        }).toArray()
        resolve(activeUsers)
    })
}

function getBlockedUsers(){
    return new Promise(async(resolve,reject)=>{
        let BlockedUsers=await db.get().collection(collection.USER_COLLECTION).find({
            signupStatus:false
        }).toArray()
        resolve(BlockedUsers)
    })
}