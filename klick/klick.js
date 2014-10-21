// Copyright Alvin Lin 2014
/**
 * @author Alvin Lin (alvin.lin@stuypulse.com)
 * Script for the klick game.
 */

function Klick(canvas) {
  this.canvas_ = canvas;
  this.circle_ = null;
  this.circleModel_ = null;
}

Klick.prototype.update = function(event) {
  var mouseX = event.pageX - this.canvas_.parentElement.offsetLeft;
  var mouseY = event.pageY - this.canvas_.parentElement.offsetTop;
  this.circle_.setXY(this.circleModel_.getXY());
};

Klick.prototype.startGame = function() {
  this.circle_ = new Circle(50, 350, 10, 'red');
  this.circleModel_ = new PhysicalObjectModel(50, 350, 0, 0, null, null, 350);
  this.canvas_.appendChild(this.circle_.getSVG());

  this.canvas_.onmousedown = bind(this, function() {
    this.circleModel_.setVY(-100);
  });

  setInterval(bind(this, function() {
    this.circle_.setXY(this.circleModel_.getXY());
    this.circleModel_.update();

  }), 1);
};
