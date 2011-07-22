// Turn the sprite map into usable components
Crafty.sprite(32, "images/tiles.png", {
  grass1: [0,0],
  grass2: [1,0],
  grass3: [2,0],
  grass4: [3,0],
  dirt:   [8,0],
});

// FIXME: Make working with sprites easier.. this is insane.
Crafty.sprite(1, "images/players.png", {
  player0: [0,0, 31, 45],
  player1: [31*3,0, 31, 45],
  player2: [0,49*4, 31, 45],
  player3: [33*4,49*4, 31, 45]
});

// LOADING SCENE
Crafty.scene("loading", function() {
  var text = Crafty.e("2D, DOM, text").attr({w: 300, h: 320, x: 150, y: 120})

  Crafty.background("#000");
  text.text("Loading").css({"text-align": "center", "color": "white", "font-size": "20px"});

  Crafty.load(["images/tiles.png", "images/players.png"], function() {
    Crafty.socket = io.connect('http://localhost:3000');

    Crafty.scene("main"); // When everything is loaded, run the main scene
  });
});

// MAIN SCENE
Crafty.scene("main", function() {
  generateMap();

  // Create our player entity with some premade components
  var player = Crafty.e("humanPlayer")
    .attr({z: 99}) // Make other players appear behind the user's player.
    .initializeControls(2) // Allow the user to control his player with the keyboard.

  var players = [];

  // Register the human_player in the server, so it's broadcasted to all other clients.
  Crafty.socket.emit("register_player")

  // Add a new player to the map when a user joins the game.
  Crafty.socket.on("player_joined", function(data) {
    var new_player = Crafty.e("humanPlayer")
    players.push(new_player)
  });

  // After Joining the server sends data with all the current players and their positions so the client loads them into the map.
  Crafty.socket.on("load_current_players", function(data) {
    var current_players = data.players
    for (var i = 0; i < current_players; i++) {
      var new_player = Crafty.e("humanPlayer").attr({x: (400 + 30*i)})
      players.push(new_player)
    }
  });

  // Move the player realisticaly as the user controls it,
  // but also make sure the end position is accurate.
  Crafty.socket.on('keydown', function (data) {
    player.keyDown(data.keyCode)
    player.attr(data.position)
  });

  Crafty.socket.on('keyup', function (data) {
    player.keyUp()
    player.attr(data.position)
  });

  // Broadcast the player movement to the other clients.
  player.bind("keyup", function(e) { Crafty.socket.emit("keyup", {"position": player.pos() }) });
  player.bind("keydown", function(e) { Crafty.socket.emit("keydown", {"keyCode": e.keyCode, "position": player.pos() }) });
});
