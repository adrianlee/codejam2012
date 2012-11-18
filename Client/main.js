var net = require('net'),
    config = require('./config'),
    scheduler = require('./scheduler'),
    server,
    port;

port = config.tradeServerPort || 3000;

// Creates TCP server to interface with Web Server (GUI)
server = net.createServer(function(c) {
    console.log(config.getTime() + 'Client Connected');
    c.write(config.getTime() + 'You have connected to the Trading Server!\r\n');

    c.setEncoding('ascii');

    c.on('data', function (data) {
        // 'H' is sent by the web server once user hits 'Start' on the GUI
        if (data == 'H\r\n') {
            console.log(config.getTime() + 'Client Initated Exchange to begin feed');
            scheduler.begin();
        }
    });

    c.on('end', function() {
        console.log(config.getTime() + 'Client Disconnected');
    });
});

server.listen(port, function() {
    console.log(config.getTime() + 'Trading Server (Client) listening on port ' + port);
});