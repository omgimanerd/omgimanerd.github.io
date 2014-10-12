// Copyright Alvin Lin 2014
/**
 * @author Alvin Lin (alvin.lin@stuypulse.com)
 * Generates and returns an SVG circle.
 * Has methods of mutability.
 */

function Circle(x, y, radius, fill) {
  this.x_ = x;
  this.y_ = y;
  this.radius_ = radius;
  this.fill_ = fill;

  this.circle_ = document.createElementNS('http://www.w3.org/2000/svg',
                                          'circle');
  this.updateCircle();
}

Circle.prototype.getSVG = function() {
  return this.circle_;
};

Circle.prototype.updateCircle = function() {
  this.circle_.setAttribute('cx', this.x_);
  this.circle_.setAttribute('cy', this.y_);
  this.circle_.setAttribute('r', this.radius_);
  this.circle_.setAttribute('fill', this.fill_);
};

Circle.prototype.getXY = function() {
  return [this.x_, this.y_];
};

Circle.prototype.setXY = function(x, y) {
  this.x_ = x;
  this.y_ = y;
  this.updateCircle();
};

Circle.prototype.getRadius = function() {
  return this.radius_;
};

Circle.prototype.setRadius = function(radius) {
  this.radius_ = radius;
  this.updateCircle();
};

Circle.prototype.getFill = function() {
  return this.fill_;
};

Circle.prototype.setFill = function(fill) {
  this.fill_ = fill;
  this.updateCircle();
};
