// Turn the sprite map into usable components
Crafty.sprite(32, "images/tiles.png", {
  grass1: [0,0],
  grass2: [1,0],
  grass3: [2,0],
  grass4: [3,0],
  dirt:   [8,0],
});

Crafty.sprite(1, "images/hero_sprite.png", {
  player: [0,0, 30, 60]
});

// LOADING SCENE
Crafty.scene("loading", function() {
  var text = Crafty.e("2D, DOM, text").attr({w: 300, h: 320, x: 150, y: 120})

  Crafty.background("#000");
  text.text("Loading")
  text.css({"text-align": "center", "color": "white", "font-size": "20px"});

  Crafty.load(["images/tiles.png", "images/hero_sprite.png"], function() {
    Crafty.scene("main"); // When everything is loaded, run the main scene
  });
});

// MAIN SCENE
Crafty.scene("main", function() {
  generateMap();

  // Create our player entity with some premade components
  var player = Crafty.e("2D, DOM, player, controls, CustomControls, animate, collision, persist")
    .attr({x: 400, y: 320, z: 1})
    .initializeControls(2)
    .animate("walk_down",  [[0,0,30,60], [30,0,30,60], [60,0,30,60], [3*30, 0,30,60], [5*30, 0,30,60], [4*30, 0,30,60]])
    .animate("walk_left",  [[0,60,30,60], [30,60,30,60], [60,60,30,60], [3*30,60,30,60], [5*30,60,30,60], [4*30,60,30,60]])
    .animate("walk_up",    [[0,120,30,60], [30,120,30,60], [60,120,30,60], [3*30,120,30,60], [5*30,120,30,60], [4*30,120,30,60]])
    .animate("walk_right", [[0,180,30,60], [30,180,30,60], [60,180,30,60], [3*30,180,30,60], [5*30,180,30,60], [4*30,180,30,60]])
    .bind("enterframe", function(e) {
      if (this.__move.left)
        if (!this.isPlaying("walk_left"))
          player.stop().animate("walk_left", 10)

      if (this.__move.right)
        if (!this.isPlaying("walk_right"))
          this.stop().animate("walk_right", 10);

      if (this.__move.up)
        if (!this.isPlaying("walk_up"))
          this.stop().animate("walk_up", 10);

      if (this.__move.down)
        if (!this.isPlaying("walk_down"))
          this.stop().animate("walk_down", 10);
    }).bind("keyup", function(e) {
      this.stop();
    });

  var socket = io.connect('http://localhost:3000');

  socket.on('keydown', function (data) {
    player.keyDown(data.keyCode)
  });

  socket.on('keyup', function () {
    player.keyUp()
  });

  // Broadcast the player movement to the other clients.
  player.bind("keyup", function(e) { socket.emit("keyup") });
  player.bind("keydown", function(e) { socket.emit("keydown", {"keyCode": e.keyCode}) });
});

