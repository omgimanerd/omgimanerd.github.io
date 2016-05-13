/**
 * @fileoverview Client side script.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

$(document).ready(function() {
  $('.parallax').parallax();
  $('.modal-trigger').leanModal();

  $('#message').val('');
  $('#message').trigger('autoresize');
  $('.send').click(function(event) {
    $('.send').addClass('disabled');
    $('#name').attr('disabled', true);
    $('#email').attr('disabled', true);
    $('#message').attr('disabled', true);
    $.post('/message', {
      name: $('#name').val(),
      email: $('#email').val(),
      message: $('#message').val()
    }, function(result) {
      $('.send').removeClass('disabled');
      $('#name').attr('disabled', false);
      $('#name').val('');
      $('#email').attr('disabled', false);
      $('#email').val('');
      $('#message').attr('disabled', false);
      $('#message').val('');
      $('.modal').closeModal();
      if (result.error) {
        Materialize.toast('There was an error! Try again later', 1000);
      } else {
        Materialize.toast('Message sent!', 1000);
      }
    });
  });
});
