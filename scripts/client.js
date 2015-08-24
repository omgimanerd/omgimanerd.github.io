/**
 * This initializes the animations and necessary JavaScript objects.
 * @author Alvin Lin (alvin.lin@stuypulse.com)
 */

$(document).ready(function() {
  // Create and initialize a CursorAnimator
  var cursorAnimator = new CursorAnimator(
      document.getElementById('cursor-canvas'));
  cursorAnimator.initialize();

  // Name scramble display
  var string = 'Alvin Lin';
  var i = 1;
  var charCounter = 0;
  var interval = setInterval(function() {
    $('#name').text(string.substr(0, charCounter) +
                 generateRandomAlphaNum(string.length - charCounter));
    ++i;
    if (i > 10 && i % 4 == 0) {
      charCounter++;
    }
  }, 50);
  setTimeout(function() {
    cursorAnimator.setEventHandlers();
  }, 2500);
});

window.oncontextmenu = function() {
  return false;
}
