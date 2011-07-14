var express = require('express');
var io = require('socket.io');

var app = module.exports = express.createServer()
  , io = io.listen(app);

// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes
require('./routes/site')(app);

app.listen(3000);
console.log("...aaaand we're up! (port: %d env: %s)", app.address().port, app.settings.env);

io.sockets.on('connection', function (socket) {
  socket.on('keydown', function (data) {
    socket.broadcast.emit("keydown", data);
  });

  socket.on('keyup', function () {
    socket.broadcast.emit("keyup");
  });
});
