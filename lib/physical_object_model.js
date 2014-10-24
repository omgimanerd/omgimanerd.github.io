// Copyright Alvin Lin 2014
/**
 * @author Alvin Lin (alvin.lin@stuypulse.com)
 * Models the physics of a physical object. Does not actually do
 * anything, merely a container for their values.
 * The velocities stored are in terms of pixels/second.
 * Likewise, the accelerations stored are in terms of pixels/second^2.
 */

function PhysicalObjectModel(x, y, vx, vy, ax, ay) {
  this.x_ = x;
  this.y_ = y;
  this.vx_ = vx;
  this.vy_ = vy;
  this.ax_ = ax;
  this.ay_ = ay;
  
  if (this.ax_ === null || this.ax_ === undefined) {
    this.ax_ = PhysicalObjectModel.DEFAULT_AX;
  }
  if (this.ay_ === null || this.ay_ === undefined) {
    this.ay_ = PhysicalObjectModel.DEFAULT_AY;
  }

  /* The variables below will be set by methods */
  this.bounceFactor_ = 0;
  this.friction_ = 0;
  this.boundsX_ = [-1000, 1000];
  this.boundsY_ = [-1000, 1000];
}

/**
 * The default downwards acceleration, similar to gravitational acceleration.
 * We will assume acceleration is constant and that our velocity increases
 * or decreases linearly.
 */
PhysicalObjectModel.DEFAULT_AY = -200;

/**
 * The default horizontal acceleration. The object should not be accelerating
 * horizontally.
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
  if (optY === undefined) {
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


/**
 * Velocity is negated so that positive numbers represent an
 * upwards acceleration.
 */
PhysicalObjectModel.prototype.getVY = function() {
  return -this.vy_;
};
PhysicalObjectModel.prototype.setVY = function(vy) {
  this.vy_ = -vy;
};

/**
 * bounceFactor is a decimal from 0 to 1 representing the efficiency of the
 * bouncing of the ball, or how much velocity it will bounce back up with.
 * It is set at a default of zero when the object is initialized.
 */
PhysicalObjectModel.prototype.setBounce = function(bounceFactor) {
  this.bounceFactor_ = bounceFactor;
};

PhysicalObjectModel.prototype.setBoundsX = function(boundsX, optMaxBound) {
  if (boundsX !== null && boundsX !== undefined) {
    if (optMaxBound === undefined) {
      this.boundsX_ = boundsX;
    } else {
      this.boundsX_ = [boundsX, optMaxBound];
    }
  }
};

PhysicalObjectModel.prototype.setBoundsY = function(boundsY, optMaxBound) {
  if (boundsY !== null && boundsY !== undefined) {
    if (optMaxBound === undefined) {
      this.boundsY_ = boundsY;
    } else {
      this.boundsY_ = [boundsY, optMaxBound];
    }
  }
};

/**
 * Friction is a number in pixels / s^2 that the dots will be slowed by
 * when they bounce or hit the ground. It is set at a default of zero when
 * the object is initialized.
 */
PhysicalObjectModel.prototype.setFriction = function(friction) {
  this.friction_ = friction;
};

/**
 * This function is intended to be called once per 10ms to update the
 * object model according to the physics.
 */
PhysicalObjectModel.prototype.update = function() {
  this.x_ = Math.min(Math.max(
      this.boundsX_[0], this.x_ + this.vx_ / 100), this.boundsX_[1]);
  this.y_ = Math.min(Math.max(
      this.boundsY_[0], this.y_ + this.vy_ / 100), this.boundsY_[1]);

  if (this.x_ == this.boundsX_[0] || this.x_ == this.boundsX_[1]) {
    this.vx_ *= -this.bounceFactor_;
  }

  this.vx_ += this.ax_ / 100;
  this.vy_ -= this.ay_ / 100;
  if (this.y_ == this.boundsY_[1]) {
    this.vy_ *= -this.bounceFactor_;
    if (this.vx_ > 0) {
      this.vx_ -= this.friction_ / 100;
    } else if (this.vx_ < 0) {
      this.vx_ += this.friction_ / 100;
    }
  }

  if (this.y_ == this.boundsY_[0]) {
    this.vy_ *= -1;
  }
};
