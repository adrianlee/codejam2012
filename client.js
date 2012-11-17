var net = require('net');

var port = process.argv[2] || 3000;

var client = net.connect(port, "127.0.0.1", function() {
  console.log('Client Connected');
  client.write('H\r\n');
});

// Makes the 'data' event emit a string instead of a Buffer
client.setEncoding('ascii');
client.setKeepAlive(true);

client.on('data', function(data) {
  console.log(data+'\r\n');
  client.pause();
});

client.on('end', function() {
  console.log('Client Disconnected');
});
