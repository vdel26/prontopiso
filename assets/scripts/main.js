var swiper = new Swiper('.swiper-container', {
  slidesPerView: 1,
  centeredSlides: true,
  freeMode: true,
  // freeModeSticky: true,
  mousewheel: {
    enbled: true,
    invert: true,
    forceToAxis: true,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
});
