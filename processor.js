var config = require('./config'),
    async = require('async'),
    strategy = require('./strategy'),
    net = require('net');

var client,
    io_socket;

function validateStockPrice () {

    // There isn't a requirement in the spec that we
    // validate the data from the Exchange Server but
    // it is good practice to do so :)


    return true;
}

function doMath() {
    // client.write('B\r\n');
}

function process_payload (data) {
    var i,
        stock_array;

    stock_array = data.split("|");

    for (i=0; i < stock_array.length; i++) {
        if (stock_array[i]) {
            config.verbose ? console.log(stock_array[i]) : null;

            io_socket.sockets.emit('ping', { msg: stock_array[i]});

            if (validateStockPrice(stock_array[i])) {
                async.series([
                    doMath()
                ]);
            }
        }
    }

    // stradegy

    // push to redis
}

module.exports = {
    client: client,
    start: function (io, callback) {
        io_socket = io;

        io_socket.sockets.emit('ping', { msg: "Started!"});

        client = net.connect(config.port, function() {
            console.log('Client Connected');
            client.write('H\r\n');
        });

        client.setEncoding('ascii');
        // client.setKeepAlive(true);

        client.on('data', function(data) {
            // Example payload: 10.225|10.225|10.225|10.195|10.225|10.130|10.130|10.160|10.195|10.160|
            config.verbose ? console.log(data) : null;

            // Process Payload
            process_payload(data);
        });

        client.on('end', function() {
            console.log('Client Disconnected');
            client.end();
            callback(); // done
        });
    }
}