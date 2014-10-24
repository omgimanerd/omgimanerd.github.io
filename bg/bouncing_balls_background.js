// Copyright Alvin Lin 2014
/**
 * @author Alvin Lin (alvin.lin@stuypulse.com)
 * Script for the randomly appearing dots background animation.
 * Uses setTimeout() to control dot animation.
 * To use this background template, instantiate a BouncingBallsBackground
 * object at the end of the body and call
 * buildBouncingBallsBackgroundAnimation()
 * on the object.
 * The reason we do not use an <animate> object is because the 'dur' attribute
 * that defines the animation time counts from when the webpage is loaded, so
 * animations and circles added after the first 1500ms render at their end
 * animation state.
 * This file is intended as a distributable standalone but unlike other bg
 * animations, this file has a dependency on circle and physical_object_model
 * from my internal library.
 */

// bind() function allows setTimeout to work on the objects.
function bind(object, method) {
  return function() {
    return method.apply(object, arguments);
  };
}

function BouncingBallsBackground() {
  this.canvas_ = null;
  this.width_ = 0;
  this.height_ = 0;
  this.bouncingDots_ = [];
}

/**
 * Ranges for generating the random start values of the dots. The
 * x and y coordinates are dependent on the size of the canvas, and thus
 * are not stored hither.
 */
BouncingBallsBackground.MIN_Y = 250;
BouncingBallsBackground.MIN_VX = 100;
BouncingBallsBackground.MAX_VX = 300;
BouncingBallsBackground.MIN_VY = -150;
BouncingBallsBackground.MAX_VY = 150;
BouncingBallsBackground.AX = 0;
BouncingBallsBackground.MIN_AY = -250;
BouncingBallsBackground.MAX_AY = -150;
BouncingBallsBackground.DOT_COLORS = ['red', 'blue', 'green', 'yellow',
                                      'orange', 'magenta', 'cyan'];
BouncingBallsBackground.MIN_RADIUS = 10;
BouncingBallsBackground.MAX_RADIUS = 50;

BouncingBallsBackground.prototype.createBouncingDot = function(x, y,
                                                       vx, vy,
                                                       ax, ay,
                                                       radius,
                                                       bounceFactor,
                                                       fill,
                                                       xbounds, ybounds) {
  var circle = new Circle(x, y, radius, fill);
  circle.setModel(new PhysicalObjectModel(x, y, vx, vy, ax, ay));
  circle.setBounce(bounceFactor);
  circle.setBoundsX(xbounds);
  circle.setBoundsY(ybounds);
  circle.getSVG().setAttribute('fill-opacity', 0.4);
  this.canvas_.appendChild(circle.getSVG());
  this.bouncingDots_.push(circle);
};

BouncingBallsBackground.prototype.generateRandomBouncingDot = function() {
  // Generates random coordinates, radii, animation time, and selects a
  // random color.
  if (Math.random() > 0.5) {
    var x = -50;
  } else {
    var x = this.width_ + 50;
  }
  var y = Math.floor(Math.random() *
      (this.height_ - BouncingBallsBackground.MIN_Y) -
      BouncingBallsBackground.MIN_Y);
  var vx = Math.floor(Math.random() *
      (BouncingBallsBackground.MAX_VX -
      BouncingBallsBackground.MIN_VX) +
      BouncingBallsBackground.MIN_VX);
  var vy = Math.floor(Math.random() *
      (BouncingBallsBackground.MAX_VY -
      BouncingBallsBackground.MIN_VY) +
      BouncingBallsBackground.MIN_VY);
  var ax = BouncingBallsBackground.AX;
  var ay = Math.floor(Math.random() *
      (BouncingBallsBackground.MAX_AY -
      BouncingBallsBackground.MIN_AY) +
      BouncingBallsBackground.MIN_AY);
  var radius = Math.floor(Math.random() *
      (BouncingBallsBackground.MAX_RADIUS -
      BouncingBallsBackground.MIN_RADIUS)) +
      BouncingBallsBackground.MIN_RADIUS;
  var bounceFactor = 1;
  var fill = BouncingBallsBackground.DOT_COLORS[Math.floor(Math.random() *
      BouncingBallsBackground.DOT_COLORS.length)];
  var xbounds = [-150, this.width_ + 150];
  var ybounds = [0, this.height_ - radius];
  if (x != -50) {
    vx *= -1;
  }
  // Creates the dot with the generated specifications.
  this.createBouncingDot(x, y, vx, vy, ax, ay,
                         radius, bounceFactor, fill, xbounds, ybounds);
};

BouncingBallsBackground.prototype.updateBouncingDots = function() {
  for (var i = 0; i < this.bouncingDots_.length; ++i) {
    this.bouncingDots_[i].updateWithPhysics();
    if (this.bouncingDots_[i].getX() < -100 ||
        this.bouncingDots_[i].getX() > this.width_ + 100) {
      if (isChildOf(this.canvas_, this.bouncingDots_[i].getSVG())) {
        this.canvas_.removeChild(this.bouncingDots_[i].getSVG());
        this.bouncingDots_.splice(i, 1);
      }
    }
  }
};

BouncingBallsBackground.prototype.setCanvasSize = function() {
  // Measure the width and height of the body element.
  this.width_ = document.body.offsetWidth;
  this.height_ = document.body.offsetHeight;

  // Set the width and height of the SVG canvas to the width and height
  // of the body (basically the entire page).
  this.canvas_.setAttribute('width', this.width_.toString()+'px');
  this.canvas_.setAttribute('height', this.height_.toString()+'px');
};

BouncingBallsBackground.prototype.buildBouncingBallsBackgroundAnimation = function() {
  // Create the canvas.
  this.canvas_ = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  this.canvas_.setAttribute('id', 'background');
  this.canvas_.style.position = 'absolute';
  this.canvas_.style.top = 0;
  this.canvas_.style.right = 0;
  this.canvas_.style.bottom = 0;
  this.canvas_.style.left = 0;
  this.canvas_.style.zIndex = -100;
  document.body.zIndex = -101;
  document.body.appendChild(this.canvas_);
  this.setCanvasSize();

  // Generate dots every 100ms. They should be constantly updated.
  setInterval(bind(this, this.generateRandomBouncingDot), 500);
  setInterval(bind(this, this.updateBouncingDots), 1);

  // Refresh the size of the canvas every second in case the user resizes.
  setInterval(bind(this, this.setCanvasSize), 1000);
};
