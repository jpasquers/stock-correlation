const mockery = require("mockery");
const assert = require('chai').assert;

var APIMock = function() {

}
APIMock.prototype.getDailyClose = (symbol) => {
    return [
        { time: 12345, openValue: 3, closeValue: 6},
        { time: 12346, openValue: 2, closeValue: 7},
        { time: 12347, openValue: 6, closeValue: 4}, 
        { time: 12348, openValue: 6, closeValue: 8},
        { time: 12369, openValue: 0.75, closeValue: 1.5},
        { time: 12345, openValue: 3, closeValue: 6},
        { time: 12346, openValue: 2, closeValue: 7},
        { time: 12347, openValue: 6, closeValue: 4}, 
        { time: 12348, openValue: 6, closeValue: 8},
        { time: 12369, openValue: 0.75, closeValue: 1.5}
    ]
}

var testObj = {};


var StockRegressionMock = function(obj) {
    testObj = Object.assign({}, obj);
}

StockRegressionMock.prototype.save = (fn) => {
    fn();
};





describe("global r2 calc tests", () => {
    var CorrelationCounter;
    before(() => {

        mockery.registerMock("../api/AlphaVantageApi", APIMock);
        mockery.registerMock("../mongoose_model/StockRegression", StockRegressionMock);
        
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false
        });

        CorrelationCounter = require("../mongodb_scripts/correlationCalculator");

    });

    after(() => {
        mockery.disable();
    });

    it("for highly matching graphs returns a high r2", () => {
        CorrelationCounter.runInstance(() => {
            assert.isAbove(testObj.rSquared, 0.9, "rSquared above 0.9");
        })
    })
})

