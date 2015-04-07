scroll_to($("anchor0"))
var lastScrollTop = $(window).scrollTop();
var NUM_PAGES = 3;
var currentPage = 0;
var scrolling = false;

function scroll_to(div) {
  scrolling = true;
  $('html, body').animate(
    {
      scrollTop: div.offset().top
    },
    1000,
    null,
    function() {
      scrolling = false;
    }
  );
}

$('a[href^="#"]').on('click', function(event) {
  var target = $(this).attr('href');
  event.preventDefault();
  scroll_to($(target));
  currentPage = target.substr(0, -1);
  console.log(currentPage);
});

$(window).scroll(function(event) {
  if (!scrolling) {
    if ($(this).scrollTop() > lastScrollTop) {
      scroll_to($("anchor" + (currentPage + 1 % 3)));
    } else {
    }
    lastScrollTop = $(this).scrollTop();
  }
});
