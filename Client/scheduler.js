var net = require('net'),
    config = require('./config'),
    manager = require('./manager'),
    strategies = require('./strategies')();

var managers = [];
var currentManager;

function beginFeed() {
    var client,
        qouteArray,
        qouteTimeStamp = 0;

    // Connect to Exchange and request to begin Feed
    client = net.connect(config.qouteServerPort, function() {
        console.log('Connected to Exchange');
        client.write('H\r\n');
    });

    // Makes the 'data' event emit a string instead of a Buffer
    client.setEncoding('ascii');

    // On Stream Data Event
    client.on('data', function(payload) {
        var i,
            qouteArray = payload.split("|");

        for (i=0; i < qouteArray.length; i++) {
            if (validateQoute(qouteArray[i])) {

                // Calculate Moving Averages
                strategies.EMA()

                // Qoute has been validated and can be sent to a Manager!
                managerController(qouteArray[i], qouteTimeStamp++);

            } else {
                // Check if 'C' character
                if (qouteArray[i] == 'C') {
                    // Exchange Closed
                    console.log("Exchange closed");
                    cleanUp();
                } else {
                    // Throw some error
                }
            }
        }
    });

    // On Stream End Event
    client.on('end', function() {
        console.log('Disconnected from Exchange');
        client.end();
    });
}

function validateQoute(data) {
    var validFlag = false,
        decimal = /^\d{1,2}(\.\d{3})?$/;

    // RegEx: 1-2 Integer & 3 Decimal
    if (data.match(decimal)) {
        validFlag = true;
    }

    return validFlag;
}

function managerController(data, timestamp) {
    var manager;
    // console.log(data + " @ " + timestamp);

    if (managers.length == 0) {
        managers.push(managerCreate());
    } else {
        manager = managerAcquire();
        console.log(manager.value);
    }
}

function managerCreate() {
    return new manager("Manager" + managers.length + 1);
}

function managerAcquire() {
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
    };

    // No Manager is avaliable
    if (!aquiredManager) {
        aquiredManager = managerCreate();
    }

    return aquiredManager;
}

function cleanUp() {
    managers = [];
}

module.exports = {
    begin: beginFeed
}