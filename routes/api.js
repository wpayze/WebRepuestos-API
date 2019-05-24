var express = require('express');
var passport = require('passport');

require('../config/passport')(passport);

var router = express.Router();

var authController = require('../controllers/authController');
var productController = require('../controllers/productController');

router.get('/user/:_id', authController.getUser);
router.post('/register', authController.register);
router.post('/login', authController.login);

router.get('/product',
    passport.authenticate('jwt', { session: false }),
    productController.getProducts);

router.get('/products/:_id',
    passport.authenticate('jwt', { session: false }),
    productController.getProductsById);

router.get('/product/:_id',
    passport.authenticate('jwt', { session: false }),
    productController.getProduct);

router.post('/product',
    passport.authenticate('jwt', { session: false }),
    productController.createProduct);

module.exports = router;