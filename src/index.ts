var NasdaqStocks = require("./mongodb_scripts/importNasdaqNyse");
var CorrelationCalculator = require("./mongodb_scripts/correlationCalculator");

if (process.argv.length > 2 && process.argv[2] == "--generate") {
    NasdaqStocks.importNasdaqStocks().then(() => {
        NasdaqStocks.importNyseStocks().then(() => {
            CorrelationCalculator.recursivelyRun();
        }).catch((err) => {
            console.log(err);
        })
    }).catch((err) => {
        console.log(err);
    })   
}
else {
    CorrelationCalculator.recursivelyRun();
}


