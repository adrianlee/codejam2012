var express = require('express'),
    http = require('http'),
    path = require('path'),
    app = express(),
    server = http.createServer(app),
    io = require('socket.io').listen(server),
    net = require('net'),

    // Third Party
    hbs = require('hbs'),
    config = require('../config');

io.set('log level', 1);

////////////////////////////////////////////////
// Express Configuration
////////////////////////////////////////////////
app.configure(function(){
  app.set('port', config.guiServerPort || 8080);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'html');
  app.engine('html', hbs.__express);
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

////////////////////////////////////////////////
// Handlebars
////////////////////////////////////////////////
var blocks = {};

hbs.registerHelper('extend', function(name, context) {
    var block = blocks[name];
    if (!block) {
        block = blocks[name] = [];
    }

    block.push(context(this));
});

hbs.registerHelper('block', function(name) {
    var val = (blocks[name] || []).join('\n');

    // clear the block
    blocks[name] = [];
    return val;
});

////////////////////////////////////////////////
// Router
////////////////////////////////////////////////
app.get('/', function(req, res) {
  res.render('index', { title: 'Express', host: config.externalIP});
});

app.post('/start', function(req, res) {
  client = net.connect(config.tradeServerPort, function() {
    console.log(config.getTime() + 'Connected to Exchange Qoute Server on port ' + config.qouteServerPort);
    client.write('H\r\n');
  });

  client.setEncoding('utf8');

  client.on('data', function(payload) {
    if (payload == 'C\r\n') {
      res.send("okay");
    } else {
      if (payload.charAt(0) == "{") {
        // console.log(payload);
        // console.log(JSON.parse(payload));
        array = payload.split("\r\n");
        for (var i=0; i < array.length; i++) {
          io.sockets.emit('ping', array[i]);
        }
      }
    }
  });

  client.on('close', function() {
    console.log(config.getTime() + 'Disconnected from Exchange Qoute Server');
    client.end();
  });
});

////////////////////////////////////////////////
// Socket
////////////////////////////////////////////////
io.sockets.on('connection', function (socket) {
  socket.emit('ping', { msg: 'Hello World' });
});

////////////////////////////////////////////////
// HTTP Server
////////////////////////////////////////////////
server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
