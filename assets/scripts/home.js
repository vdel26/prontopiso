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

// How-It-Works Swiper
var swiper = new Swiper('.swiper-container', {
  slidesPerView: 'auto',
  centeredSlides: true,
  freeMode: false,
  initialSlide: 2,
  mousewheel: false,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  allowTouchMove: false,
  breakpoints: {
    480: {
      initialSlide: 0,
      slidesPerView: 1,
      freeMode: false,
      centeredSlides: true
    },
    800: {
      initialSlide: 0,
      freeMode: true,
      centeredSlides: true
    },
    2500: {
      initialSlide: 0,
      centeredSlides: false,
      freeMode: true,
      mousewheel: {
        enbled: true,
        invert: true,
        forceToAxis: true,
      },
      allowTouchMove: true
    }
  }
});
