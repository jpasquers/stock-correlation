var request = require("request");


class AlphaVantageAPI {

    constructor() {
        //This is free and public. Not really concerned about having this in the repo.
        this.alphaApiKey = "7X3KWIQ0WMP46IHZ"
        this.alphaUrl = "https://www.alphavantage.co/query"

        this.params = {
            apikey :this.alphaApiKey
        }
    }

    getDailyClose(symbol) {
        const options = {
            url: this.alphaUrl,
            method: "GET",
            qs: {
                "function": "TIME_SERIES_DAILY",
                "symbol": symbol,
                "datatype": "json",
                "apikey": this.alphaApiKey
            },
            headers: {
                "Accept":"application/json"
            }
        }
        return new Promise((resolve, reject) => {
            request(options, (err, res, body) => {
                if (err) reject(err);
                else {
                    let json = JSON.parse(body);
                    resolve(this.reformatToCloseArray(json));
                }
            })
        })
    }

    reformatToCloseArray(json) {
        let tsd = json["Time Series (Daily)"];
        let retArr = [];
        for (let date in tsd) {
            if (tsd.hasOwnProperty(date)) {
                let fullInformation = tsd[date];
                let closeValue = parseFloat(fullInformation["4. close"]);
                let dateObj = new Date(date);
                let milli = parseInt(dateObj.getTime());
                retArr.push({
                    time: milli,
                    closeValue: closeValue
                })
                
            }
            
        }
        retArr.sort((a,b) => {
            return a.time - b.time;
        })
        return retArr;
    }
}

module.exports = AlphaVantageAPI;