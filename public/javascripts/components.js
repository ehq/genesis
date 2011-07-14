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
