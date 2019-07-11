var config = require('../config/database');
var jwt = require('jsonwebtoken');

var User = require("../models/user");

exports.register = function(req, res) {

    if (!req.body.email || !req.body.password) {
        res.json({ success: false, msg: 'Por favor ingresar correo y clave.' });
    } else {
        var newUser = new User({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            phone: req.body.phone,
            password: req.body.password,
            company: req.body.company,
            img: "",
            type: req.body.type
        });

        newUser.save(function(err) {
            if (err) {
                console.log(err);
                return res.json({ success: false, msg: "El correo ya está registrado." });
            }
            res.json({ success: true, msg: "Usuario creado exitosamente." });
        });
    }
}

exports.login = function(req, res) {
    User.findOne({
        email: req.body.email
    }, function(err, user) {
        if (err) throw err;

        if (!user) {
            res.json({ success: false, msg: 'Usuario no encontrado.' });
        } else {
            user.comparePassword(req.body.password, function(err, isMatch) {
                if (isMatch && !err) {
                    var token = jwt.sign(user.toObject(), config.secret);
                    var user_token = verifyToken(token);
                    delete user_token.password;
                    res.json({ success: true, token: 'JWT ' + token, user: user_token });
                } else {
                    res.json({ success: false, msg: 'Clave incorrecta.' });
                }
            });
        };
    });
}

exports.getUser = function(req, res) {

    User.findById(req.params._id, function(err, user) {
        if (err) throw err;

        /*if (user_token._id != user._id && !user.is_active) {
            res.json({ success: false, msg: 'El usuario no está activo.' });
        } else {*/
            res.json(user);
        //}
    });
}

exports.addRating = function(req, res) {

    User.findById(req.params._id, function(err, user) {
        if (err) throw err;

        if (user.type != 2){
            res.send("error");
        } else {
            let newRating = 0;

            if (user.rating == 0){
                newRating = req.params.rating;
            } else {
                newRating = (user.rating + parseFloat(req.params.rating))/2;
            }

            console.log(user.rating, "user rating");
            console.log(req.params.rating, "params rating");
            console.log(newRating);
            
            user.update({rating: newRating}, (err, rating) => {
                if (err) console.log(err);
                res.json(rating);
            });
        }
    });
}

exports.addRated = function(req, res) {

    User.findById(req.params._id, function(err, user) {
        if (err) throw err;

        if (user.type != 2){
            res.send("error");
        } else {

            let repetido = false;
            user.rated.forEach(user_id => {
                if (user_id == req.params.user_id){
                    repetido = true;
                }
            });

            if (!repetido){
                user.rated.push(req.params.user_id);
                user.update(user, (err, rating) => {
                    if (err) console.log(err);
                    res.json({sucesss: true});
                });
            }else{
                res.json({success: false, msg: "ya voto ese usuario", });
            }
            
        }
    });
}

getToken = function(headers) {
    if (headers && headers.authorization) {
        var parted = headers.authorization.split(' ');
        if (parted.length === 2) {
            return parted[1];
        } else {
            return null;
        }
    } else {
        return null;
    }
}

verifyToken = function(token) {
    if (token) {
        var user;

        jwt.verify(token, config.secret, (err, authData) => {
            if (err) throw err;
            user = authData;
        });

        return user;
    }
}