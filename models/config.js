var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ConfigSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    value: {
        type: Number
    }

}, { timestamps: true });

module.exports = mongoose.model('Config', ConfigSchema);