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
        type: String
    },
    price: {
        type: Number,
        required: true
    },
    seller_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category_id: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    img: {
        type: String
    },
    is_active: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    qty_sale: {
        type: Number,
        default: 1
    }

}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);