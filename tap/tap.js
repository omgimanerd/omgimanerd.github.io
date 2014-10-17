// Copyright Alvin Lin 2014
/**
 * @author Alvin Lin (alvin.lin@stuypulse.com)
 * Script for the tap game. Unconventional as fuck because I don't use a
 * game loop.
 */

function Tap(canvas, tapOverlayEl, scoreEl, highScoreEl) {
  this.canvas_ = canvas;
  this.width_ = canvas.offsetWidth;
  this.height_ = canvas.offsetHeight;
  this.overlayEl_ = tapOverlayEl;

  this.score_ = 0;
  this.scoreEl_ = scoreEl;
  this.highScoreEl_ = highScoreEl;
  this.gameLoop_ = null;
  this.lost_ = true;
}

/**
 * Constant values for the generation of the dots and their movement.
 */
Tap.X = -100;
Tap.Y = 200;
Tap.RADIUS = 40;
Tap.AMPLITUDE = 150;

/**
 * Randomized values for the generation of the dots.
 * A color is selected randomly from this array
 * and a wavelength and speed are randomly generated inside
 * these ranges.
 */
Tap.COLORS = [Colors.RED, Colors.BLUE, Colors.GREEN, Colors.YELLOW];
Tap.MIN_WAVELENGTH = 40;
Tap.MAX_WAVELENGTH = 80;
Tap.MIN_SPEED = 3500;
Tap.MAX_SPEED = 4500;

/**
 * Clears the canvas of dots.
 * @deprecated
 */
Tap.prototype.clearCanvas = function() {
  var circles = this.canvas_.getElementsByTagName('circle');
  for (var i = 0; i < circles.length; ++i) {
    this.canvas_.removeChild(circles[i]);
  }
};

Tap.prototype.buildGameStart = function() {
  // Build the background of the canvas.
  var backgroundHeight = this.height_ / 4;

  var red = new Rect(
      0, 0, this.width_,
      backgroundHeight, Colors.TAP_RED);
  var blue = new Rect(
      0, this.height_ / 4, this.width_,
      backgroundHeight, Colors.TAP_BLUE);
  var green = new Rect(
      0, this.height_ / 2, this.width_,
      backgroundHeight, Colors.TAP_GREEN);
  var yellow = new Rect(
      0, 3 * this.height_ / 4, this.width_,
      backgroundHeight, Colors.TAP_YELLOW);

  this.canvas_.appendChild(red.getSVG());
  this.canvas_.appendChild(blue.getSVG());
  this.canvas_.appendChild(green.getSVG());
  this.canvas_.appendChild(yellow.getSVG());

  // Set up the score and highscore elements.
  this.scoreEl_.innerHTML = "Score: 0";
  if (document.cookie == '') {
    var highscore = 0;
  } else {
    var highscore = parseInt(document.cookie.split('=')[1]);
  }
  this.highScoreEl_.innerHTML = "High score: " + highscore;
}

/**
 * Generates a dot with the given parameters and sets its onclick method
 * so that it will disappear when clicked. Game logic is also handled
 * in this function, if the dot reaches the end, or if it is clicked on
 * the wrong color, then the game will end (dots will stop generating).
 * @param {number} x (Canvas coordinates)
 * @param {number} y (Canvas coordinates)
 * @param {number} radius (Pixels)
 * @param {number} wavelength (Pixels)
 * @param {number} amplitude (Pixels)
 * @param {string} color
 * @param {number} speed (Milliseconds)
 */
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
      if (!this.lost_) {
        this.score_++;
        this.scoreEl_.innerHTML = 'Score: ' + this.score_;
      }
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
    setTimeout(bind(this, function() {
      dot.setXY(x++, y - (amplitude * Math.sin(x / wavelength)));
      if (this.lost_) {
        this.canvas_.removeChild(dot.getSVG());
      }
    }), animationTime);
  }

  // Removes the dots from the canvas when the animation finishes.
  setTimeout(bind(this, function() {
    if (isChildOf(this.canvas_, dot.getSVG())) {
      this.canvas_.removeChild(dot.getSVG());
      this.endGame();
    }
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
  if (Math.random() > 0.5) {
    var amplitude = Tap.AMPLITUDE;
  } else {
    var amplitude = -Tap.AMPLITUDE;
  }
  var color = Tap.COLORS[Math.floor(Math.random() *
      Tap.COLORS.length)];
  var speed = Math.floor(Math.random() *
      (Tap.MAX_SPEED - Tap.MIN_SPEED)) +
      Tap.MIN_SPEED;

  this.makeDot(x, y, radius, wavelength, amplitude, color, speed);
};

Tap.prototype.startGame = function() {
  this.score_ = 0;
  this.scoreEl_.innerHTML = 'Score: 0';
  if (this.lost_) {
    this.gameLoop_ = setInterval(bind(this, this.makeRandomDot), 1000);
  }
  this.lost_ = false;

  this.overlayEl_.style.zIndex = -1;
};

Tap.prototype.endGame = function() {
  var highscore = parseInt(document.cookie.split('=')[1]);
  if (document.cookie == '' || this.score_ > highscore) {
    document.cookie = 'tapHighScore=' + this.score_.toString();
    this.highScoreEl_.innerHTML = "High score: " + this.score_;
  }

  this.lost_ = true;
  clearInterval(this.gameLoop_);

  this.overlayEl_.style.lineHeight = '100px';
  this.overlayEl_.style.zIndex = 1;
  this.overlayEl_.innerHTML = "You lost!<br />Try again.";
};
