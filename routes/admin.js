var express = require('express');
var router = express.Router();
const collection = require('../config/collection')
const db = require('../config/connection')
//const adminHelper=require('../helpers/admin-helpers')
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
const multer = require('multer')
const fs = require('fs')
const path = require('path');
const {
    log
} = require('console');

//const store=require('../multer')
//const files=require('files')

const adminLoginController = require('../CONTROLLER/ADMIN-CONTROLLER/admin-login')
const adminHomeController = require('../CONTROLLER/ADMIN-CONTROLLER/admin-home')
const categoryController = require('../CONTROLLER/ADMIN-CONTROLLER/category')
const addproductController = require('../CONTROLLER/ADMIN-CONTROLLER/add-products')
const viewProductsController = require('../CONTROLLER/ADMIN-CONTROLLER/view-products')
const editProductController = require('../CONTROLLER/ADMIN-CONTROLLER/edit-product')
const deleteProductController = require('../CONTROLLER/ADMIN-CONTROLLER/delete-product')
const viewUsersController = require('../CONTROLLER/ADMIN-CONTROLLER/users')
const blockUserController = require('../CONTROLLER/ADMIN-CONTROLLER/userBlock')
const unblockUserController = require('../CONTROLLER/ADMIN-CONTROLLER/userUnblock')
const allOrdersController = require('../CONTROLLER/ADMIN-CONTROLLER/allOrders')
const viewOrdersController = require('../CONTROLLER/ADMIN-CONTROLLER/viewOrders')
const cancelOrderController = require('../CONTROLLER/ADMIN-CONTROLLER/admin-cancelOrder')
const shipOrderController=require('../CONTROLLER/ADMIN-CONTROLLER/order-shippedController')
const deliverOrderController=require('../CONTROLLER/ADMIN-CONTROLLER/order-deliverController')
const addCouponController = require('../CONTROLLER/ADMIN-CONTROLLER/add-coupons')
const viewCouponController=require('../CONTROLLER/ADMIN-CONTROLLER/viewCouponController')
const deleteCouponController=require('../CONTROLLER/ADMIN-CONTROLLER/delete-couponController')
const adminLogoutController = require('../CONTROLLER/ADMIN-CONTROLLER/admin-logout')
const adminProfileController = require('../CONTROLLER/ADMIN-CONTROLLER/admin-profile')
const salesReportController=require('../CONTROLLER/ADMIN-CONTROLLER/salesReportController')
const categoryOfferController=require('../CONTROLLER/ADMIN-CONTROLLER/category-offerController')
const deleteCategoryOfferController=require('../CONTROLLER/ADMIN-CONTROLLER/delete-categoryOfferController')
const editCategoryOfferController=require('../CONTROLLER/ADMIN-CONTROLLER/edit-categoryOfferController')
const viewReviewController=require('../CONTROLLER/ADMIN-CONTROLLER/viewReviewController')
const viewProductReviewController=require('../CONTROLLER/ADMIN-CONTROLLER/productReviewController')


var adminSession
var loginError


/*---------------------------------------------------AdminHomeGet-------------------------------------------------------------------------*/
router.get('/admin', adminHomeController.admin_home_get)



/*---------------------------------------------------AdminLoginGet-------------------------------------------------------------------------*/

router.get('/admin-login', adminLoginController.admin_login_get)



/*---------------------------------------------------AdminLoginPost-------------------------------------------------------------------------*/

router.post('/admin-login', adminLoginController.admin_login_post)



//----------------------------------------------------AddCategoryGet-------------------------------------------------------//

router.get('/add-category', categoryController.admin_addCategory_get)



//----------------------------------------------------AddCategoryPost---------------------------------------------------------------------------------//
router.post('/add-category', categoryController.admin_addCategory_post)




//-----------------------------------------------------viewCategoryGet------------------------------------------------------------------------//

router.get('/view-category', categoryController.admin_viewCategory_get)



//-----------------------------------------------------editCategoryGet----------------------------------------------------------------------//

router.get('/edit-category', categoryController.admin_editCategory_get)



//-----------------------------------------------------editCategoryPost----------------------------------------------------------------//
router.post('/edit-category', categoryController.admin_editCategory_post)



