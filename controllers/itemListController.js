var ItemList = require("../models/itemList");
var Product = require("../models/product");

exports.addItemList = function(req, res) {

    var token = getToken(req.headers);

    if (token) {

        var user = verifyToken(token);

        ItemList.find({ 'user_id': user._id, 'product_id': req.body.product_id }, function(err, item) {
            if (err) throw err;
            if (item.length != 0) {
                return res.json({ success: false, msg: 'El item ya esta en su lista' });
            } else {
                var newItemList = new ItemList({
                    user_id: user._id,
                    product_id: req.body.product_id
                });

                newItemList.save(function(err) {
                    if (err) {
                        return res.json({ success: false, msg: 'Error agregando item a su lista.' });
                    } else {
                        return res.json({ success: true, msg: 'Item agregado a la lista.' });
                    }
                });
            }
        });
    } else {
        res.status(403).send({ success: false, msg: 'No autorizado.' });
    }
}

exports.removeItemList = function(req, res) {

    var token = getToken(req.headers);

    if (token) {

        var user = verifyToken(token);

        ItemList.remove({ 'user_id': user._id, 'product_id': req.body.product_id }, function(err) {
            if (err) {
                throw err;
            } else {
                return res.json({ success: true, msg: 'Repuesto eliminado de la lista.' });
            }

        });
    } else {
        res.status(403).send({ success: false, msg: 'No autorizado.' });
    }
}

exports.getList = function(req, res) {

    var token = getToken(req.headers);

    if (token) {

        var user = verifyToken(token);

        ItemList.find({ 'user_id': user._id }, function(err, items) {
            if (err) throw err;

            if (items.length == 0) {
                return res.json({ success: true, msg: 'No tiene productos en su lista.' });
            } else {
                var products_id = [];

                items.forEach(item => {
                    products_id.push(item.product_id);
                });

                Product.find({
                    _id: {
                        $in: products_id
                    }
                }, function(err, products) {
                    if (err) throw err;

                    if (products.length > 0) {
                        return res.json(products);
                    } else {
                        return res.json({ success: true, msg: 'No tiene productos en su lista.' });
                    }
                });

            }
        });
    } else {
        res.status(403).send({ success: false, msg: 'No autorizado.' });
    }
}

exports.clearItemList = function(req, res) {

    var token = getToken(req.headers);

    if (token) {

        var user = verifyToken(token);

        ItemList.remove({ 'user_id': user._id }, function(err) {
            if (err) {
                throw err;
            } else {
                return res.json({ success: true, msg: 'Lista vaciada.' });
            }

        });
    } else {
        res.status(403).send({ success: false, msg: 'No autorizado.' });
    }
}