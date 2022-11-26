var express = require('express');
var router = express.Router();
const db=require('../config/connection')
const collection=require('../config/collection')
const userHelper=require('../helpers/user-helpers');
const { render, response } = require('../app');
const config=require('../config/config');
const { ObjectId } = require('bson');
const userHelpers = require('../helpers/user-helpers');
const objId=require('mongodb').ObjectId
const client=require('twilio')(config.accountSID,config.authToken)



var loggedUser
var loginError
var emailError
var blockedStatus
var validate
var mobileError
var mobileSignupErr
var noEmail
var findEmail
var phonenumber
var userSession
var signupStatus=true
var userId
var userCart

 const userSignupController=require('../CONTROLLER/USER-CONTROLLER/user-signup')
 const userLoginController=require('../CONTROLLER/USER-CONTROLLER/user-login')
 const otpLoginController=require('../CONTROLLER/USER-CONTROLLER/otp-login')
 const verifyEmailController=require('../CONTROLLER/USER-CONTROLLER/verifyEmailController')
 const resetPasswordController=require('../CONTROLLER/USER-CONTROLLER/resetPasswordController')
 const otpVerifyController=require('../CONTROLLER/USER-CONTROLLER/otp-verify')
 const indexController=require('../CONTROLLER/USER-CONTROLLER/index')
 const shopController=require('../CONTROLLER/USER-CONTROLLER/shop')
 const singleProductController=require('../CONTROLLER/USER-CONTROLLER/singleProduct-controller')
 const cartController=require('../CONTROLLER/USER-CONTROLLER/cartController')
 const addToCartController=require('../CONTROLLER/USER-CONTROLLER/addToCartController')
 const addToWishlistController=require('../CONTROLLER/USER-CONTROLLER/addToWishlistController')
 const wishlistController=require('../CONTROLLER/USER-CONTROLLER/wishlist')
 const removeWishListController=require('../CONTROLLER/USER-CONTROLLER/removeWishlistProduct')
 const changeProductQuantityController=require('../CONTROLLER/USER-CONTROLLER/changeProductQuantityController')
 const removeCartProductController=require('../CONTROLLER/USER-CONTROLLER/removeCartProductController')
 const applyCouponController=require('../CONTROLLER/USER-CONTROLLER/applyCouponController')
 const checkOutController=require('../CONTROLLER/USER-CONTROLLER/checkoutController')
 const addAddressController=require('../CONTROLLER/USER-CONTROLLER/addAddressController')
 const savedAddressController=require('../CONTROLLER/USER-CONTROLLER/savedAddress')
 const placeOrderController=require('../CONTROLLER/USER-CONTROLLER/placeOrder')
 const myOrdersController=require('../CONTROLLER/USER-CONTROLLER/myOrders')
 const cancelOrderController=require('../CONTROLLER/USER-CONTROLLER/cancelOrders')
 const returnOrderController=require('../CONTROLLER/USER-CONTROLLER/return-OrderController')
 const editAddressController=require('../CONTROLLER/USER-CONTROLLER/editAddressController');
const  deleteAddressController= require('../CONTROLLER/USER-CONTROLLER/deleteAddressController');
const payaplController=require('../CONTROLLER/USER-CONTROLLER/paypalController')
const razorPayController=require('../CONTROLLER/USER-CONTROLLER/razorpayController')
const userProfileController=require('../CONTROLLER/USER-CONTROLLER/userProfileController')
const changePasswordController=require('../CONTROLLER/USER-CONTROLLER/changePasswordController')
const allAddressesController=require('../CONTROLLER/USER-CONTROLLER/all-addressesController')
const userWalletController=require('../CONTROLLER/USER-CONTROLLER/walletController')
const productReviewController=require('../CONTROLLER/USER-CONTROLLER/reviewsController')



/*----------------------------------------------------- indexGet----------------------------------------------------------- */

router.get('/',indexController.index_get)

//-----------------------------------userSignupGet----------------------------------------------//
router.get('/signup',userSignupController.userSignup_get)


router.post('/signup',userSignupController.userSignup_post)

//-----------------------------------------userLoginGet-----------------------------------------------
router.get('/login',userLoginController.userLogin_get)


router.post('/login',userLoginController.userLogin_post)


//otp-login
router.get('/otp-login',otpLoginController.otpLogin_get)


router.post('/otp-login',otpLoginController.otLogin_post)


//otp-verify
router.get('/otp-verify',otpVerifyController.otpVerify_get)


router.post('/otp-verify',otpVerifyController.otpVerify_post)


router.get("/resend-otp",otpVerifyController.resendotp)

//------------------------------forgotPasswordGet--------------------------------
router.get('/verify-email',verifyEmailController.verifyEmail_get)

router.post('/verify-email',verifyEmailController.verifyEmail_post)

router.get('/reset-password',resetPasswordController.resetPassword_get)

router.post('/reset-password',resetPasswordController.resetPassword_post)



//shop
router.get('/shop',shopController.shop_get)


