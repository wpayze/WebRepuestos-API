var express = require('express');
var passport = require('passport');

require('../config/passport')(passport);

var router = express.Router();

var authController = require('../controllers/authController');
var productController = require('../controllers/productController');
var categoryController = require('../controllers/categoryController');
var itemListController = require('../controllers/itemListController');
var commentController = require('../controllers/commentController');
var saleController = require('../controllers/saleController');
var configController = require('../controllers/configController');

router.get('/', function(req,res) {
    res.send('NodeJS - Express API (WILFREDO PAIZ REON)');
});

router.get('/user/:_id', authController.getUser);
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/rating/:_id/:rating',
    authController.addRating);
router.get('/rated/:_id/:user_id',
    authController.addRated);

//Products
router.get('/product',
    productController.getProducts);
router.post('/product/search',
    productController.fuzzySearch);
router.get('/products/:_id',
    productController.getProductsById);
router.get('/products_category/:category_id',
    productController.getProductsByCategory);
router.get('/product/:_id',
    productController.getProduct);
router.get('/product/:_id/:qty',
    productController.reduceQty);
router.post('/product',
    passport.authenticate('jwt', { session: false }),
    productController.createProduct);

router.post('/config',
    configController.addConfig);

router.post('/product/update/:_id',
    passport.authenticate('jwt', { session: false }),
    productController.updateProduct);
router.delete('/product/:_id',
    passport.authenticate('jwt', { session: false }),
    productController.deleteProduct);

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

//Comentarios
router.post('/comment/get',
    commentController.getComments);
router.post('/comment',
    passport.authenticate('jwt', { session: false }),
    commentController.addComment);

router.post('/uploadImage',
    passport.authenticate('jwt', { session: false }),
    productController.uploadImage);
router.post('/pay',
    productController.pay);

//Sales
router.post('/sale',
    passport.authenticate('jwt', { session: false }),
    saleController.addSale);
router.get('/sale/activate/:_id',
    passport.authenticate('jwt', { session: false }),
    saleController.activateSale);
router.get('/sale',
    passport.authenticate('jwt', { session: false }),
    saleController.getSales);
router.get('/sale/:_id',
    passport.authenticate('jwt', { session: false }),
    saleController.getSale);

module.exports = router;