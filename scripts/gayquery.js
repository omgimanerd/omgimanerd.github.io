function scroll_to(div) {
  scrolling = true;
  $('html, body').animate({
    scrollTop: div.offset().top
  }, 1000);
}

$('a[href^="#"]').on('click', function(event) {
  var target = $(this).attr('href');
  event.preventDefault();
  scroll_to($(target));
  currentPage = target.substr(0, -1);
});
