var isAutoScrolling = false;
var lastScrollTop = $(document).scrollTop;
var currentPage = 0;
var MAX_PAGE = 2;

scroll_to($('#anchor0'));

function scroll_to(div) {
  isAutoScrolling = true;
  $('html, body').animate({
    scrollTop: div.offset().top
  }, 1000, null, function() {
    setTimeout(function() {
      isAutoScrolling = false;
    }, 1000);
  });
}

$('a[href^="#"]').click(function(event) {
  var target = $(this).attr('href');
  event.preventDefault();
  scroll_to($(target));
  currentPage = parseInt(target.charAt(target.length - 1));
});


var lastScrollTop = $(document).scrollTop;
$(document).scroll(function() {
  console.log(isAutoScrolling);
  if (!isAutoScrolling) {
    if ($(this).scrollTop() > lastScrollTop) {
      currentPage = Math.min(currentPage - 1, 0);
      scroll_to($('#anchor' + currentPage));
    } else {
      currentPage = Math.max(currentPage + 1, MAX_PAGE);
      scroll_to($('#anchor' + currentPage));
    }
    lastScrollTop = $(this).scrollTop();
  }
});
