// Copyright Alvin Lin 2014
/**
 * @author Alvin Lin (alvin.lin@stuypulse.com)
 * Models the physics of a physical object. Does not actually do
 * anything, merely a container for their values.
 * The velocities stored are in terms of pixels/second.
 * Likewise, the accelerations stored are in terms of pixels/second^2.
 */

function PhysicalObjectModel(x, y, vx, vy, ax, ay, ground) {
  this.x_ = x;
  this.y_ = y;
  this.vx_ = vx;
  this.vy_ = vy;
  this.ax_ = ax;
  this.ay_ = ay;
  this.ground_ = ground;
  
  if (this.ax_ == null) {
    this.ax_ = PhysicalObjectModel.DEFAULT_AX;
  }
  if (this.ay_ == null) {
    this.ay_ = PhysicalObjectModel.DEFAULT_AY;
  }

  /* The variables below will be set by methods */
  this.bounceFactor_ = 0;
}

/**
 * The default downwards acceleration, similar to gravitational acceleration.
 * We will assume acceleration is constant and that our velocity increases
 * or decreases linearly.
 */
PhysicalObjectModel.DEFAULT_AY = -100;

/**
 * The default acceleration backwards, represents a type of 'friction' that
 * slows down the physical object.
 * We will assume acceleration is constant and that our velocity increases
 * or decreases linearly.
 */
PhysicalObjectModel.DEFAULT_AX = 0;

/* Getter and setter methods */
PhysicalObjectModel.prototype.getX = function() {
  return this.x_;
};

PhysicalObjectModel.prototype.setX = function(x) {
  this.x_ = x;
};

PhysicalObjectModel.prototype.getY = function() {
  return this.y_;
};

PhysicalObjectModel.prototype.setY = function(y) {
  this.y_ = y;
};

PhysicalObjectModel.prototype.getXY = function() {
  return [this.x_, this.y_];
};

/**
 * If there is only one parameter, then we assume that it is an array
 * containing the x and y coordinate. If there are two coordinates, then
 * we assume they are the x and y coordinates respectively.
 */
PhysicalObjectModel.prototype.setXY = function(xy, optY) {
  if (optY == undefined) {
    this.x_ = xy[0];
    this.y_ = xy[1];
  } else {
    this.x_ = xy;
    this.y_ = optY;
  }
};

PhysicalObjectModel.prototype.getVX = function() {
  return this.vx_;
};

PhysicalObjectModel.prototype.setVX = function(vx) {
  this.vx_ = vx;
};

PhysicalObjectModel.prototype.getVY = function() {
  return this.vy_;
};

PhysicalObjectModel.prototype.setVY = function(vy) {
  this.vy_ = vy;
};

PhysicalObjectModel.prototype.setBounce = function(bounceFactor) {
  this.bounceFactor_ = bounceFactor;
};

/**
 * This function is intended to be called once per 10ms to update the
 * object model accordingly.
 */
PhysicalObjectModel.prototype.update = function() {
  this.x_ += this.vx_ / 100;
  // Y-velocity is reversed because the canvas coordinates increase going
  // downwards. The y will only decrease until it hits the ground.
  this.y_ = Math.min(this.y_ + (this.vy_ / 100), this.ground_);

  this.vx_ -= this.ax_ / 100;
  this.vy_ -= this.ay_ / 100;
  if (this.y_ == this.ground_) {
    this.vy_ = -this.bounceFactor_ * this.vy_;
    this.vx_ = 0;
  }
};
