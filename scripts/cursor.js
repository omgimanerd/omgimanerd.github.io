/**
 * This is the class that draws the animation that follows the user's
 * cursor.
 * @author Alvin Lin (alvin.lin@stuypulse.com)
 */

function CursorAnimator(canvas) {
  this.canvas_ = canvas;
  this.context_ = null;

  this.cursorImage_ = null;
  this.cursorCurrent_ = [0, 0];
  this.cursorTarget_ = [0, 0];

  this.cursorRotationAngle_ = 0;

  this.isAnimating_ = false;
}

/**
 * This is an inertial constant that determines how fast the cursor image
 * follows the user's cursor.
 */
CursorAnimator.RESPONSIVENESS = 0.1;

/**
 * This is the framerate / update delay in milliseconds.
 */
CursorAnimator.UPDATE_DELAY = 10;

/**
 * This is the rotation rate of the cursor image in radians per
 * CursorAnimator.UPDATE_DELAY.
 */
CursorAnimator.ROTATION_RATE = 0.025

/**
 * This is the path to the image used for the cursor.
 */
CursorAnimator.IMAGE_SRC = 'data/cursor.png';

/**
 * This is the color to set gradient lines for the cursor.
 */
CursorAnimator.LINE_COLOR = '#00E4FF';

/**
 * This function initializes the canvas, canvas context, and cursor image.
 */
CursorAnimator.prototype.initialize = function() {
  this.canvas_.style.position = 'fixed';
  this.updateCanvasSize();
  this.cursorCurrent_ = [this.canvas_.width / 2, -100];
  this.cursorTarget_ = [this.canvas_.width / 2, this.canvas_.height / 2];

  this.context_ = this.canvas_.getContext('2d');

  this.cursorImage_ = new Image();
  this.cursorImage_.src = CursorAnimator.IMAGE_SRC;
};

/**
 * This function sets the event handlers and the animation delay.
 */
CursorAnimator.prototype.setEventHandlers = function() {
  window.addEventListener('mousemove', bind(this, this.onMouseMove));
  setInterval(bind(this, this.updateAnimation), CursorAnimator.UPDATE_DELAY);
  this.isAnimating_ = true;
};

/**
 * This function starts the cursor animation if the canvas and context have
 * been initialized.
 */
CursorAnimator.prototype.startAnimation = function() {
  this.isAnimating_ = true;
};

/**
 * This function suspends the cursor animation.
 */
CursorAnimator.prototype.suspendAnimation = function() {
  this.isAnimating_ = false;
};

/**
 * This method fits the canvas to the document body. It is used to initialize
 * the canvas and set its size if the user resizes the window. This works off
 * the assumption that the document body is always 100% of the screen's width
 * and height.
 */
CursorAnimator.prototype.updateCanvasSize = function() {
  this.canvas_.width = document.body.offsetWidth;
  this.canvas_.height = document.body.offsetHeight;
  this.canvas_.style.width = document.body.offsetWidth + 'px';
  this.canvas_.style.height = document.body.offsetHeight + 'px';
};

/**
 * This method is bound to the mousemove event and only serves to record
 * the user's mouse position.
 */
CursorAnimator.prototype.onMouseMove = function(event) {
  this.cursorTarget_ = [event.clientX, event.clientY];
};

/**
 * This method is the actual animation method that animates the user's
 * crosshair.
 */
CursorAnimator.prototype.updateAnimation = function() {
  this.cursorCurrent_[0] += (this.cursorTarget_[0] - this.cursorCurrent_[0]) *
      CursorAnimator.RESPONSIVENESS;
  this.cursorCurrent_[1] += (this.cursorTarget_[1] - this.cursorCurrent_[1]) *
      CursorAnimator.RESPONSIVENESS;

  if (this.isAnimating_) {
    // We call updateCanvasSize() in case the user resizes their window.
    this.updateCanvasSize();

    // Clear the canvas.
    this.context_.clearRect(0, 0, this.canvas_.width, this.canvas_.height);

    // Draw the lines from the corners to the cursor image.
    var x = this.cursorCurrent_[0];
    var y = this.cursorCurrent_[1];
    this.drawCursorLine(0, 0, x, y);
    this.drawCursorLine(this.canvas_.width, 0, x, y);
    this.drawCursorLine(0, this.canvas_.height, x, y);
    this.drawCursorLine(this.canvas_.width, this.canvas_.height, x, y);

    this.context_.save();
    this.context_.translate(this.cursorCurrent_[0], this.cursorCurrent_[1]);
    this.context_.rotate(this.cursorRotationAngle_);
    // Draw the cursor image.
    this.context_.drawImage(
        this.cursorImage_,
        -this.cursorImage_.width / 2,
        -this.cursorImage_.height / 2);
    this.context_.restore();

    this.cursorRotationAngle_ += 0.025;
  }
};

/**
 * This is an internal helper method to draw the lines from the corner to the
 * mouse.
 */
CursorAnimator.prototype.drawCursorLine = function(startX, startY, endX, endY) {
  var gradient = this.context_.createLinearGradient(
      startX, startY, endX, endY);
  gradient.addColorStop(0, '#000000');
  gradient.addColorStop(0.4, CursorAnimator.LINE_COLOR);
  gradient.addColorStop(0.8, '#000000');
  this.context_.strokeStyle = gradient;
  this.context_.beginPath();
  this.context_.moveTo(startX, startY);
  this.context_.lineTo(endX, endY);
  this.context_.stroke();
};
