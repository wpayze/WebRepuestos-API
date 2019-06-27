var formidable = require('formidable');
const paypal = require('paypal-rest-sdk');

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AfMLaemTeltPx-NMSCpzxIe9HusMBnhw0ZWQruR-pGybiXYXcKLPuM5tvefUlU7wZK-5FlkaB4tD1X6Y',
    'client_secret': 'EHeIYygzNrarFOqwsfawCHPtgnYRgrliNrRAk96UMJ7gADXwB4ZeIKBxdGobfXQpclzE0bm8feoYkAAn'
});

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
            category_id: req.body.category_id,
            quantity: req.body.quantity
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
        Product.find(function(err, products) {
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

    Product.find({ 'category_id': req.params.category_id }, function(err, products) {
        if (err) throw err;
        res.json(products);
    });
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

exports.uploadImage = function (req, res) {
    var form = new formidable.IncomingForm();

    form.parse(req);

    form.on('fileBegin', function (name, file){
        file.path = __dirname + "/../public/images/" + file.name;
    });

    form.on('file', function (name, file){
        res.json({
            success: true,
            url: file.name
        })
    });
}

exports.pay = function (req, res) {
    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://localhost:8080/#/success?order=140",
            "cancel_url": "http://localhost:8080/"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "Repuestos REON",
                    "sku": "001",
                    "price": req.body.amount,
                    "currency": "USD",
                    "quantity": "1"
                }]
            },
            "amount": {
                "currency": "USD",
                "total": req.body.amount
            },
            "description": "Repuestos comprados en REON."
        }]
    };

    paypal.payment.create(create_payment_json, function (error, payment) {
      if (error) {
          throw error;
      } else {

            for(let i = 0;i < payment.links.length;i++){
                if(payment.links[i].rel === 'approval_url'){
                res.redirect(payment.links[i].href);
                }
            }
      }
    });
}