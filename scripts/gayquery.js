scroll_to($('#anchor0'));

function scroll_to(div) {
  $('html, body').animate({
    scrollTop: div.offset().top
  }, 1000);
}

$('a[href^="#"]').click(function(event) {
  var target = $(this).attr('href');
  event.preventDefault();
  scroll_to($(target));
});
