var net = require('net'),
    config = require("../config"),
    request = require("request"),
    fs = require('fs');

function Manager (name, timestamp) {
    this.name = name;
    this.startTime = timestamp;
    this.loggedTime = 0;
    this.currentTrades = [];

    // 0: working
    // 1: break
    // 2: done working
    this.status = 0;
}

Manager.prototype = {
    checkAvailability: function () {
        var avaliableFlag = true;

        this.value++;

        return avaliableFlag;
    },
    initiateTrade: function (trade, socket) {
        // time, type, price, stradegy
        // console.log(trade);
        this.currentTrades.push(trade);
    },
    tick: function () {
        this.loggedTime++;

        if (this.loggedTime > 16200) {
            this.status = 2;
            this.signOut();
        } else if (this.loggedTime > 7200 && this.loggedTime <= 9000) {
            this.status = 1;
        } else {
            this.status = 0;
        }

    },
    signOut: function () {
        // assign jobs away if any
    }
};


function ManagerController() {
    var self = this;

    this.managers = [];
    this.tradeQueue = [];
    this.transactions = []; // Should store in Redis.

    this.client = net.connect(config.marketServerPort, config.exchangeIP, function() {
        console.log(config.getTime() + 'Connected to Exchange Market Server on port ' + config.marketServerPort);
    });

    // Makes the 'data' event emit a string instead of a Buffer
    this.client.setEncoding('ascii');

    // On Stream Data Event
    this.client.on('data', function(payload) {
        self.processOnData(payload);
    });

    // On Stream End Event
    this.client.on('end', function() {
        console.log(config.getTime() + 'Disconnected from Exchange Market Server');
    });

    // Initialize First Manager
    this.managers.push(this.create());
}

ManagerController.prototype.tick = function () {
    var i;

    for (i=0; i < this.managers.length; i++) {
        this.managers[i].tick();
    }
};

ManagerController.prototype.disconnectFromMarketServer = function () {
    // Check for active trades, if not, wait X second before close.

    this.report();

    if (this.tradeQueue.length === 0) {
        setTimeout(function (socket) {
            socket.end();
        }, 1000, this.client);
    }
};

ManagerController.prototype.processOnData = function (payload) {
    var trade = this.tradeQueue.shift();

    if (trade) {
        this.transactions.push(trade);
        this.socket.write(JSON.stringify(trade)+"\r\n");
    }
};

ManagerController.prototype.report = function () {
    var obj = {};

    obj.method = "POST";
    obj.url = "https://stage-api.e-signlive.com/aws/rest/services/codejam";
    obj.headers = {
        Authentication: "Basic Y29kZWphbTpBRkxpdGw0TEEyQWQx"
    };
    obj.json = {
        team: "Adrian Lee",
        destination: "mcgillcodejam2012@gmail.com",
        transactions: this.transactions
    };

    request.post(obj, function (e, r, body) {
        console.log(e);
        console.log(r);
        console.log(body);
    });

    fs.writeFile("codejam.json", JSON.stringify(obj.json, null, ' '), function(err){
      if (err) console.log(err);
    });
};

ManagerController.prototype.create = function () {
    return new Manager("Manager" + (this.managers.length + 1));
};

ManagerController.prototype.process = function (strategyInstance, socket) {
    var i,
        trade;

    if (!this.socket) {
        this.socket = socket;
    }


    for (i=0; i < strategyInstance.object.length; i++) {
        trade = strategyInstance.object[i].tradeQueue.shift()

        if (trade) {
            this.delegate(trade);
        }
    }
};

ManagerController.prototype.delegate = function (trade) {
    var i,
        j,
        aquiredManager = null;

    // Minimalize number of Managers by utilizing existing.
    // Check if each are free before creating a new Manager
    for (i=0; i < this.managers.length; i++) {
        if (this.managers[i].checkAvailability(trade)) {
            // Get the first avaliable manager
            if (!aquiredManager) {
                aquiredManager = this.managers[i];
            }
        }
    }

    // No Manager is avaliable
    if (!aquiredManager) {
        aquiredManager = managerCreate();
    }

    trade.manager = aquiredManager.name;
    aquiredManager.initiateTrade(trade, this.socket);

    this.tradeQueue.push(trade);
    this.client.write(trade.type + "\r\n");
};

module.exports = ManagerController;
