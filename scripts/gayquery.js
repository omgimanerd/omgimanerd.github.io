var isScrolling = false;
var lastScrollTop = $(document).scrollTop;

function scroll_to(div) {
  $('html, body').animate({
    scrollTop: div.offset().top
  }, 1000, null, function() {
    isScrolling = true;
  });
}

$('a[href^="#"]').click(function(event) {
  var target = $(this).attr('href');
  event.preventDefault();
  scroll_to($(target));
});


var lastScrollTop = $(document).scrollTop;
$(document).scroll(function() {
  if (!isScrolling) {
    if ($(document).scrollTop > lastScrollTop) {
      console.log('scrolled down');
    } else {
      console.log('scrolled up');
    }
  }
});
