/**
 * @fileoverview Client side script.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

$(document).ready(function() {
  $('.parallax').parallax();
  $('.modal-trigger').leanModal();
  $('.scrollspy').scrollSpy();

  $('#message').val('');
  $('#message').trigger('autoresize');
  $('#contact-modal form').submit(function(event) {
    event.preventDefault();
    $('#contact-modal button').addClass('disabled');
    $('#contact-modal input').attr('disabled', true);
    $.post('/message', {
      'name': $('#contact-name').val(),
      'email': $('#contact-email').val(),
      'message': $('#contact-email').val()
    }, function(result) {
      $('#contact-modal form').removeClass('disabled');
      $('#contact-modal input').val('');
      $('#contact-modal input').attr('disabled', false);
      $('#contact-modal').closeModal();
      if (result['error']) {
        Materialize.toast('There was an error! Try again later', 4000);
      } else {
        Materialize.toast('Message sent!', 4000);
      }
    });
  });

  Materialize.scrollFire([
    {
      'selector': '#skills',
      'offset': 350,
      'callback': function() {
        Materialize.showStaggeredList('#skills ul');
      }
    }
  ]);
});
