/**
 * This initializes the animations and necessary JavaScript objects.
 * @author Alvin Lin (alvin.lin@stuypulse.com)
 */

window.oncontextmenu = function() {
  return false;
}

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
    if (charCounter >= string.length) {
      clearInterval(interval);
    }
    $('#name').text(string.substr(0, charCounter) +
                 generateRandomAlphaNum(string.length - charCounter));
    ++i;
    if (i > 10 && i % 3 == 0) {
      charCounter++;
    }
  }, 50);
  setTimeout(function() {
    cursorAnimator.setEventHandlers();
  }, 2500);

  // JQuery code to bind click and animations to HTML DOM elements.
  $('.portfolio-link').click(function() {
    $('.portfolio').animate({
      top: '0'
    }, 1000);
  });

  $('.portfolio-container').simplebar({
    autoHide: false
  });

  $('.skills-link').click(function() {
    $('.skills').animate({
      top: '0'
    }, 1000);
  });

  $('.skills-container').simplebar({
    autoHide: false
  });

  $('.contact-link').click(function() {
    $('.contact').animate({
      top: '0'
    }, 1000);
  });

  $('contact-container').simplebar({
    autoHide: false
  });

  $('.close').click(function() {
    $('.overlay').animate({
      top: '-100%'
    }, 1000);
  });
});
