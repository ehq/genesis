Crafty.c("humanPlayer", {
  init: function() {
    this.spritePositions = [ [0,0], [31*3,0], [0,49*4], [32*3, 49*4] ]
    this.spriteId = Crafty.randRange(0,3)
    this.addComponent("2D, DOM, controls, CustomControls, animate, collision, persist, player"+this.spriteId)
    this.attr({x: 400, y: 320, z:1}) // Make new players appear in the center of the map.

    this.enableAnimations();
  },

  enableAnimations: function() {
    var pos = this.spritePositions[this.spriteId]

    // The animation is based on this Sprite: images/players.png
    // The animation needs an array like [[x,y,width,height]].
    this.movementAnimation = {
      "down":  [ [pos[0], pos[1], 33, 45], [pos[0] + 33, pos[1], 33, 45], [pos[0] + 62, pos[1], 33, 45] ],
      "left":  [ [pos[0], pos[1] + 45, 31, 45], [pos[0] + 31, pos[1] + 45, 31, 45], [pos[0] + 62, pos[1]+45, 31, 45] ],
      "right": [ [pos[0], pos[1]+94, 31, 45], [pos[0] + 31, pos[1]+94, 31, 45], [pos[0] + 62, pos[1]+94, 31, 45] ],
      "up":    [ [pos[0], pos[1]+140, 31, 45], [pos[0] + 31, pos[1]+140, 31, 45], [pos[0] + 62, pos[1]+140, 31, 45] ],
    }

    this.animate("walk_down",  this.movementAnimation.down)
    this.animate("walk_left",  this.movementAnimation.left)
    this.animate("walk_right", this.movementAnimation.right)
    this.animate("walk_up",    this.movementAnimation.up)

    this.bind("enterframe", function(e) {
      if (this.__move.down && !this.isPlaying("walk_down"))
        this.stop().animate("walk_down", 10);
      if (this.__move.left && !this.isPlaying("walk_left"))
        this.stop().animate("walk_left", 10);
      if (this.__move.right && !this.isPlaying("walk_right"))
        this.stop().animate("walk_right", 10);
      if (this.__move.up && !this.isPlaying("walk_up"))
        this.stop().animate("walk_up", 10);
    })
  }
})

Crafty.c('CustomControls', {
  __move: {left: false, right: false, up: false, down: false},
  _speed: 5,

  initializeControls: function(speed) {
    var move = this.__move;
    if (speed) this._speed = speed;

    // Move the player in a direction depending on the booleans
    // Only move the player in one direction at a time (up/down/left/right)
    this.bind('enterframe', function() {
      if (move.right)     this.x += this._speed;
      else if (move.left) this.x -= this._speed;
      else if (move.up)   this.y -= this._speed;
      else if (move.down) this.y += this._speed;
    })

    this.bind('keydown', function(e) {
      this.keyDown(e.keyCode)
      this.preventTypeaheadFind(e);
    })

    this.bind('keyup', function(e) {
      this.keyUp(e.keyCode)
      this.preventTypeaheadFind(e);
    });

    return this;
  },

  // If key is released, stop moving
  keyUp: function(keyCode) {
    var move = this.__move;
    move.right = move.left = move.down = move.up = false;
  },

  keyDown: function(keyCode) {
    var move = this.__move;

    // Default movement booleans to false
    move.right = move.left = move.down = move.up = false;

    // If keys are down, set the direction
    if (keyCode === Crafty.keys.RA) move.right = true;
    if (keyCode === Crafty.keys.LA) move.left  = true;
    if (keyCode === Crafty.keys.UA) move.up    = true;
    if (keyCode === Crafty.keys.DA) move.down  = true;
  }
})
