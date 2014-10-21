// Copyright Alvin Lin 2014
/**
 * Generates and returns an SVG rectangle.
 * Has methods of mutability.
 */

function Rect(x, y, width, height, fill) {
  this.x_ = x;
  this.y_ = y;
  this.width_ = width;
  this.height_ = height;
  this.fill_ = fill;
  this.model_ = model;

  this.rect_ = document.createElementNS('http://www.w3.org/2000/svg',
                                        'rect');
  this.updateRect();
}

Rect.prototype.getSVG = function() {
  return this.rect_;
};

Rect.prototype.updateWithPhysics = function() {
  if (this.model_ !== null) {
    this.model_.update();
    this.setXY(this.model_.getXY());
  }
};

/**
 * @private
 */
Rect.prototype.updateRect = function() {
  this.rect_.setAttribute('x', this.x_);
  this.rect_.setAttribute('y', this.y_);
  this.rect_.setAttribute('width', this.width_);
  this.rect_.setAttribute('height', this.height_);
  this.rect_.setAttribute('fill', this.fill_);
};

Rect.prototype.getX = function() {
  return this.x_;
};

Rect.prototype.setX = function(x) {
  this.x_ = x;
  this.updateRect();
};

Rect.prototype.getY = function() {
  return this.y_;
};

Rect.prototype.setY = function(y) {
  this.y_ = y;
  this.updateRect();
};

Rect.prototype.getXY = function() {
  return [this.x_, this.y_];
};

/**
 * If there is only one parameter, then we assume that it is an array
 * containing the x and y coordinate. If there are two coordinates, then
 * we assume they are the x and y coordinates respectively.
 */
Rect.prototype.setXY = function(xy, optY) {
  if (optY == undefined) {
    this.x_ = xy[0];
    this.y_ = xy[1];
  } else {
    this.x_ = xy;
    this.y_ = optY;
  }
  this.updateRect();
};

Rect.prototype.getWidth = function() {
  return this.width_;
};

Rect.prototype.setWidth = function(width) {
  this.width_ = width;
  this.updateRect();
};

Rect.prototype.getHeight = function() {
  return this.height_;
};

Rect.prototype.setHeight = function(height) {
  this.height_ = height;
  this.updateRect();
};

Rect.prototype.getFill = function() {
  return this.fill_;
};

Rect.prototype.setFill = function(fill) {
  this.fill_ = fill;
  this.updateRect();
};

Rect.prototype.addModel = function(model) {
  this.model_ = model;
};
