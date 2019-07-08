var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SaleSchema = new Schema({
    //products: [{ type: Schema.ObjectId, ref: 'Product',required: true }],
    list: [{ type: Object,required: true }],
    reduction: {
        type: [{type: Object}]
    },
    amount: {
        type: 'Number',
        required: true
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: 'Number',
        default: 0
    }

}, { timestamps: true });

module.exports = mongoose.model('Sale', SaleSchema);