/**
 * @fileoverview Client side script for index.html
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

$(document).ready(function() {
  $('.parallax').parallax();
  $('.modal-trigger').leanModal();
  $('.scrollspy').scrollSpy();

  Materialize.scrollFire([
    {
      'selector': '#skills',
      'offset': 0,
      'callback': function() {
        Materialize.showStaggeredList('#skills ul');
      }
    }
  ]);
});
