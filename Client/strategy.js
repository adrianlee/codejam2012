var config = require('../config'),
    FAST_PERIOD = 5,
    SLOW_PERIOD = 20;

// Simple Moving Average
// The SMA is the unweighted mean of the last N data points.
function SMA(period) {
    this.period = period;
    this.currentAverage = 0;
    this.array = [];
    this.sum = 0;
}

SMA.prototype.type = "SMA";
SMA.prototype.compute = function (price, timestamp) {
    var i,
        oldPrice;

    if (this.array.length < this.period) {
        this.array.push(price);
        this.sum += price;
        this.currentAverage = this.sum / this.array.length;
    } else {
        this.array.push(price);
        oldPrice = this.array.shift();
        this.currentAverage = this.currentAverage - oldPrice / this.period + price / this.period;
    }

    return Math.round(this.currentAverage * 1000) / 1000;
};

// Linear Weighted Moving Average
// The LWMA uses weighting factors to assign more importance to the most recent data points
function LWMA(period) {
    this.period = period;
    this.array = [];
}

LWMA.prototype.type = "LWMA";
LWMA.prototype.compute = function (price, timestamp) {
    var i,
        sum = 0,
        denominator,
        result;

    if (this.array.length >= this.period) {
        this.array.shift();
    }

    this.array.push(price);

    for (i=0; i < this.array.length; i++) {
        sum += this.array[i] * (i+1);
    }

    denominator = (this.array.length*(this.array.length+1))/2;
    result = sum / denominator;

    return Math.round(result * 1000) / 1000;
};

// Exponential Moving Average
// EMA, like LWMA, applies exponentially decreasing weighting factors to the data points
function EMA(period) {
    this.period = period;
    this.currentAverage = 0;
}

EMA.prototype.type = "EMA";
EMA.prototype.compute = function (price, timestamp) {
    if (this.currentAverage  === 0) {
        this.currentAverage = price;
    } else {
        this.currentAverage = this.currentAverage + (2.0/(this.period+1.0) * (price - this.currentAverage));
    }

    return Math.round(this.currentAverage * 1000) / 1000;
};

// Triangular Moving Average
// The TMA is a smoothed version of the SMA
function TMA(period) {
    this.period = period;
    this.array = [];
    this.SMA = new SMA(this.period);
}

TMA.prototype.type = "TMA";
TMA.prototype.compute = function (price, timestamp) {
    var i,
        sum = 0,
        result;

    if (this.array.length >= this.period) {
        this.array.shift();
    }

    this.array.push(this.SMA.compute(price, timestamp));

    for (i=0; i < this.array.length; i++) {
        sum += this.array[i];
    }

    result = sum / this.array.length;

    return Math.round(result * 1000) / 1000;
};

function StrategyFactory (type) {
    this.fast = null;
    this.slow = null;
    this.currentTrend = null;
    this.tradeQueue = [];

    switch (type) {
        case "SMA":
            this.fast = new SMA(FAST_PERIOD);
            this.slow = new SMA(SLOW_PERIOD);
            break;
        case "LWMA":
            this.fast = new LWMA(FAST_PERIOD);
            this.slow = new LWMA(SLOW_PERIOD);
            break;
        case "EMA":
            this.fast = new EMA(FAST_PERIOD);
            this.slow = new EMA(SLOW_PERIOD);
            break;
        case "TMA":
            this.fast = new TMA(FAST_PERIOD);
            this.slow = new TMA(SLOW_PERIOD);
            break;
    }
}

StrategyFactory.prototype.compute = function (price, timestamp) {
    this.fastValue = this.fast.compute(price, timestamp);
    this.slowValue = this.slow.compute(price, timestamp);

    if (config.verbose && (timestamp <= config.exchangeOpening + 15 )) {
        console.log(timestamp + ":" + this.fast.type + ":" + this.fast.period + ":" + this.fastValue);
        console.log(timestamp + ":" + this.slow.type + ":" + this.slow.period + ":" + this.slowValue);
    }

    // Calc crossover after SLOW_PERIOD data points processed
    if (config.exchangeOpening + SLOW_PERIOD < timestamp) {
        this.computeCrossOver(this.fastValue, this.slowValue, price, timestamp);
    }
};

StrategyFactory.prototype.computeCrossOver = function (fast, slow, price, timestamp) {
    var newTrend;

    if (this.currentTrend == null) {
        this.currentTrend = fast - slow;
    } else {
        newTrend = fast - slow;

        if (this.currentTrend < 0 && newTrend > 0) {
            this.tradeQueue.push({strategy: this.fast.type, type: "B", price: price, time: timestamp});
        } else if (this.currentTrend > 0 && newTrend < 0) {
            this.tradeQueue.push({strategy: this.fast.type, type: "S", price: price, time: timestamp});
        }

        this.currentTrend = newTrend;
    }
};


function Strategy () {
    this.object = [];
    this.object.push(new StrategyFactory("SMA"));
    this.object.push(new StrategyFactory("LWMA"));
    this.object.push(new StrategyFactory("EMA"));
    this.object.push(new StrategyFactory("TMA"));
}

Strategy.prototype.calculateMovingAverage = function (price, timestamp) {
    var i = 0;

    for (i=0; i < this.object.length; i++) {
        this.object[i].compute(price, timestamp);
    }
};

module.exports = Strategy;