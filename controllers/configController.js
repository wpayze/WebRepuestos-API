var Config = require("../models/config");

exports.addConfig = function(req, res) {

    var newConfig = new Config({
        name: req.body.name,
        value: req.body.value
    });

    newConfig.save(function(err) {
        if (err) {
            return res.json({ success: false, msg: 'Error guardando el Config.' });
        }
        return res.json({ success: true, msg: 'Config guardado correctamente.'});
    });

}