var config = require('./config'),
    async = require('async'),
    strategy = require('./strategy'),
    net = require('net');

var client,
    io_socket;

function validateStockPrice (data) {

    // There isn't a requirement in the spec that we
    // validate the data from the Exchange Server but
    // it is good practice to do so :)

    var valid = true;

    if (data == 'C') {
        console.log("invalid");
        valid = false;
    }

    return valid;
}

function doMath() {
    // client.write('B\r\n');
}

var time = 0;

var array = [];

function process_payload (data) {
    var i,
        stock_array;

    stock_array = data.split("|");

    for (i=0; i < stock_array.length; i++) {
        if (stock_array[i]) {
            config.verbose ? console.log(stock_array[i]) : null;


            if (validateStockPrice(stock_array[i])) {
                array.push( { data: stock_array[i], time: time });
                async.series([
                    doMath()
                ]);
                time++
            } else {
                // handle error

                // handle 'C' case
                if (stock_array[i] == 'C') {
                    time = 0;
                    break;
                }
            }
        }
    }

    console.log(array);
    io_socket.sockets.emit('data', array);
    array = [];

    // stradegy

    // push to redis
}

function start(io, callback) {
        io_socket = io;

        io_socket.sockets.emit('ping', { msg: "Started!"});

        client = net.connect(config.port, function() {
            console.log('Client Connected');
            client.write('H\r\n');
        });

        client.setEncoding('ascii');

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

module.exports = {
    client: client,
    start: start
}