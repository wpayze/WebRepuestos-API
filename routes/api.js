var express = require('express');
var passport = require('passport');

require('../config/passport')(passport);

var router = express.Router();

var authController = require('../controllers/authController');
var productController = require('../controllers/productController');
var categoryController = require('../controllers/categoryController');
var itemListController = require('../controllers/itemListController');

router.get('/user/:_id', authController.getUser);
router.post('/register', authController.register);
router.post('/login', authController.login);

//Products
router.get('/product',
    passport.authenticate('jwt', { session: false }),
    productController.getProducts);
router.post('/product/search',
    productController.fuzzySearch);
router.get('/products/:_id',
    passport.authenticate('jwt', { session: false }),
    productController.getProductsById);
router.get('/products_category/:category_id',
    productController.getProductsByCategory);
router.get('/product/:_id',
    passport.authenticate('jwt', { session: false }),
    productController.getProduct);
router.post('/product',
    passport.authenticate('jwt', { session: false }),
    productController.createProduct);

//Categories
router.get('/category',
    categoryController.getCategories);
router.post('/category',
    passport.authenticate('jwt', { session: false }),
    categoryController.createCategory);

//Items List
router.get('/getList',
    passport.authenticate('jwt', { session: false }),
    itemListController.getList);
router.post('/addItemList',
    passport.authenticate('jwt', { session: false }),
    itemListController.addItemList);
router.post('/removeItemList',
    passport.authenticate('jwt', { session: false }),
    itemListController.removeItemList);
router.get('/clearItemList',
    passport.authenticate('jwt', { session: false }),
    itemListController.clearItemList);

router.post('/uploadImage',
    passport.authenticate('jwt', { session: false }),
    productController.uploadImage);
router.post('/pay',
    productController.pay);

module.exports = router;