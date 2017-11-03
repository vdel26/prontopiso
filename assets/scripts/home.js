/* Home */

// Scroll to How-It-Works if coming from a different page
var hash = window.location.hash;
if (hash && hash === '#how-it-works') {
  var scroll = new SmoothScroll()
    , anchor = document.querySelector('#how-it-works');
  setTimeout(function() {
    scroll.animateScroll(anchor);
  }, 500);
}

var scroll = new SmoothScroll()
  , anchor = document.querySelector('#how-it-works')
  , toggle = document.getElementById('a[href="#how-it-works"]');
if (anchor) {
  scroll.animateScroll(anchor, toggle);
}

// How-It-Works Swiper
var swiper = new Swiper('.swiper-container', {
  slidesPerView: 'auto',
  centeredSlides: true,
  freeMode: true,
  mousewheel: {
    enbled: true,
    invert: true,
    forceToAxis: true,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  breakpoints: {
    480: {
      slidesPerView: 1,
      freeMode: false,
    }
  }
});
