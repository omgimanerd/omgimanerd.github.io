// Copyright Alvin Lin 2014
/**
 * @author Alvin Lin (alvin.lin@stuypulse.com)
 * Script for the tap game.
 */

function Tap(canvas) {
  this.canvas_ = canvas;
  this.width_ = canvas.offsetWidth;
  this.height_ = canvas.offsetHeight;
}

Tap.prototype.buildGameBackground = function() {
  console.log(this.width_, this.height_);

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

Tap.prototype.startGame = function() {

}
