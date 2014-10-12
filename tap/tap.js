// Copyright Alvin Lin 2014
/**
 * @author Alvin Lin (alvin.lin@stuypulse.com)
 * Script for the tap game.
 */

// bind() function allows setTimeout to work on the objects.
function bind(object, method) {
  return function() {
    return method.apply(object, arguments);
  };
}

function Tap(canvas) {
  this.canvas_ = canvas;
  this.width_ = canvas.offsetWidth;
  this.height_ = canvas.offsetHeight;
  this.gameLoop_ = null;
}

Tap.FPS = 60;

Tap.prototype.buildGameStart = function() {
  var backgroundHeight = this.height_ / 4;

  var red = new Rect(
      0, 0, this.width_, backgroundHeight, 'red');
  var blue = new Rect(
      0, this.height_ / 4, this.width_, backgroundHeight, 'blue');
  var green = new Rect(
      0, this.height_ / 2, this.width_, backgroundHeight, 'green');
  var yellow = new Rect(
      0, 3 * this.height_ / 4, this.width_, backgroundHeight, 'yellow');

  this.canvas_.appendChild(red.getSVG());
  this.canvas_.appendChild(blue.getSVG());
  this.canvas_.appendChild(green.getSVG());
  this.canvas_.appendChild(yellow.getSVG());
}

Tap.prototype.update = function() {
  var mouseX, mouseY;
  document.onmousemove = function(e) {
    mouseX = e.pageX;
    mouseY = e.pageY;
  }

  console.log(mouseX, mouseY);
};

Tap.prototype.startGame = function() {
  this.gameLoop_ = setInterval(bind(this, this.update), 1000 / Tap.FPS);
};

Tap.prototype.endGame = function() {
  clearInterval(this.gameLoop_);
};