//-----------------------------------------------------delete-category--------------------------------------------------------------------//
router.get('/delete-category', categoryController.admin_deleteCategory_get)



//-----------------------------------------------------addProductsGet------------------------------------------------------------------------------//

router.get('/add-products', addproductController.admin_addProducts_get)



//-----------------------------------------------------addProductsPost----------------------------------------------------------------------------//
var storage = multer.diskStorage({

    destination: function (req, file, cb) {
        console.log('ggggggggggggggggggggggggggggggggggg');
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

var upload = multer({
    storage: storage
})

var multipleUpload = upload.fields([{
    name: 'productimage1',
    maxcount: 1
}, {
    name: 'productimage2',
    maxcount: 1
}, {
    name: 'productimage3',
    maxcount: 1
}])


var images

router.post('/add-products', multipleUpload, addproductController.admin_addProducts_post)



//-----------------------------------------------------productsGet---------------------------------------------------------------------------//

router.get('/products', viewProductsController.admin_products_get)



//-----------------------------------------------------editProductGet-------------------------------------------------------------------------------------//
var images

router.get('/edit-product', editProductController.admin_editProduct_get)



//-----------------------------------------------------editProductPost----------------------------------------------------------------------//
router.post('/edit-product', upload.single("productimage"), editProductController.admin_editProduct_post)



//-----------------------------------------------------deleteProductGet--------------------------------------------------------------------------//
router.get('/delete-product', deleteProductController.admin_deleteProduct_get)



//-------------------------------------------------------usersGet-----------------------------------------------------------------------------------------------------//
router.get('/users', viewUsersController.admin_users_get)



//---------------------------------------------------------block-user---------------------------------------------------------------------------------//
router.get('/update-user', blockUserController.admin_userBlock_get)



//---------------------------------------------------------unblock-user------------------------------------------------------------------------------//
router.get('/unblock-user', unblockUserController.admin_unblockUser_get)



//--------------------------------------------------------allordersGet------------------------------------------------------------------------------//
router.get('/orders', allOrdersController.admin_allOrders_get)



//---------------------------------------------------------viewOrders-------------------------------------------------------------------------------//
router.get('/view-orders', viewOrdersController.admin_viewOrders_get)



//---------------------------------------------------------cancelOrder------------------------------------------------------------------------------//
router.post('/cancel-order', cancelOrderController.admin_cancelOrder_post)



//----------------------------------------------------------ship-order-----------------------------------------------//
router.post('/ship-order',shipOrderController.orderShipped_post)




//----------------------------------------------------------deliver-order------------------------------------------------------------//
router.post('/deliver-order',deliverOrderController.orderDelivered_post)




//----------------------------------------------------------Sales_Report--------------------------------------------------------------//
router.get('/sales-report',salesReportController.salesReport_get)


//-----------------------------------------------category-offer-------------------------------------------------------------//
router.get('/category-offer',categoryOfferController.categoryOffer_get)

router.post('/category-offer',categoryOfferController.categoryOffer_post)

router.post('/delete-categoryOffer',deleteCategoryOfferController.deleteCategoryOffer_post)

router.get('/edit-categoryOffer',editCategoryOfferController.editCategoryOffer_get)

router.post('/edit-categoryOffer',editCategoryOfferController.editCategoryOffer_post)


//-----------------------------------------------------------addCoupons-----------------------------------------------------------------//
router.get('/add-coupons', addCouponController.admin_Coupons_get)

router.post('/add-coupons',addCouponController.admin_Coupons_post)

router.get('/coupons',viewCouponController.viewCoupon_get)

router.post('/delete-coupon',deleteCouponController.deleteCoupon_post)


// ------------------------viewReviews--------------------------------//
router.get('/view-reviews',viewReviewController.viewReview_get)


// -----------------------------viewProductReview--------------------------------//
router.get('/view-reviewDetails',viewProductReviewController.productReview_get)


//-------------------------------------------------------------adminProfile---------------------------------------------------------------//
router.get('/admin-profile', adminProfileController.admin_profile_get)




//--------------------------------------------------------------logout-----------------------------------------------------------------------//
router.get('/admin-logout', adminLogoutController.admin_logout_get)




module.exports = router;