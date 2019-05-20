var Product = require("../models/product");

exports.createProduct = function (req, res) {

    var token = getToken(req.headers);

    if (token) {

        var user = verifyToken(token);

        var newProduct = new Product({
            name: req.body.name,
            rating: 0,
            location: req.body.location,
            description: req.body.description,
            price: req.body.price,
            user_id: user._id,
            img: req.body.img,
            is_active: req.body.is_active
        });

        newProduct.save(function (err) {
            if (err) {
                return res.json({ success: false, msg: 'Error guardando el producto.' });
            }
            return res.json({ success: true, msg: 'Producto guardado correctamente.' });
        });
    } else {
        res.status(403).send({ success: false, msg: 'No autorizado.' });
    }
}

exports.getProducts = function (req, res) {

    var token = getToken(req.headers);
    var user = verifyToken(token);

    if (token) {
        Product.find({ 'user_id': user._id }, function (err, products) {
            if (err) throw err;
            res.json(products);
        });
    } else {
        return res.status(403).send({ success: false, msg: 'No autorizado.' });
    }

}

exports.getProduct = function (req, res) {

    var token = getToken(req.headers);

    if (token) {
        
        var user = verifyToken(token);

        Product.findById(req.params._id, function (err, product) {
            if (err) throw err;

            if (user._id != product.user_id && !product.is_active){
                res.json({success: false, msg: 'El producto no está activo.'});
            }else{
                res.json(product);
            }
        });
    }

}