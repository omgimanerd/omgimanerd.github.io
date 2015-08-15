/**
 * This initializes the animations and necessary JavaScript objects.
 * @author Alvin Lin (alvin.lin@stuypulse.com)
 */

$(document).ready(function() {
  // Create and initialize a CursorAnimator
  var cursorAnimator = new CursorAnimator(
      document.getElementById('cursor-canvas'));
  cursorAnimator.initialize();

  // Name fade-in function.
  // Credit to Roy J (Stack Overflow):
  // http://jsfiddle.net/bGsa3/6/
  $(function() {
    var string = "Alvin Lin";
    var dest = $('#name');
    var charCounter = 0;
    var i = setInterval(function() {
      if (charCounter >= string.length) {
        clearInterval(i);
        dest.text(string);
        // Set the cursor animator's event handlers when the name animation
        // is done.
        cursorAnimator.setEventHandlers();
      } else {
        $('<span>').text(string[charCounter]).
        appendTo(dest).hide().fadeIn(500);
        charCounter += 1;
      }
    }, 250);
  });
});
