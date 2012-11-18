var net = require('net'),
    config = require('./config'),
    manager = require('./manager'),
    strategy = require('./strategy');

// Connects to Exchange and sends 'H' immediately.
// Payloads are parsed, validated and then processed.
function beginFeed() {
    var client,
        qouteArray,
        qouteTimeStamp = config.exchangeOpening,
        managerInstance = new manager(),
        strategyInstance = new strategy();

    // Connect to Exchange and request to begin Feed
    client = net.connect(config.qouteServerPort, config.exchangeIP, function() {
        console.log(config.getTime() + 'Connected to Exchange Qoute Server on port ' + config.qouteServerPort);
        client.write('H\r\n');
    });

    // Makes the 'data' event emit a string instead of a Buffer
    client.setEncoding('ascii');

    // On Stream Data Event
    client.on('data', function(payload) {
        var i,
            qouteArray,
            time;

        qouteArray = payload.split("|");

        for (i=0; i < qouteArray.length; i++) {
            // Check for null from split
            if (qouteArray[i]) {
                // Increase time for each data point
                qouteTimeStamp++;
                managerInstance.tick();

                // Validate each qoute
                if (validateQoute(qouteArray[i])) {

                    // Calculate Moving Averages
                    strategyInstance.calculateMovingAverage(parseFloat(qouteArray[i]), qouteTimeStamp);

                    // Qoute has been validated and can be sent to a Manager!
                    managerInstance.delegate(qouteArray[i], qouteTimeStamp);

                } else {
                    if (qouteArray[i] == 'C') {
                        // Exchange Closed
                        console.log(config.getTime() + "Exchange Closed");

                        managerInstance.disconnectFromMarketServer();
                    } else {
                        // Invalid data from Exchange
                    }
                }
            }
        }
    });

    client.on('close', function() {
        console.log(config.getTime() + 'Disconnected from Exchange Qoute Server');
        client.end();
    });
}

function validateQoute(data) {
    var validFlag = false,
        decimal = /^\d{1,3}(\.\d{3})?$/;

    // RegEx: 1-3 Integer & 3 Decimal
    if (data.match(decimal)) {
        validFlag = true;
    }

    return validFlag;
}

module.exports = {
    begin: beginFeed
};
