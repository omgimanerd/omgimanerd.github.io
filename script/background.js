/**
 * Script for the background animations.
 * @author Alvin Lin (alvin.lin@stuypulse.com)
 */

function bind(object, method) {
  return function() {
    return method.apply(object, arguments);
  };
}

function Background() {}

/**
 * This is an array containing all the possible colors of the dots.
 */
Background.DOT_COLORS = ['red', 'blue', 'green', 'yellow', 'orange'];

/**
 * This value represents the maximum radius that the generated dots can be.
 */
Background.MIN_RADIUS = 25;

/**
 * This value represents the maximum radius that the generated dots can be.
 */
Background.MAX_RADIUS = 100;

/**
 * This value represents the minimum animation time that the generated dots
 * can have.
 */
Background.MIN_ANIMATION_TIME = 500;

/**
 * This value represents the maximum animation time that the generated dots
 * can have.
 */
Background.MAX_ANIMATION_TIME = 1500;

Background.prototype.createDot = function(x, y,
                                          color,
                                          maxRadius, animationTime) {
  var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circle.setAttribute('cx', x.toString());
  circle.setAttribute('cy', y.toString());
  circle.setAttribute('r', '0');
  circle.setAttribute('fill', color);
  circle.setAttribute('fill-opacity', 0.6);
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

Background.prototype.generateRandomDot = function() {
  // Generates random coordinates, radii, animation times, and selects a
  // random color.
  var x = Math.floor(Math.random() * this.width_);
  var y = Math.floor(Math.random() * this.height_);
  var color = Background.DOT_COLORS[Math.floor(Math.random() *
      Background.DOT_COLORS.length)];
  var radius = Math.floor(Math.random() *
      (Background.MAX_RADIUS - Background.MIN_RADIUS)) +
      Background.MIN_RADIUS;
  var animationTime = Math.floor(Math.random() *
      (Background.MAX_ANIMATION_TIME - Background.MIN_ANIMATION_TIME)) +
      Background.MIN_ANIMATION_TIME;

  // Creates the dot with the generated specifications.
  this.createDot(x, y, color, radius, animationTime);
};

Background.prototype.buildBackgroundAnimation = function() {
  // Create the canvas.
  this.canvas_ = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  this.canvas_.setAttribute('id', 'background');
  this.canvas_.style.position = 'absolute';
  this.canvas_.style.top = 0;
  this.canvas_.style.right = 0;
  this.canvas_.style.bottom = 0;
  this.canvas_.style.left = 0;
  this.canvas_.style.zIndex = -100;
  document.body.appendChild(this.canvas_);

  // Measure the width and height of the body element.
  this.width_ = document.body.offsetWidth;
  this.height_ = document.body.offsetHeight;

  // Set the width and height of the SVG canvas to the width and height
  // of the body (basically the entire page).
  this.canvas_.setAttribute('width', this.width_.toString()+'px');
  this.canvas_.setAttribute('height', this.height_.toString()+'px');

  // Set the animation.
  setInterval(bind(this, this.generateRandomDot), 400);
};
