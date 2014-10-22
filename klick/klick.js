// Copyright Alvin Lin 2014
/**
 * @author Alvin Lin (alvin.lin@stuypulse.com)
 * Script for the klick game. Klick is a game in which the player controls
 * a red ball that is governed by the laws of normal physics. The ball will
 * jump towards the player's cursor whenever the player clicks. Other colored
 * balls will bounce across the screen, and the player must avoid touch all
 * other balls.
 */

function Klick(canvas, klickOverlayEl, scoreEl, highScoreEl) {
  this.canvas_ = canvas;
  this.width_ = canvas.offsetWidth;
  this.height_ = canvas.offsetHeight;
  this.overlayEl_ = klickOverlayEl;
  this.scoreEl_ = scoreEl;
  this.highScoreEl_ = highScoreEl;

  // Necessary global variables.
  this.score_ = 0;
  this.gameLoop_ = null;
  this.gameLoop2_ = null;
  this.lost_ = true;
}

/**
 * Constant values for the generation of the dots.
 */
Klick.DOT_RADIUS = 10;
Klick.PLAYER_DOT_XBOUNDS = [7.5, 592.5];
Klick.PLAYER_DOT_YBOUNDS = [7.5, 390];

Klick.prototype.buildGameStart = function() {
  // Necessary SVG elements and the physics model of the moving
  // circle.
  this.playerdot_ = new Circle(200, 350, 10, Colors.RED);
  this.playerdot_.addModel(new PhysicalObjectModel(
      200, 350, 0, 0, null, null));
  this.playerdot_.setBounce(0.5);
  this.playerdot_.setBoundsX(Klick.PLAYER_DOT_XBOUNDS);
  this.playerdot_.setBoundsY(Klick.PLAYER_DOT_YBOUNDS);

  // This array will hold all the balls that the player does not control.
  this.obstacleBalls_ = [];

  // Create the background.
  this.background_ = new Rect(
      0, 0, this.width_, this.height_, Colors.KLICK_BACKGROUND);
  this.canvas_.appendChild(this.background_.getSVG());
};

Klick.prototype.onMouseClick = function(event) {
  var mouseX = event.pageX - this.canvas_.parentElement.offsetLeft;
  var mouseY = event.pageY - this.canvas_.parentElement.offsetTop;
  this.playerdot_.setVY(this.playerdot_.getY() - mouseY);
  this.playerdot_.setVX(mouseX - this.playerdot_.getX());
};

Klick.prototype.createObstacleDot = function(x, y,
                                             vx, vy,
                                             ax, ay,
                                             bounceFactor, fill) {
    var obstacleBall = new Circle(x, y, Klick.DOT_RADIUS, fill);
    obstacleBall.addModel(new PhysicalObjectModel(
        x, y, vx, vy, ax, ay));
};

Klick.prototype.createRandomObstacleDot = function() {

};

Klick.prototype.updateObstacleDots = function() {
  for (var i = 0; i < this.obstacleBalls_.length(); ++i) {
    this.obstacleBalls_[i].updateWithPhysics();
  }
};

Klick.prototype.startGame = function() {
  // Add the circle to the canvas.
  this.canvas_.appendChild(this.playerdot_.getSVG());

  // Add the canvas event handler.
  this.canvas_.onmousedown = bind(this, function(event) {
    this.onMouseClick(event);
  });

  // Start the game loops. We will use two independent game loops, one
  // for updating the player ball's position and position of the obstacle
  // balls, and the other for creating obstacle dots.
  if (this.lost_) {
    this.gameLoop_ = setInterval(bind(this, function() {
      this.playerdot_.updateWithPhysics();
      this.updateObstacleDots();
    }), 1);
    this.gameLoop2_ = setInterval(
        bind(this, this.createRandomObstacleDot), 150);
  }
  this.lost_ = false;

  // Hide the overlay.
  this.overlayEl_.style.zIndex = -1;
};

Klick.prototype.endGame = function() {
  // TODO: insert cookie score counting

  // Stop the game loops.
  this.lost_ = true;
  clearInterval(this.gameLoop_);
  clearInterval(this.gameLoop2_);
  this.canvas_.removeChild(this.playerdot_.getSVG());

  // Bring back the overlay.
  this.overlayEl_.style.lineHeight = '100px;';
  this.overlayEl_.style.zIndex = 1;
  this.overlayEl_.style.innerHTML = 'You lost!<br />Try again';
};
