var net = require('net'),
    config = require("./config");

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
    initiateTrade: function (time, type, price, stradegy) {

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
        // Give jobs away
    }
};


function ManagerController() {
    var self = this;

    this.managers = [];
    this.tradeQueue = [];

    this.client = net.connect(config.marketServerPort, function() {
        console.log(config.getTime() + 'Connected to Exchange Market Server');
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
    if (this.tradeQueue.length === 0) {
        setTimeout(function (socket) {
            socket.end();
        }, 1000, this.client);
    }
};

ManagerController.prototype.processOnData = function (payload) {
    console.log(payload);
};

ManagerController.prototype.create = function () {
    return new Manager("Manager" + this.managers.length + 1);
};

ManagerController.prototype.delegate = function () {
    var i,
        aquiredManager = null;

    // Minimalize number of Managers by utilizing existing.
    // Check if each are free before creating a new Manager
    for (i=0; i < managers.length; i++) {
        if (managers[i].checkAvailability()) {
            // Get the first avaliable manager
            if (!aquiredManager) {
                aquiredManager = managers[i];
            }
        }
    }

    // No Manager is avaliable
    if (!aquiredManager) {
        aquiredManager = managerCreate();
    }

    return aquiredManager;
};

module.exports = ManagerController;