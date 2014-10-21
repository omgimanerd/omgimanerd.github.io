// Copyright Alvin Lin 2014
/**
 * @author Alvin Lin (alvin.lin@stuypulse.com)
 * Script for the klick game.
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
  this.lost_ = true;
}

Klick.prototype.buildGameStart = function() {
  // Necessary SVG elements and the physics model of the moving
  // circle.
  this.circle_ = new Circle(100, 350, 10, 'red');
  this.circle_.addModel(new PhysicalObjectModel(
      100, 350, 0, 0, null, null, 375));

  // Create the background.
  this.background_ = new Rect(
      0, 0, this.width_, this.height_, Colors.KLICK_BACKGROUND);
  this.canvas_.appendChild(this.background_.getSVG());
};

Klick.prototype.update = function() {
};

Klick.prototype.startGame = function() {
  // Add the circle to the canvas.
  this.canvas_.appendChild(this.circle_.getSVG());

  // Add the canvas event handler.
  this.canvas_.onmousedown = bind(this, function() {
    this.circle_.setVY(this.circle_.getVY() + 100);
  });

  // Start the game loop.
  if (this.lost_) {
    setInterval(bind(this, function() {
      this.circle_.updateWithPhysics();
    }), 1);
  }
  this.lost_ = false;

  // Hide the overlay.
  this.overlayEl_.style.zIndex = -1;
};

Klick.prototype.endGame = function() {
  // TODO: insert cookie score counting

  // Stop the game loop.
  this.lost_ = true;
  clearInterval(this.gameLoop_);
  this.canvas_.removeChild(this.circle_.getSVG());

  // Bring back the overlay.
  this.overlayEl_.style.lineHeight = '100px;';
  this.overlayEl_.style.zIndex = 1;
  this.overlayEl_.style.innerHTML = 'You lost!<br />Try again';
};
