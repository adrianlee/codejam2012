var async = require('async');

function FIFO() {

}


// Simple Moving Average
// The SMA is the unweighted mean of the last N data points.
function SMA(size) {
    this.size = size;
    this.currentAverage = 0;
    this.array = [];
}

SMA.prototype.type = "SMA";
SMA.prototype.compute = function (price, timestamp) {
    var i,
        sum = 0,
        result,
        oldPrice;

    if (timestamp < this.size) {
        // First N data points, simply take average
        this.array.push(price);

        for (i=0; i < this.array.length; i++) {
            sum += this.array[i];
        }

        result = sum / this.array.length;

        result = Math.round(result * 1000) / 1000;

        console.log(result);

        this.currentAverage = result;
    } else {
        this.array.push(price);
        oldPrice = this.array.shift();

        if (timestamp < this.size) {
            console.log("currentAverage" + this.currentAverage);
            console.log("oldPrice" + oldPrice);
            console.log("oldPrice/this.size" + oldPrice/this.size);
            console.log("price/this.size" + price/this.size);
        }

        result = this.currentAverage - oldPrice/this.size + price/this.size;
        result = Math.round(result * 1000) / 1000;

        this.currentAverage = result;

        if (timestamp < this.size+10) {
            console.log(result);
        }
    }

    return result;
};

// Linear Weighted Moving Average
// The LWMA uses weighting factors to assign more importance to the most recent data points
function LWMA(size) {
    this.size = size;
}

LWMA.prototype.type = "LWMA";
LWMA.prototype.compute = function (price, timestamp) {

};

// Exponential Moving Average
// EMA, like LWMA, applies exponentially decreasing weighting factors to the data points
function EMA(size) {
    this.size = size;
    this.current_average = 0;
}

EMA.prototype.type = "EMA";
EMA.prototype.compute = function (price, timestamp) {

};

// Triangular Moving Average
// The TMA is a smoothed version of the SMA
function TMA(size) {
    this.size = size;
}

TMA.prototype.type = "TMA";
TMA.prototype.compute = function (price, timestamp) {

};

function Strategy (type) {
    switch (type) {
        case "SMA":
            this.fast = new SMA(5);
            this.slow = new SMA(20);
            break;
        case "LWMA":
            this.fast = new LWMA(5);
            this.slow = new LWMA(20);
            break;
        case "EMA":
            this.fast = new EMA(5);
            this.slow = new EMA(20);
            break;
        case "TMA":
            this.fast = new TMA(5);
            this.slow = new TMA(20);
            break;
    }
}

Strategy.prototype.compute = function (price, timestamp) {
    this.fast.compute(price, timestamp);
    // this.slow.compute(price, timestamp);
};

Strategy.prototype.computeCrossOver = function () {

};

function Strategies () {
    this.object = [];
    this.object.push(new Strategy("SMA"));
    this.object.push(new Strategy("LWMA"));
    this.object.push(new Strategy("EMA"));
    this.object.push(new Strategy("TMA"));
}

Strategies.prototype.calculateMovingAverage = function (price, timestamp) {
    var i = 0;

    for (i=0; i < this.object.length; i++) {
        this.object[i].compute(price, timestamp);
    }
};

module.exports = Strategies;