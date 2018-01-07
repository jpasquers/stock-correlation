var regression = require('regression');

var utilMethods = {
    normalizeData: (data) => {
        let maxValue = 0;
        for (let item of data) {
            let value = item.closeValue;
            if (value > maxValue) {
                maxValue = value;
            }
        }

        for (let item of data) {
            item.closeValue = item.closeValue / maxValue;
        }

        return data;

    },

    //Currently uses slope average from day before and after
    //TODO: Add in a better derivative calculation
    calcDerivatives: (data) => {
        let derivData = [];
        for (let i=0; i<data.length; i++) {
            let valueCurrDay = data[i].closeValue;
            let time = data[i].time;
            if (i==0) {
                let valueDayAfter = data[i+1].closeValue;
                derivData.push({
                    time: time,
                    deriv: valueDayAfter - valueCurrDay
                })
            }
            else if (i==data.length-1) {
                let valueDayBefore = data[i-1].closeValue;
                derivData.push({
                    time: time,
                    deriv: valueCurrDay - valueDayBefore
                })
            }
            else {
                let valueDayAfter = data[i+1].closeValue;
                let valueDayBefore = data[i-1].closeValue;
                derivData.push({
                    time: time,
                    deriv: ((valueDayAfter - valueCurrDay) + (valueCurrDay - valueDayBefore)) / 2
                })
            }
            
        }
        return derivData;
    },

    calcRSquared(earlierDerivatives, laterDerivatives, differential) {
        let regressionInput = utilMethods.getRegressionInput(earlierDerivatives, laterDerivatives, differential);
        let result = regression.linear(regressionInput);
        return result.r2;
    },

    getRegressionInput(earlierDerivatives, laterDerivatives, differential) {
        let ret = [];
        for (let i=0; i< earlierDerivatives.length; i++) {
            if ((i+5) < laterDerivatives.length) {
                earlierRescaled = earlierDerivatives[i].deriv * 10000;
                laterRescaled = laterDerivatives[i+5].deriv * 10000;
                ret.push([earlierRescaled, laterRescaled])
            }
        }
        return ret;
    }
}

module.exports = utilMethods;