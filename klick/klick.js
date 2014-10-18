// Copyright Alvin Lin 2014
/**
 * @author Alvin Lin (alvin.lin@stuypulse.com)
 * Script for the klick game.
 */

function Klick(canvas) {
  this.canvas_ = canvas;
}

Klick.prototype.update = function(event) {
  var mouseX = event.pageX - this.canvas_.parentElement.offsetLeft;
  var mouseY = event.pageY - this.canvas_.parentElement.offsetTop;

  console.log(mouseX, mouseY);
};

Klick.prototype.startGame = function() {
  this.canvas_.onmousemove = bind(this, function(e) {
    this.update(e);
  });
};
