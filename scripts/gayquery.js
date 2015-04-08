function scroll_to(div) {
  $('html, body').animate({
    scrollTop: div.offset().top
  }, 1000, null, function() {
    console.log("finished");
  });
}

$('a[href^="#"]').click(function(event) {
  var target = $(this).attr('href');
  event.preventDefault();
  scroll_to($(target));
});

/*
var lastScrollTop = $(document).scrollTop;
$(document).scroll(function() {
  if ($(document).scrollTop > lastScrollTop) {
    console.log('scrolled down')
    */
