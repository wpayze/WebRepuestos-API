var Category = require("../models/category");

exports.createCategory = function(req, res) {

    var token = getToken(req.headers);

    if (token) {

        var newCategory = new Category({
            name: req.body.name
        });

        newCategory.save(function(err) {
            if (err) {
                return res.json({ success: false, msg: 'Error guardando la categoria.' });
            }
            return res.json({ success: true, msg: 'Categoria guardada correctamente.' });
        });
    } else {
        res.status(403).send({ success: false, msg: 'No autorizado.' });
    }
}

exports.getCategories = function(req, res) {

    Category.find(function(err, categories) {
        if (err) throw err;
        res.json(categories);
    });

}