//single-product
router.get('/product-single',singleProductController.singleProduct_get)


//cart
router.get('/cart',cartController.cart_get)


//addToCart
router.get('/add-to-cart',addToCartController.addToCart_get)

router.post('/increase-quantity',addToCartController.increaseQuantity_post)

router.post('/decrease-quantity',addToCartController.decreaseQuantity_post)


//addToWishlist
router.get('/addToWishlist',addToWishlistController.addToWishlist_get)


//wishlist
router.get('/wishlist',wishlistController.wishlist_get)

//wishlistItemRemove
router.post('/remove-wishlist-product',removeWishListController.removeWishlistProduct_post)

//--------------------------------------------------------changeProductQuantity------------------------------------------------------------------//
router.post('/change-product-quantity',changeProductQuantityController.chanageProductQuantity_post)

//-------------------------------------------------------removeCartProduct----------------------------------------------------------------------------
router.post('/remove-cart-product',removeCartProductController.removeCartProduct_post)

//------------------------------------------------Apply Coupon-----------------------------------------------------------------------
router.put('/apply-coupon',applyCouponController.applyCoupon_post)



router.get('/checkout',checkOutController.checkoutController_post)
//address
router.get('/add-address',addAddressController.addAddress_get)

router.put('/add-address',addAddressController.addAdress_post)


//saved-address
router.get('/saved-addresses',savedAddressController.savedAddress_get)


router.post('/saved-addresses',savedAddressController.savedAddress_post)


//edit-address-get
//router.get('/edit-address',editAddressController.editAddress_get)


//edit-address-post
//router.post('/edit-address',editAddressController.editAddress_post)

//delete_address-post
router.delete('/delete-address',deleteAddressController.deleteAddress_post)

router.post('/place-order',placeOrderController.placeOrder_post)

//paypal
router.get('/paypal-payment',payaplController.paypal_get)

router.post('/paypal-payment',payaplController.paypal_post)

router.get('/paypal-success',payaplController.paypalSuccess_get)

router.get('/paypal-cancel',payaplController.paypalCancelled_get)

//---------------------------razor-pay----------------------------------------------------
router.get('/razorPay-payment',razorPayController.razorPay_get)

router.post('/razorPay-payment',razorPayController.razorPay_post)

router.get('/razorpay-success',razorPayController.razorPaySuccess_get)

router.get('/razorPay-cancel',razorPayController.razorPayCancel_get)


// ------------------------------------------------Orders------------------------------------------------------------------------//
router.get('/my-orders',myOrdersController.myOrders_get)


//-----------------------------------------------Cancel Order--------------------------------------------------------------------//
router.put('/cancel-orders',cancelOrderController.cancelOrder_post)


// ---------------------------------------------------Return Order --------------------------------------------------------//
router.put('/return-order',returnOrderController.returnOrder_post)


//-------------------------------------user-profile----------------------------------------------------------------------------//
router.get('/user-profile',userProfileController.userProfile_get)

//-------------------------------------all-addresses-----------------------------------------------------------------------------//
router.get('/all-addresses',allAddressesController.allAddresses_get)

router.get('/edit-address',editAddressController.editAddress_get)

router.post('/edit-address',editAddressController.editAddress_post)


// ----------------------------------------change-password---------------------------------------------------------------------------//
router.get('/change-password',changePasswordController.changePassword_get)

router.post('/change-password',changePasswordController.changePassword_post)


//------------------------------------------user-wallet-------------------------------------------------------------------------//
router.get('/wallet',userWalletController.wallet_get)


//-------------------------------------product-reviews------------------------------------------------------------------------//
router.get('/product-review',productReviewController.userReviews_get)

router.post('/product-review',productReviewController.userReviews_post)




//men
router.get('/men',(req,res,next)=>{
  res.render('men')
})


//formal-shirts
router.get('/formal-shirts',(req,res,next)=>{
  res.render('formal-shirts')
})

//casual-shirts
router.get('/casual-shirts',(req,res,next)=>{
  res.render('casual-shirts')
})


router.get('/jeans',(req,res,next)=>{
  res.render('jeans')
})



router.get('/pants',(req,res,next)=>{
  res.render('pants')
})



router.get('/women',(req,res,next)=>{
  res.render('women')
})


router.get('/skirts',(req,res,next)=>{
  res.render('skirts')
})


router.get('/dresses',(req,res,next)=>{
  res.render('dresses')
})


router.get('/sarees',(req,res,next)=>{
  res.render('sarees')
})


router.get('/kurta-kurti',(req,res,next)=>{
  res.render('kurta-kurti')
})






router.get('/account',(req,res,next)=>{
  res.render('account')
})







router.get('/about',(req,res,next)=>{
  res.render('about')
})



router.get('/contact',(req,res,next)=>{
  res.render('contact')
})




router.get('/logout',(req,res,next)=>{
   req.session.user=false
   req.session.returnTo=false;
  res.redirect('/login')
})

module.exports = router;
