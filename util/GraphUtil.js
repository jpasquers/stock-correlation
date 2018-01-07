var regression = require('regression');

var utilMethods = {
    normalizeData: (data) => {
        let maxValue = 0;
        for (let item of data) {
            let closeValue = item.closeValue;
            if (closeValue > maxValue) {
                maxValue = closeValue;
            }

            let openValue = item.openValue
            if (openValue > maxValue) {
                maxValue = openValue;
            }
        }

        for (let item of data) {
            item.closeValue = item.closeValue / maxValue;
            item.openValue = item.openValue / maxValue;
        }

        return data;

    },

    //Currently uses slope average from day before and after
    //TODO: Add in a better derivative calculation
    calcDerivatives: (data) => {
        let derivData = [];
        for (let i=0; i<data.length; i++) {
            let closeCurrDay = data[i].closeValue;
            let openCurrDay = data[i].openValue;
            let time = data[i].time;
            if (i==0) {
                let openDayAfter = data[i+1].openValue;
                derivData.push({
                    time: time,
                    openDeriv: closeCurrDay - openCurrDay,
                    closeDeriv: ((openDayAfter - closeCurrDay) + (closeCurrDay - openCurrDay)) / 2
                })
            }
            else if (i==data.length-1) {
                let closeDayBefore = data[i-1].closeValue;
                derivData.push({
                    time: time,
                    openDeriv: ((openCurrDay - closeDayBefore) + (closeCurrDay - openCurrDay)) / 2,
                    closeDeriv: closeCurrDay - openCurrDay
                })
            }
            else {
                let openDayAfter = data[i+1].openValue;
                let closeDayBefore = data[i-1].closeValue;
                derivData.push({
                    time: time,
                    openDeriv: ((openCurrDay - closeDayBefore) + (closeCurrDay - openCurrDay)) / 2,
                    closeDeriv: ((openDayAfter - closeCurrDay) + (closeCurrDay - openCurrDay)) / 2
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
            if ((i+differential) < laterDerivatives.length) {
                earlierOpenRescaled = earlierDerivatives[i].openDeriv * 10000;
                laterOpenRescaled = laterDerivatives[i+differential].openDeriv * 10000;
                ret.push([earlierOpenRescaled, laterOpenRescaled])
                earlierCloseRescaled = earlierDerivatives[i].closeDeriv * 10000;
                laterCloseRescaled = laterDerivatives[i+differential].closeDeriv * 10000;
                ret.push([earlierCloseRescaled, laterCloseRescaled])
            }
        }
        return ret;
    }
}

module.exports = utilMethods;