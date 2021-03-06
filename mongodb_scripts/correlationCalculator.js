var Stock = require("../mongoose_model/Stock");
var StockRegression = require("../mongoose_model/StockRegression");
var consts = require("../util/Consts");
var AlphaVantageApi = require("../api/AlphaVantageApi");
var GraphUtil = require("../util/GraphUtil");
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/stock');



let getRandomStock = () => { 
    return new Promise((resolve, reject) =>{
        Stock.count().exec((err, count) => {
            var random = Math.floor(Math.random() * count);
            
            Stock.findOne().skip(random).exec((err, stock) => {
                if (err) reject(err);
                else resolve(stock);
            })
        })
    });
}

let runInstance = (finishFn) => {
    console.log("iteration starting");
    var stockPromises = [getRandomStock(), getRandomStock()]
    Promise.all(stockPromises).then((stocks) => {
        let alphaApi = new AlphaVantageApi();
        let promise1 = alphaApi.getDailyClose(stocks[0].symbol);
        let promise2 = alphaApi.getDailyClose(stocks[1].symbol);
        Promise.all([promise1, promise2]).then((closeLists) => {
            let normalized1 = GraphUtil.normalizeData(closeLists[0]);
            let normalized2 = GraphUtil.normalizeData(closeLists[1]);
            let derivs1 = GraphUtil.calcDerivatives(normalized1);
            let derivs2 = GraphUtil.calcDerivatives(normalized2);
            let result = GraphUtil.calcBestRSquared(derivs1, derivs2);
            let stockRegression = new StockRegression({
                earlySymbol: stocks[0].symbol,
                lateSymbol: stocks[1].symbol,
                rSquared: result.rSquared,
                translation: result.translation
            }) 
            console.log(stocks[0].symbol + " " + stocks[1].symbol + " " + result.rSquared + " at translation " + result.translation);
            if (result.rSquared > 0.05) {
                stockRegression.save((err) => {
                    if (err) {
                        console.log("error saving new r2");
                    }
                    finishFn();
                })
            }
            else {
                finishFn();
            }
        }).catch((err) => {
            console.log(err);
        })
        
    }).catch((err) => {
        console.log("failed to retrieve random stocks:");
        console.log(err);
    })
}

recursivelyRun = () => {
    runInstance(() => {
        setTimeout(() => {
            recursivelyRun();
        }, 2000);
    })
}

if (require.main == module) {
    recursivelyRun();
}

module.exports = {
    recursivelyRun: recursivelyRun,
    runInstance: runInstance
}
