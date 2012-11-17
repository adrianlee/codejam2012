var async = require('async');

// Simple Moving Average
// The SMA is the unweighted mean of the last N data points.
function SMA(size) {
    this.size = size;
    this.current_average = 0;
    this.first = 0;
}

SMA.prototype.type = "SMA";
SMA.prototype.compute = function (price, timestamp) {
    console.log(this.type + this.size + " " + price + " " + timestamp);
}

// Linear Weighted Moving Average
// The LWMA uses weighting factors to assign more importance to the most recent data points
function LWMA(size) {
    this.size = size;
}

LWMA.prototype.type = "LWMA";
LWMA.prototype.compute = function (price, timestamp) {
    console.log(this.type + this.size + " " + price + " " + timestamp);
}

// Exponential Moving Average
// EMA, like LWMA, applies exponentially decreasing weighting factors to the data points
function EMA(size) {
    this.size = size;
    this.current_average = 0;
}

EMA.prototype.type = "EMA";
EMA.prototype.compute = function (price, timestamp) {
    console.log(this.type + this.size + " " + price + " " + timestamp);
}

// Triangular Moving Average
// The TMA is a smoothed version of the SMA
function TMA(size) {
    this.size = size;
}

TMA.prototype.type = "TMA";
TMA.prototype.compute = function (price, timestamp) {
    console.log(this.type + this.size + " " + price + " " + timestamp);
}

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
    this.slow.compute(price, timestamp);
}

Strategy.prototype.computeCrossOver = function () {

}

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
        console.log(timestamp)
        this.object[i].compute(price, timestamp);
    }
};

module.exports = Strategies;