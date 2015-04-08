var isScrolling = false;
var lastScrollTop = $(document).scrollTop;
var currentPage = 0;

scroll_to($("#anchor0"));

function scroll_to(div) {
  isScrolling = true;
  $('html, body').animate({
    scrollTop: div.offset().top
  }, 1000, null, function() {
    isScrolling = false;
  });
}

$('a[href^="#"]').click(function(event) {
  var target = $(this).attr('href');
  event.preventDefault();
  scroll_to($(target));
  currentPage = parseInt(target.charAt(-1));
  console.log(currentPage);
});


var lastScrollTop = $(document).scrollTop;
$(document).scroll(function() {
  if (!isScrolling) {
    if ($(document).scrollTop > lastScrollTop) {
      console.log('scrolled up');
    } else {
      console.log('scrolled down');
    }
  }
});
