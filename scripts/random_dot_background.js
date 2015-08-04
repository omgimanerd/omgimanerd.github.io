// Copyright Alvin Lin 2014
/**
 * @author Alvin Lin (alvin.lin@stuypulse.com)
 * Script for the randomly appearing dots background animation.
 * Uses setTimeout() to control dot animation.
 * To use this background template, instantiate a RandomDotBackground
 * object at the end of the body and call buildRandomDotBackgroundAnimation()
 * on the object.
 * The reason we do not use an <animate> object is because the 'dur' attribute
 * that defines the animation time counts from when the webpage is loaded, so
 * animations and circles added after the first 1500ms render at their end
 * animation state and disappear immediately.
 * This file is intended as a distributable standalone and thus does not have
 * any dependencies on my internal library.
 *
 * The constants inside this class can be modified to suit the needs of the
 * user.
 */

// bind() function allows setTimeout to work on the objects by changing the
// context from which they are run.
function bind(object, method) {
  return function() {
    return method.apply(object, arguments);
  };
}

/**
 * This first parameter is the container of the SVG canvas. The second parameter
 * is the SVG canvas itself.
 */
function RandomDotBackground(container, canvas, minRadius, maxRadius,
                             minAnimationtime, maxAnimationTime,
                             dotGenerationInterval, dotColors) {
  this.container_ = container;
  this.canvas_ = canvas;

  this.minRadius_ = minRadius ||
      RandomDotBackground.DEFAULT_MIN_RADIUS;
  this.maxRadius_ = maxRadius ||
      RandomDotBackground.DEFAULT_MAX_RADIUS;
  this.minAnimationTime_ = minAnimationtime ||
      RandomDotBackground.DEFAULT_MIN_ANIMATION_TIME;
  this.maxAnimationTime_ = maxAnimationTime ||
      RandomDotBackground.DEFAULT_MAX_ANIMATION_TIME;
  this.dotGenerationInterval_ = dotGenerationInterval ||
      RandomDotBackground.DEFAULT_DOT_GENERATION_INTERVAL;
  this.dotColors_ = dotColors ||
      RandomDotBackground.DEFAULT_DOT_COLORS;

  // Stores the location of the user's mouse for any skewing.
  this.userMouseCoords_ = null;
};

/**
 * This value represents the default maximum radius that the generated dots can
 * be.
 */
RandomDotBackground.DEFAULT_MIN_RADIUS = 25;

/**
 * This value represents the default maximum radius that the generated dots can
 * be.
 */
RandomDotBackground.DEFAULT_MAX_RADIUS = 100;

/**
 * This value represents the default minimum animation time that the generated
 * dots can have.
 */
RandomDotBackground.DEFAULT_MIN_ANIMATION_TIME = 500;

/**
 * This value represents the default maximum animation time that the generated
 * dots can have.
 */
RandomDotBackground.DEFAULT_MAX_ANIMATION_TIME = 1500;

/**
 * This value represents the default interval that the dots will generate at.
 */
RandomDotBackground.DEFAULT_DOT_GENERATION_INTERVAL = 100;

/**
 * This is an array containing all the default possible colors of the dots.
 */
RandomDotBackground.DEFAULT_DOT_COLORS = ['#C8E6C9'];

/**
 * This represents the amount that the dots will deviate from the cursor in
 * terms of a percentage of the user's screen size.
 */
RandomDotBackground.SCREEN_PERCENTAGE_DEVIATION = 0.2;

/**
 * Generates a dot at a specified coordinate that will be a specified color
 * and expand to a maximum radius from zero in a given animation time.
 */
RandomDotBackground.prototype.createDot = function(x, y,
                                                   color,
                                                   maxRadius,
                                                   animationTime) {
  var circle = document.createElementNS('http://www.w3.org/2000/svg',
                                        'circle');
  circle.setAttribute('cx', x);
  circle.setAttribute('cy', y);
  circle.setAttribute('r', 0);
  circle.setAttribute('fill', color);
  circle.setAttribute('fill-opacity', 0.4);
  this.canvas_.appendChild(circle);

  var animationSteps = Math.floor(maxRadius / 2);
  var animationStepTime = animationTime / animationSteps;
  var animationTime = 0;
  var radius = 0;
  var radiusStepIncrease = maxRadius / animationSteps;

  // Sets the animation for the dots expanding.
  for (var i = 0; i < animationSteps; ++i) {
    animationTime += animationStepTime;
    setTimeout(function() {
      circle.setAttribute('r', radius++);
    }, animationTime);
  }

  // Sets the animation for the dots contracting.
  for (var i = 0; i < animationSteps; ++i) {
    animationTime += animationStepTime;
    setTimeout(function() {
      circle.setAttribute('r', radius--);
    }, animationTime);
  }

  // Removes the dots from the canvas when the animation finishes.
  setTimeout(bind(this, function() {
    this.canvas_.removeChild(circle);
  }), animationTime);
};

/**
 * Generates a dot with randomized parameters.
 */
RandomDotBackground.prototype.generateRandomDot = function() {
  // Generates random coordinates, radii, animation time, and selects a
  // random color.
  var x, y;
  if (this.userMouseCoords_) {
    var deviation = this.width_ *
        RandomDotBackground.SCREEN_PERCENTAGE_DEVIATION;
    x = this.userMouseCoords_[0] + (Math.random() - 0.5) * deviation;
    y = this.userMouseCoords_[1] + (Math.random() - 0.5) * deviation;
  } else {
    x = Math.floor(Math.random() * this.width_);
    y = Math.floor(Math.random() * this.height_);
  }
  var color = this.dotColors_[Math.floor(Math.random() *
      this.dotColors_.length)];
  var radius = Math.floor(Math.random() *
      (this.maxRadius_ - this.minRadius_)) + this.minRadius_;
  var animationTime = Math.floor(Math.random() *
      (this.maxAnimationTime_ - this.minAnimationTime_)) +
      this.minAnimationTime_;

  // Creates the dot with the generated specifications.
  this.createDot(x, y, color, radius, animationTime);
};

/**
 * Refreshes the size of the canvas because the SVG canvas cannot be scaled
 * percentage-wise with CSS.
 * This function is meant to be called every second or so.
 */
RandomDotBackground.prototype.setCanvasSize = function() {
  // Measure the width and height of the container element.
  this.width_ = this.container_.offsetWidth;
  this.height_ = this.container_.offsetHeight;

  // Set the width and height of the SVG canvas to the width and height
  // of the container.
  this.canvas_.setAttribute('width', this.width_ + 'px');
  this.canvas_.setAttribute('height', this.height_ + 'px');
  this.canvas_.style.top = this.container_.offsetTop;
};

RandomDotBackground.prototype.onMouseMove = function(event) {
  this.userMouseCoords_ = [event.layerX, event.layerY];
};

RandomDotBackground.prototype.onMouseOut = function() {
  this.userMouseCoords_ = null;
};

RandomDotBackground.prototype.buildRandomDotBackgroundAnimation = function() {
  // Initialize the canvas.
  this.setCanvasSize();

  // Store the user's mouse coordinates.
  this.canvas_.onmousemove = bind(this, this.onMouseMove);
  this.canvas_.onmouseout = bind(this, this.onMouseOut);

  // Set the animation.
  setInterval(bind(this, this.generateRandomDot), this.dotGenerationInterval_);

  // Refresh the size of the canvas every second in case the screen resizes.
  setInterval(bind(this, this.setCanvasSize), 1000);
};
