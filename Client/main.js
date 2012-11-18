var net = require('net'),
    config = require('./config'),
    scheduler = require('./scheduler'),
    server,
    port;

port = config.tradeServerPort || 3000;

// Create TCP server to listen to Web Server which issues request
// To listen to commands issued by GUI
server = net.createServer(function(c) {
    console.log(config.getTime() + 'Client Connected');

    c.setEncoding('ascii');

    c.on('data', function (data) {
        if (data == 'H\r\n') {
            console.log(config.getTime() + 'Client Initated Exchange to begin feed');
            scheduler.begin();
        }
    });

    c.on('end', function() {
        console.log(config.getTime() + 'Client Disconnected');
    });

    c.write(config.getTime() + 'You have connected to the Trading Server!\r\n');
});

server.listen(port, function() {
    console.log(config.getTime() + 'Trading Server (Client) listening on port ' + port);
});