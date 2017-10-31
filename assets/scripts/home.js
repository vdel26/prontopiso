/* Home */

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
