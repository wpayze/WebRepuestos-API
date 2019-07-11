var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var UserSchema = new Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    phone: {
        type: Number
    },
    password: {
        type: String,
        required: true
    },
    company: {
        type: String
    },
    img: {
        type: String
    },
    is_active: {
        type: Number,
        required: true,
        default: 1
    },
    plan_id: {
        type: Number,
        required: true,
        default: 1
    },
    type: {
        type: Number,
        required: true
    },
    rating: {
        type: Number,
        default: 0        
    },
    rated: {
        type: [String],
        default: []
    }

}, { timestamps: true });

UserSchema.pre('save', function(next) {
    var user = this;

    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function(err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, null, function(err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

UserSchema.methods.comparePassword = function(passw, callback) {
    bcrypt.compare(passw, this.password, function(err, isMatch) {
        if (err) {
            return callback(err);
        }

        callback(null, isMatch);
    });
}

module.exports = mongoose.model('User', UserSchema);