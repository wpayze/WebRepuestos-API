var Sale = require("../models/sale");
var Config = require("../models/config");

exports.addSale = async (req, res) => {

    var token = getToken(req.headers);

    if (token) {

        var user = verifyToken(token);

        let correlativo_promise = await Config.findOne({name: "correlativo"});
        let correlativo = correlativo_promise.value;
        let size = correlativo.toString().length;
        let limit = Math.abs(8 - size);
        let number = "000-001-01-0";

        for (let i = 1; i < limit; i++) {
            number += "0";
        }

        number += correlativo;

        var newSale = new Sale({
            list: req.body.list,
            reduction: req.body.reduction,
            amount: req.body.amount,
            user_id: user._id,
            number: number
        });

        var promise = await Config.findOneAndUpdate({name: "correlativo"}, { $inc: { value: 1 }});
        
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
                sales.forEach(sale => {
                    let newList = [];
                    sale.list.forEach(list => {
                        if (list.seller._id == user._id)
                            newList.push(list);
                    });
                    sale.list = newList;
                });
                res.json(sales);
            }).populate('user_id');
        }

    } else {
        res.status(403).send({ success: false, msg: 'No autorizado.' });
    }
}

exports.getSale = function(req, res) {
    
    var token = getToken(req.headers);

    if (token) {

    var user = verifyToken(token);

    if (user.type == 1){
        Sale.findById( req.params._id , function(err, sale) {
            if (err) throw err;

            res.json(sale);
        });
    }else{
        Sale.findById( req.params._id , function(err, sale) {
            if (err) throw err;

            let newList = [];
            sale.list.forEach(list => {
                if (list.seller._id == user._id)
                    newList.push(list);
            });
            sale.list = newList;

            res.json(sale);
        });
    }
        
    } else {
        res.status(403).send({ success: false, msg: 'No autorizado.' });
    }
}