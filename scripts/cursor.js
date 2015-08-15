/**
 *
 */

function Cursor(canvas) {
  this.canvas_ = canvas;
  this.context_ = null;

  this.cursorImage_ = null;
  this.cursorCurrent_ = [0, 0];
  this.cursorTarget_ = [0, 0];
}

/**
 * Inertial constant.
 */
Cursor.RESPONSIVENESS = 0.1;

/**
 * Framerate / update delay in milliseconds.
 */
Cursor.UPDATE_DELAY = 10;

Cursor.prototype.initialize = function() {
  this.canvas_.style.zIndex = 100;
  this.canvas_.style.position = 'fixed';
  this.canvas_.width = document.body.offsetWidth;
  this.canvas_.height = document.body.offsetHeight;
  this.canvas_.style.width = document.body.offsetWidth + 'px';
  this.canvas_.style.height = document.body.offsetHeight + 'px';

  this.context_ = this.canvas_.getContext('2d');

  console.log(this.canvas_, this.context_);

  this.cursorImage_ = new Image();
  this.cursorImage_.src = 'data/cursor.png';

  window.addEventListener('mousemove', bind(this, this.onMouseMove));
  setInterval(bind(this, this.updateCursor), Cursor.UPDATE_DELAY);
};

Cursor.prototype.onMouseMove = function(event) {
  this.cursorTarget_ = [event.clientX, event.clientY];
};

Cursor.prototype.updateCursor = function() {
  var newX = (this.cursorTarget_[0] - this.cursorCurrent_[0]) *
      Cursor.RESPONSIVENESS + this.cursorCurrent_[0];
  var newY = (this.cursorTarget_[1] - this.cursorCurrent_[1]) *
      Cursor.RESPONSIVENESS + this.cursorCurrent_[1];
  this.cursorCurrent_ = [newX, newY];

  this.context_.clearRect(0, 0, this.canvas_.width, this.canvas_.height);
  this.context_.drawImage(
      this.cursorImage_,
      newX - this.cursorImage_.width / 2,
      newY - this.cursorImage_.height / 2);

};
