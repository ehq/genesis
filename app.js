require.paths.unshift('./node_modules')
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

var port = process.env.PORT || 3000;
app.listen(port);
console.log("...aaaand we're up! (port: %d env: %s)", app.address().port, app.settings.env);

// Events
var players = 0;

io.sockets.on('connection', function (socket) {
  socket.on('register_player', function(data) {
    socket.emit("load_current_players", {"players": players})
    socket.broadcast.emit("player_joined")
    players++;
  })

  socket.on('keydown', function (data) {
    socket.broadcast.emit("keydown", data);
  });

  socket.on('keyup', function (data) {
    socket.broadcast.emit("keyup", data);
  });

  socket.on('disconnect', function () {
    players--;
  });
});
