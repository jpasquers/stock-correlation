var Stock = require("../mongoose_model/Stock")
var utils = require("./util");
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/stock');

var fs = require("fs");
var path = require("path");

let globals = {}

let saveStocks = (currIndex, rows) => {
    if (currIndex >= rows.length) {
        console.log("import completed successfully, total import size: " + rows.length);
        return;
    }

    var columns = rows[currIndex];
    var symbol = columns[globals.symbol_index];
    var sector = columns[globals.sector_index];
    var stock = new Stock({sector: sector, symbol: symbol});
    stock.save((err) => {
        if (err) {
            console.log(err)
        }
        else {
            console.log("success at index: " + currIndex);
            console.log("initiating next");
            saveStocks(++currIndex, rows);
        }
    })
}

let preProcess = (col_names) => {
    var symbol_index = col_names.findIndex((val) => {
        return val.replace(/["']/g, "") == "Symbol";
    });
    var sector_index = col_names.findIndex((val) => {
        return val.replace(/["']/g, "") == "Sector";
    });

    globals = Object.assign({}, globals, {
        symbol_index: symbol_index,
        sector_index: sector_index
    })
}

fs.readFile(path.join(__dirname, '../stock_symbols/nasdaq.csv'), 'utf8', (err, contents) => {
    if (err) {
        console.log(err);
    }
    else {
        var rows = utils.CSVToArray(contents, ",");
        var col_names = rows[0];
        preProcess(col_names);
        rows.splice(0, 1)

        saveStocks(0, rows)

    }
})


