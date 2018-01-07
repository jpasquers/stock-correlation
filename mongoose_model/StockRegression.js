var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var stockRegressionSchema = new Schema({
    earlySymbol: String,
    lateSymbol: String,
    rSquared: Number
})

var StockRegression = mongoose.model('StockRegression', stockRegressionSchema);

module.exports = StockRegression;