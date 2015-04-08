var isAutoScrolling = false;
var lastScrollTop = $(document).scrollTop();
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

$(document).scroll(function() {
  if (!isAutoScrolling) {
    if ($(this).scrollTop() > lastScrollTop) {
      currentPage = Math.min(currentPage - 1, 0);
      console.log(currentPage);
      scroll_to($('#anchor' + currentPage.toString()));
    } else {
      currentPage = Math.max(currentPage + 1, MAX_PAGE);
      console.log(currentPage);
      scroll_to($('#anchor' + currentPage.toString()));
    }
    lastScrollTop = $(this).scrollTop();
  }
});
