var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    user: {
        type: Object,
        required: true
    },
    product_id: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    }

}, { timestamps: true });

module.exports = mongoose.model('Comment', CommentSchema);