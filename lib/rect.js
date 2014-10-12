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

  this.rect_ = document.createElementNS('http://www.w3.org/2000/svg',
                                        'rect');
  this.updateRect();
}

Rect.prototype.getSVG = function() {
  return this.rect_;
};

Rect.prototype.updateRect = function() {
  this.rect_.setAttribute('x', this.x_);
  this.rect_.setAttribute('y', this.y_);
  this.rect_.setAttribute('width', this.width_);
  this.rect_.setAttribute('height', this.height_);
  this.rect_.setAttribute('fill', this.fill_);
}

Rect.prototype.getXY = function() {
  return [this.x_, this.y_];
};

Rect.prototype.setXY = function(x, y) {
  this.x_ = x;
  this.y_ = y;
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
