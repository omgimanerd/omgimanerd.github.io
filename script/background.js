/**
 * Script for the background animations.
 * @author Alvin Lin (alvin.lin@stuypulse.com)
 */

function bind(object, method) {
  return function() {
    return method.apply(object, arguments);
  };
}

function Background(canvas) {
  this.canvas_ = canvas;
  this.width_ = document.body.offsetWidth;
  this.height_ = document.body.offsetHeight;
}

Background.prototype.createDot = function(x, y, color, maxRadius, animationTime) {
  var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circle.setAttribute('cx', x.toString());
  circle.setAttribute('cy', y.toString());
  circle.setAttribute('r', '0');
  circle.setAttribute('fill', color);
  circle.setAttribute('fill-opacity', 0.75);
  this.canvas_.appendChild(circle);

  var animationSteps = Math.floor(maxRadius / 2);
  var animationStepTime = animationTime / animationSteps;
  var animationTime = 0;
  var radius = 0;
  var radiusStepIncrease = maxRadius / animationSteps;
  for (var i = 0; i < animationSteps; ++i) {
    animationTime += animationStepTime;
    setTimeout(function(){
      circle.setAttribute('r', radius++);
    }, animationTime);
  }
  for (var i = 0; i < animationSteps; ++i) {
    animationTime += animationStepTime;
    setTimeout(function(){
      circle.setAttribute('r', radius--);
    }, animationTime);
  }
  setTimeout(bind(this, function() {
    this.canvas_.removeChild(circle);
  }), animationTime);
};

Background.prototype.startAnimation = function() {
  // Set the width and height of the SVG canvas to the width and height
  //
  this.canvas_.setAttribute('width', this.width_.toString()+'px');
  this.canvas_.setAttribute('height', this.height_.toString()+'px');
};
