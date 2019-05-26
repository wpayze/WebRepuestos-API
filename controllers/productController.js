var Product = require("../models/product");

exports.createProduct = function(req, res) {

    var token = getToken(req.headers);

    if (token) {

        var user = verifyToken(token);

        var newProduct = new Product({
            name: req.body.name,
            rating: 0,
            location: req.body.location,
            description: req.body.description,
            price: req.body.price,
            seller_id: user._id,
            img: req.body.img,
            is_active: req.body.is_active,
            category_id: req.body.category_id
        });

        newProduct.save(function(err) {
            if (err) {
                return res.json({ success: false, msg: 'Error guardando el producto.' });
            }
            return res.json({ success: true, msg: 'Producto guardado correctamente.' });
        });
    } else {
        res.status(403).send({ success: false, msg: 'No autorizado.' });
    }
}

exports.getProducts = function(req, res) {

    var token = getToken(req.headers);
    var user = verifyToken(token);

    if (token) {
        Product.find({ 'seller_id': user._id }, function(err, products) {
            if (err) throw err;
            res.json(products);
        });
    } else {
        return res.status(403).send({ success: false, msg: 'No autorizado.' });
    }

}

exports.getProductsById = function(req, res) {

    var token = getToken(req.headers);

    if (token) {
        Product.find({ 'seller_id': req.params._id }, function(err, products) {
            if (err) throw err;
            res.json(products);
        });
    } else {
        return res.status(403).send({ success: false, msg: 'No autorizado.' });
    }

}

exports.getProductsByCategory = function(req, res) {

    var token = getToken(req.headers);

    if (token) {
        Product.find({ 'category_id': req.params.category_id }, function(err, products) {
            if (err) throw err;
            res.json(products);
        });
    } else {
        return res.status(403).send({ success: false, msg: 'No autorizado.' });
    }

}

exports.getProduct = function(req, res) {

    var token = getToken(req.headers);

    if (token) {

        var user = verifyToken(token);

        Product.findById(req.params._id, function(err, product) {
            if (err) throw err;
            if (product) {
                if (user._id != product.seller_id && !product.is_active) {
                    res.json({ success: false, msg: 'El producto no está activo.' });
                } else {
                    res.json(product);
                }
            } else {
                res.json({ success: false, msg: 'El producto no existe.' });
            }


        });
    }

}

exports.fuzzySearch = function(req, res) {

    if (req.body.name) {
        const regex = new RegExp(escapeRegex(req.body.name), 'gi');
        Product.find({ "name": regex, "category_id": req.body.category_id }, function(err, products) {
            if (err) {
                console.log(err);
            } else {
                res.json(products);
            }
        });
    } else {
        res.json({ success: false, msg: 'Error en la busqueda.' });
    }

}

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};