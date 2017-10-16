var mainNav = document.querySelector('#main-nav')
  , navToggle = document.querySelector('#toggle-nav')
  , navToggles = document.querySelectorAll('#toggle-nav svg');

navToggle.addEventListener('click', function(e) {
  e.preventDefault();
  mainNav.classList.toggle('dn');
  mainNav.classList.toggle('df');
  for (i = 0; i < navToggles.length; ++i) {
    navToggles[i].classList.toggle('dn');
  }
}, false);

var scroll = new SmoothScroll('[data-scroll]');


var swiper = new Swiper('.swiper-container', {
  slidesPerView: 'auto',
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
  breakpoints: {
    480: {
      slidesPerView: 1,
    }
  }
});
