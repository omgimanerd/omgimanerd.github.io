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
  currentPage = parseInt(target.charAt(target.length - 1));
});


var lastScrollTop = $(document).scrollTop;
$(document).scroll(function() {
  console.log(isScrolling);
  if (!isScrolling) {
    if ($(document).scrollTop > lastScrollTop) {
    } else {
    }
  }
});
