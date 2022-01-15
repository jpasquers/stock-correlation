var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var stockSchema = new Schema({
    symbol: String,
    sector: String
})

var Stock = mongoose.model('Stock', stockSchema);

module.exports = Stock;