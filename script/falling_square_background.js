// Copyright 2014 >:D
/**
 * @author Alvin Lin (alvin.lin@stuypulse.com)
 * Script for the falling squares background animation.
 * To use this background template, instantiate a FallingSquareBackground
 * object at the end of the body and call buildFallingSquareBackgroundAnimation()
 * on the object.
 */

// bind() function allows setTimeout to work on the objects.
function bind(object, method) {
  return function() {
    return method.apply(object, arguments);
  };
}

function FallingSquareBackground() {}

/**
 * This is an array containing all the possible colors of the squares.
 */
FallingSquareBackground.DOT_COLORS = ['red', 'blue', 'green', 'yellow', 'orange'];

/**
 * This value represents the minimum side length that the generated squares can be.
 */
FallingSquareBackground.MIN_SIDE_LENGTH = 50;

/**
 * This value represents the maximum side length that the generated squares can be.
 */
FallingSquareBackground.MAX_SIDE_LENGTH = 200;

/**
 * This value represents the minimum animation time that the generated squares
 * can have.
 */
FallingSquareBackground.MIN_ANIMATION_TIME = 500;

/**
 * This value represents the maximum animation time that the generated squares
 * can have.
 */
FallingSquareBackground.MAX_ANIMATION_TIME = 1500;

/**
 * Generates a square at the top of the canvas that will be a specified color
 * and side length and fall down the screen in a given animation time.
 * @param {number} x (Canvas coordinate)
 * @param {string} color (Color)
 * @param {number} maxSideLength
 * @param {number} animationTime (Milliseconds)
 * @private
 */
FallingSquareBackground.prototype.createSquare = function(x,
                                                          color,
                                                          sideLength,
                                                          animationTime) {
  var square = document.createElementNS('http://www.w3.org/2000/svg',
                                        'rect');
  square.setAttribute('x', x.toString());
  square.setAttribute('y', (0 - sideLength).toString());
  square.setAttribute('width', sideLength.toString());
  square.setAttribute('height', sideLength.toString());
  square.setAttribute('fill', color);
  square.setAttribute('fill-opacity', 0.6);
  this.canvas_.appendChild(square);

  var animationSteps = 50;
  var animationStepTime = animationTime / animationSteps;
  var animationTime = 0;
  var fallDistance = 0;
  var fallDistanceStep = (this.height_ + sideLength) / animationSteps;

  // Sets the animation for the squares falling.
  for (var i = 0; i < animationSteps; ++i) {
    animationTime += animationStepTime;
    setTimeout(function() {
      fallDistance += fallDistanceStep;
      var newY = fallDistance;
      square.setAttribute('y', newY.toString());
    }, animationTime);
  }

  // Removes the square from the canvas when the animation finishes.
  setTimeout(bind(this, function() {
    this.canvas_.removeChild(square);
  }), animationTime);
};

/**
 * Generates a square with randomized parameters.
 * @private
 */
FallingSquareBackground.prototype.generateFallingSquare = function() {
  // Generates a random x coordinate, side length, animation time, and selects a
  // random color.
  var x = Math.floor(Math.random() * this.width_);
  var color = FallingSquareBackground.DOT_COLORS[Math.floor(Math.random() *
      FallingSquareBackground.DOT_COLORS.length)];
  var sideLength = Math.floor(Math.random() *
      (FallingSquareBackground.MAX_SIDE_LENGTH -
      FallingSquareBackground.MIN_SIDE_LENGTH)) +
      FallingSquareBackground.MIN_SIDE_LENGTH;
  var animationTime = Math.floor(Math.random() *
      (FallingSquareBackground.MAX_ANIMATION_TIME -
      FallingSquareBackground.MIN_ANIMATION_TIME)) +
      FallingSquareBackground.MIN_ANIMATION_TIME;

  // Creates the square with the generated specifications.
  this.createSquare(x, color, sideLength, animationTime);
};

FallingSquareBackground.prototype.buildFallingSquareBackgroundAnimation = function() {
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
  setInterval(bind(this, this.generateFallingSquare), 200);
};
