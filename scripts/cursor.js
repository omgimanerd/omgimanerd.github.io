/**
 * This is the class that draws the animation that follows the user's
 * cursor.
 * @author Alvin Lin (alvin.lin@stuypulse.com)
 */

function Cursor(canvas) {
  this.canvas_ = canvas;
  this.context_ = null;

  this.cursorImage_ = null;
  this.cursorCurrent_ = [0, 0];
  this.cursorTarget_ = [0, 0];
}

/**
 * This is an inertial constant that determines how fast the cursor image
 * follows the user's cursor.
 */
Cursor.RESPONSIVENESS = 0.1;

/**
 * This is the framerate / update delay in milliseconds.
 */
Cursor.UPDATE_DELAY = 10;

/**
 * This is the color to set gradient lines for the cursor.
 */
Cursor.LINE_COLOR = '#00E4FF';

/**
 * Initializes the canvas and canvas context and binds the event listeners
 * and update frames.
 */
Cursor.prototype.initialize = function() {
  this.canvas_.style.position = 'fixed';
  this.updateCanvasSize();
  this.cursorCurrent_ = [this.canvas_.width / 2, this.canvas_.height / 2];
  this.cursorTarget_ = [this.canvas_.width / 2, this.canvas_.height / 2];

  this.context_ = this.canvas_.getContext('2d');

  this.cursorImage_ = new Image();
  this.cursorImage_.src = 'data/cursor.png';

  window.addEventListener('mousemove', bind(this, this.onMouseMove));
  setInterval(bind(this, this.updateCursor), Cursor.UPDATE_DELAY);
};

/**
 * This method fits the canvas to the document body. It is used to initialize
 * the canvas and set its size if the user resizes the window.
 */
Cursor.prototype.updateCanvasSize = function() {
  this.canvas_.width = document.body.offsetWidth;
  this.canvas_.height = document.body.offsetHeight;
  this.canvas_.style.width = document.body.offsetWidth + 'px';
  this.canvas_.style.height = document.body.offsetHeight + 'px';
};

/**
 * This method is bound to the mousemove event and only serves to record
 * the user's mouse position.
 */
Cursor.prototype.onMouseMove = function(event) {
  this.cursorTarget_ = [event.clientX, event.clientY];
};

/**
 * This method is the actual animation method that animates the user's
 * crosshair.
 */
Cursor.prototype.updateCursor = function() {
  this.cursorCurrent_[0] += (this.cursorTarget_[0] - this.cursorCurrent_[0]) *
      Cursor.RESPONSIVENESS;
  this.cursorCurrent_[1] += (this.cursorTarget_[1] - this.cursorCurrent_[1]) *
      Cursor.RESPONSIVENESS;

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

  // Draw the cursor image.
  this.context_.drawImage(
      this.cursorImage_,
      this.cursorCurrent_[0] - this.cursorImage_.width / 2,
      this.cursorCurrent_[1] - this.cursorImage_.height / 2);
};

/**
 * This is an internal helper method to draw the lines from the corner to the
 * mouse.
 */
Cursor.prototype.drawCursorLine = function(startX, startY, endX, endY) {
  var gradient = this.context_.createLinearGradient(
      startX, startY, endX, endY);
  gradient.addColorStop(0, '#000000');
  gradient.addColorStop(0.4, Cursor.LINE_COLOR);
  gradient.addColorStop(0.8, '#000000');
  this.context_.strokeStyle = gradient;
  this.context_.beginPath();
  this.context_.moveTo(startX, startY);
  this.context_.lineTo(endX, endY);
  this.context_.stroke();
};
