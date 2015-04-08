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
    }, 0);
  });
}

$('a[href^="#"]').click(function(event) {
  var target = $(this).attr('href');
  event.preventDefault();
  scroll_to($(target));
  currentPage = parseInt(target.charAt(target.length - 1));
});

$("html, body").bind({'mousewheel DOMMouseScroll onmousewheel touchmove scroll':
  function(e) {
    if (e.target.id == 'el') {
      return;
    }
    e.preventDefault();
    e.stopPropagation();

    //Determine Direction
    if (e.originalEvent.wheelDelta && e.originalEvent.wheelDelta >= 0) {
      console.log('upped ' + currentPage);
      currentPage = Math.max(currentPage - 1, 0);
      scroll_to($('#anchor' + currentPage.toString()));

    } else if (e.originalEvent.detail && e.originalEvent.detail <= 0) {
      console.log('upped ' + currentPage);
      currentPage = Math.max(currentPage - 1, 0);
      scroll_to($('#anchor' + currentPage.toString()));

    } else {
      console.log('downed ' + currentPage);
      currentPage = Math.min(currentPage + 1, MAX_PAGE);
      scroll_to($('#anchor' + currentPage.toString()));
    }
  }
});

/*
$(window).scroll(function() {
  if (!isAutoScrolling) {
    var currentScrollTop = $(this).scrollTop();
    if (currentScrollTop > lastScrollTop) {
    } else {
    }
    lastScrollTop = currentScrollTop;
  }
});
*/
