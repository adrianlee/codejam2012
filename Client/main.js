var net = require('net'),
    config = require('./config'),
    scheduler = require('./scheduler');

var port = config.tradeServerPort || 3000;

// Create TCP server to listen to Web Server which issues request
// To listen to commands issued by GUI
var server = net.createServer(function(c) {
  console.log('Server Connected');

  c.setEncoding('ascii');

  c.on('data', function (data) {
    console.log(data);
    if (data == 'H\r\n') {
      scheduler.begin();
    }
  });

  c.on('end', function() {
    console.log('Server Disconnected');
  });

  c.write('You have connected to the Trading Server!\r\n');
});

server.listen(port, function() {
  console.log('Trading Server (Client) listening on port ' + port);
});