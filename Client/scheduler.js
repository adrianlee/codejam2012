var net = require('net'),
    config = require('../config'),
    manager = require('./manager'),
    strategy = require('./strategy');

// Connects to Exchange and sends 'H' immediately.
// Payloads are parsed, validated and then processed.
function beginFeed(socket) {
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
            time,
            obj;

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

                    // Qoute has been validated, crossover calculated and can be sent to a Manager!
                    managerInstance.process(strategyInstance, socket);
                    obj = {}
                    obj.price = parseFloat(qouteArray[i]);
                    obj.data0 = strategyInstance.object[0].fastValue;
                    obj.data1 = strategyInstance.object[0].slowValue;
                    obj.data2 = strategyInstance.object[1].fastValue;
                    obj.data3 = strategyInstance.object[1].slowValue;
                    obj.data4 = strategyInstance.object[2].fastValue;
                    obj.data5 = strategyInstance.object[2].slowValue;
                    obj.data6 = strategyInstance.object[3].fastValue;
                    obj.data7 = strategyInstance.object[3].slowValue;

                    if (qouteTimeStamp < 33400) {
                        socket.write(JSON.stringify(obj)+"\r\n");
                    }
                } else {
                    if (qouteArray[i] == 'C') {
                        // Exchange Closed
                        console.log(config.getTime() + "Exchange Closed");

                        socket.write('C\r\n');

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
