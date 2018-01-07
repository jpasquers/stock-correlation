const assert = require('chai').assert;

describe("graph util tests", () => {
    var GraphUtil;
    before(() => {
        GraphUtil = require("../util/GraphUtil");
    });

    after(() => {

    });

    it("normalize data properly normalizes", () => {
        var normalized = GraphUtil.normalizeData([
            {time: 1, openValue: 2, closeValue: 4},
            {time: 1, openValue: 2, closeValue: 4},
            {time: 1, openValue: 2, closeValue: 8},
            {time: 1, openValue: 10, closeValue: 2},
        ])

        assert.equal(normalized[1].openValue, 0.2);
        assert.equal(normalized[1].closeValue, 0.4);
        assert.equal(normalized[3].openValue, 1);
    });
});