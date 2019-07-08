var Sale = require("../models/sale");

exports.addSale = function(req, res) {

    var token = getToken(req.headers);

    if (token) {

        var user = verifyToken(token);

        var newSale = new Sale({
            list: req.body.list,
            reduction: req.body.reduction,
            amount: req.body.amount,
            user_id: user._id
        });

        newSale.save(function(err) {
            if (err) {
                return res.json({ success: false, msg: 'Error guardando la venta. ' + err });
            }
            return res.json({ success: true, msg: 'Venta guardada correctamente.', _id: newSale._id });
        });

    } else {
        res.status(403).send({ success: false, msg: 'No autorizado.' });
    }
}

exports.activateSale = function(req, res) {
    
    Sale.findByIdAndUpdate(
        req.params._id,
        {"status": 1},
        {new: true},
        (err, sale) => {
            if (err) return res.status(500).send(err);
            return res.json({ sale, success: true, msg: 'Venta actualizada correctamente.' });
    });
}


exports.getSales = function(req, res) {
    
    var token = getToken(req.headers);

    if (token) {

        var user = verifyToken(token);
    
        if (user.type == 1){
            Sale.find({ 'user_id': user._id , 'status' : 1 }, function(err, sales) {
                if (err) throw err;
                res.json(sales);
            });
        } else {
            console.log(user._id);
            Sale.find({ 'list.seller._id': { $eq: user._id } ,'status' : 1 }, function(err, sales) {
                if (err) throw err;
                res.json(sales);
            });
        }

    } else {
        res.status(403).send({ success: false, msg: 'No autorizado.' });
    }
}

exports.getSale = function(req, res) {
    
    var token = getToken(req.headers);

    if (token) {

    var user = verifyToken(token);
        res.json(user);
        Sale.findById( req.params._id , function(err, sale) {
            if (err) throw err;
            res.json(sale);
        });
    } else {
        res.status(403).send({ success: false, msg: 'No autorizado.' });
    }
}