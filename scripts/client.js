/**
 * This initializes the animations and necessary JavaScript objects.
 */

$(document).ready(function() {
  var cursorAnimator = new CursorAnimator(
      document.getElementById('cursor-canvas'));
  cursorAnimator.initialize();

  $(function () {
    var string = "Alvin Lin";
    var dest = $('#name');
    var c = 0;
    var i = setInterval(function() {
      if (c >= string.length) {
        clearInterval(i);
        dest.text(string);
        cursorAnimator.setEventHandlers();
      } else {
        $('<span>').text(string[c]).
        appendTo(dest).hide().fadeIn(500);
        c += 1;
      }
    }, 250);
  });
});
