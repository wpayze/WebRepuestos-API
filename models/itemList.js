var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ItemListSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    product_id: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    }

}, { timestamps: true });

module.exports = mongoose.model('ItemList', ItemListSchema);