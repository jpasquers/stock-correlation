var NasdaqStocks = require("mongodb_scripts/importNasdaq");
var CorrelationCalculator = require("mongodb_scripts/correlationCalculator");

NasdaqStocks.importNasdaqStocks();
CorrelationCalculator.recursivelyRun();