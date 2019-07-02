var Comment = require("../models/comment");
var User = require("../models/user");

exports.addComment = function(req, res) {

    console.log(req.body);
    var token = getToken(req.headers);

    if (token) {

        var user = verifyToken(token);

        User.findById(user._id, function(err, userNew) {
            if (err) throw err;

            var newComment = new Comment({
                text: req.body.text,
                user: userNew,
                product_id: req.body.product_id
            });
    
            newComment.save(function(err) {
                if (err) {
                    return res.json({ success: false, msg: 'Error guardando el comentario.' });
                }
                return res.json({ success: true, msg: 'Comentario guardado correctamente.'});
            });

        });
    } else {
        res.status(403).send({ success: false, msg: 'No autorizado.' });
    }
}

exports.getComments = function(req, res) {

        Comment.find({ 'product_id': req.body.product_id }, function(err, comments) {
            
            if (err) throw err;

            res.json(comments);

        });
}