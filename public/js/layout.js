/**
 * @fileoverview Client side script for layout.pug
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

$(document).ready(function() {
  $('.button-collapse').sideNav();
  $('.modal').modal({
    dismissible: false
  });
  $('.parallax').parallax();
  $('.scrollspy').scrollSpy();

  $('#contact-message').val('');
  $('#contact-message').trigger('autoresize');
  $('#contact-modal form').submit(function(event) {
    event.preventDefault();
    $('#contact-modal button').addClass('disabled');
    $('#contact-modal input, #contact-message').attr('disabled', true);
    $.post('/message', {
      'name': $('#contact-name').val(),
      'email': $('#contact-email').val(),
      'message': $('#contact-message').val()
    }, function(result) {
      if (result['error']) {
        Materialize.toast(result['error'], 4000);
      } else {
        Materialize.toast('Message sent!', 4000);
      }
      $('#contact-modal').modal('close');
      $('#contact-modal button').removeClass('disabled');
      $('#contact-modal input, #contact-message').attr('disabled', false);
      $('#contact-modal input, #contact-message').val('');
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
