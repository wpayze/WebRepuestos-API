var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    rating: {
        type: Number
    },
    location: {
        type: String
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    img: {
        type: String
    },
    is_active: {
        type: Number,
        required: true
    }
    
}, {timestamps: true});

module.exports = mongoose.model('Product', ProductSchema);