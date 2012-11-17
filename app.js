var express = require('express'),
    http = require('http'),
    path = require('path'),
    net = require('net'),

    // Third Party
    hbs = require('hbs');

var app = express();

var port = process.argv[2] || 3000;

var client;

////////////////////////////////////////////////
// Express Configuration
////////////////////////////////////////////////
app.configure(function(){
  app.set('port', process.env.PORT || 8080);
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
  res.render('index', { title: 'Express' });
});

app.get('/go', function(req, res) {
  client = net.connect(port, function() {
    console.log('Client Connected');
    client.write('H\r\n');
  });

  client.setEncoding('ascii');
  // client.setKeepAlive(true);

  client.on('data', function(data) {
    // Example payload: 10.225|10.225|10.225|10.195|10.225|10.130|10.130|10.160|10.195|10.160|
    console.log(data);

    // Process Payload
    var stock_array = data.split("|");
    console.log(stock_array);

  });

  client.on('end', function() {
    console.log('Client Disconnected');
    client.end();
    res.send("done!");
  });
});

////////////////////////////////////////////////
// HTTP Server
////////////////////////////////////////////////
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
