var Stock = require("../mongoose_model/Stock");
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/stock');

Stock.find({}, (err, stocks) => {
    for (let i=0; i<stocks.length; i++) {
        var stock = stocks[i];
        console.log("Symbol: " + stock.symbol + ", Sector: " + stock.sector);
    }
})