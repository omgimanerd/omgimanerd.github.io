// Copyright Alvin Lin 2014
/**
 * @author Alvin Lin (alvin.lin@stuypulse.com)
 * Script for the tap game. Unconventional as fuck because I don't use a
 * game loop.
 */

// bind() function allows setTimeout to work on the objects.
function bind(object, method) {
  return function() {
    return method.apply(object, arguments);
  };
}

function Tap(canvas, scoreEl) {
  this.canvas_ = canvas;
  this.width_ = canvas.offsetWidth;
  this.height_ = canvas.offsetHeight;

  this.score_ = 0;
  this.scoreEl_ = scoreEl;
  this.gameLoop_ = null;
}

/**
 * Set values for the generation of the dots.
 */
Tap.X = -100;
Tap.Y = 200;
Tap.RADIUS = 40;
Tap.AMPLITUDE = 150;

/**
 * Randomized values for the generation of the dots.
 * A color is selected randomly from this array
 * and a wavelength and speed are randomly generated inside
 * this range.
 */
Tap.COLORS = [Colors.RED, Colors.BLUE, Colors.GREEN, Colors.YELLOW];
Tap.MIN_WAVELENGTH = 25;
Tap.MAX_WAVELENGTH = 100;
Tap.MIN_SPEED = 4000;
Tap.MAX_SPEED = 5000;

Tap.prototype.buildGameStart = function() {
  var backgroundHeight = this.height_ / 4;

  var red = new Rect(
      0, 0, this.width_, backgroundHeight, 'red');
  var blue = new Rect(
      0, this.height_ / 4, this.width_, backgroundHeight, 'blue');
  var green = new Rect(
      0, this.height_ / 2, this.width_, backgroundHeight, 'green');
  var yellow = new Rect(
      0, 3 * this.height_ / 4, this.width_, backgroundHeight, 'yellow');

  this.canvas_.appendChild(red.getSVG());
  this.canvas_.appendChild(blue.getSVG());
  this.canvas_.appendChild(green.getSVG());
  this.canvas_.appendChild(yellow.getSVG());
}

Tap.prototype.makeDot = function(x, y, radius,
                                 wavelength,
                                 amplitude,
                                 color,
                                 speed) {
  var dot = new Circle(x, y, radius, color);
  this.canvas_.appendChild(dot.getSVG());

  dot.getSVG().onmousedown = bind(this, function() {
    var dotColorBounds = {
      RED : [0, 100],
      BLUE : [100, 200],
      GREEN : [200, 300],
      YELLOW : [300, 400]
    };
    if ((dot.getFill() == Colors.RED &&
        dot.getXY()[1] > dotColorBounds.RED[0] &&
        dot.getXY()[1] < dotColorBounds.RED[1])
        ||
        (dot.getFill() == Colors.BLUE &&
        dot.getXY()[1] > dotColorBounds.BLUE[0] &&
        dot.getXY()[1] < dotColorBounds.BLUE[1])
        ||
        (dot.getFill() == Colors.GREEN &&
        dot.getXY()[1] > dotColorBounds.GREEN[0] &&
        dot.getXY()[1] < dotColorBounds.GREEN[1])
        ||
        (dot.getFill() == Colors.YELLOW &&
        dot.getXY()[1] > dotColorBounds.YELLOW[0] &&
        dot.getXY()[1] < dotColorBounds.YELLOW[1])) {
      this.score_++;
      this.scoreEl_.innerHTML = 'Score: ' + this.score_;
    } else {
      this.endGame();
    }
    this.canvas_.removeChild(dot.getSVG());
  });

  var animationSteps = this.width_ + radius;
  var animationStepTime = speed / animationSteps;
  var animationTime = 0;
  var x = 0;

  // Sets the animation for the dots expanding.
  for (var i = 0; i < animationSteps; ++i) {
    animationTime += animationStepTime;
    setTimeout(function() {
      dot.setXY(x++, y - (amplitude * Math.sin(x / wavelength)));
    }, animationTime);
  }

  // Removes the dots from the canvas when the animation finishes.
  setTimeout(bind(this, function() {
    this.canvas_.removeChild(dot.getSVG());
  }), animationTime);
};

Tap.prototype.makeRandomDot = function() {
  var x = Tap.X;
  var y = Tap.Y;
  var radius = Tap.RADIUS;
  var wavelength = Math.floor(Math.random() *
      (Tap.MAX_WAVELENGTH -
      Tap.MIN_WAVELENGTH)) +
      Tap.MIN_WAVELENGTH;
  var amplitude = Tap.AMPLITUDE;
  var color = Tap.COLORS[Math.floor(Math.random() *
      Tap.COLORS.length)];
  var speed = Math.floor(Math.random() *
      (Tap.MAX_SPEED - Tap.MIN_SPEED)) +
      Tap.MIN_SPEED;
  this.makeDot(x, y, radius, wavelength, amplitude, color, speed);
};

Tap.prototype.startGame = function() {
  this.score_ = 0;
  this.scoreEl_.innerHTML = 'Score: ' + 0;
  this.gameLoop_ = setInterval(bind(this, this.makeRandomDot), 750);
};

Tap.prototype.endGame = function() {
  clearInterval(this.gameLoop_);
};
