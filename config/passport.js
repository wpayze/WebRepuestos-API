var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt  = require('passport-jwt').ExtractJwt;

var User   = require('../models/user');
var config = require('../config/database');

module.exports = function(passport) {
    var options = {};
    options.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('JWT');
    options.secretOrKey    = config.secret;
    passport.use(new JwtStrategy(options, function(jwt_payload, done){
        User.findOne({id: jwt_payload.id}, function(err, user){
            if (err){
                return done (err, false);
            }
            if (user){
                done(null, user);
            }else{
                done(null, false);
            }
        });
    }));
}