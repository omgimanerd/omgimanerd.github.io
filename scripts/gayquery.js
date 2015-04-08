var isAutoScrolling = false;
var lastScrollTop = $(document).scrollTop;
var currentPage = 0;

scroll_to($("#anchor0"));

function scroll_to(div) {
  isAutoScrolling = true;
  $('html, body').animate({
    scrollTop: div.offset().top
  }, 1000, null, function() {
    setTimeout(function() {
      isAutoScrolling = false;
    }, 500);
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
    if ($(document).scrollTop > lastScrollTop) {
    } else {
    }
    lastScrollTop = $(document).scrollTop;
  }
});
