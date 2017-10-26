/* General */
// Passive Events Util
var supportsPassive = false;
try {
  var opts = Object.defineProperty({}, 'passive', {
    get: function() { supportsPassive = true; }
  });
  window.addEventListener("test", null, opts);
} catch (e) {}


// ScrollReveal
window.sr = ScrollReveal();
sr.reveal('.js-scroll h1, .js-scroll h2, .js-scroll p, .js-scroll img', {
  duration: 1000,
  distance: '50px',
}, 50);


// Nav On Scroll
var mainHeader = document.querySelector('#main-header')
  , bodyElement = document.querySelector('body')
  , navItemTasacion = document.querySelector('#nav-item-tasacion')
  , navItemTelefono = document.querySelector('#nav-item-telefono');

function bodyScrolledEnough() {
  if( bodyElement.getBoundingClientRect().top < -25 ) {
    mainHeader.classList.add('bg-white', 'top-0-ns', 'box-shadow');
    mainHeader.classList.remove('top-25-ns');
    navItemTasacion.classList.remove('dn-ns');
    navItemTelefono.classList.add('dn-ns');
  } else {
    mainHeader.classList.remove('bg-white', 'top-0-ns', 'box-shadow');
    mainHeader.classList.add('top-25-ns');
    navItemTasacion.classList.add('dn-ns');
    navItemTelefono.classList.remove('dn-ns');
  }
} bodyScrolledEnough();
document.addEventListener('scroll', bodyScrolledEnough, supportsPassive ? { passive: true } : false);


// Toggle Nav
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


// SmoothScroll
var scroll = new SmoothScroll('#main-header [data-scroll]');




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




/* FAQ */

var questions = document.querySelectorAll('#faq article dt')
  , answers = document.querySelectorAll('#faq article dd')
  , togglingClasses = ['max-h1000', 'mb0', 'mb30'];

for (i = 0; i < answers.length; ++i) {
  answers[i].classList.add('max-h0', 'max-h-inherit-ns', 'mb0', 'overflow-y-hidden');
  answers[i].classList.remove('mb30');
  answers[i].style.transition = 'all 0.5s ease-in-out';
  questions[i].classList.add('o-50');
  questions[i].classList.remove('blue', 'fw5');
  questions[i].addEventListener('click', function() {
    var openedQuestion = document.querySelector('#faq article dt.blue');
    openedQuestion.classList.add('o-50');
    openedQuestion.classList.remove('blue', 'fw5');
    for (i = 0; i < togglingClasses.length; ++i)
      openedQuestion.nextElementSibling.classList.toggle(togglingClasses[i]);
    this.classList.add('blue', 'fw5');
    this.classList.remove('o-50');
    for (i = 0; i < togglingClasses.length; ++i)
      this.nextElementSibling.classList.toggle(togglingClasses[i]);
  });
}

if (questions.length && answers.length) {
  questions[0].classList.add('blue', 'fw5');
  questions[0].classList.remove('o-50');
  for (i = 0; i < togglingClasses.length; ++i) {
    answers[0].classList.toggle(togglingClasses[i]);
  }
}


// Sticky Nav and SmoothScroll Nav
var faqOffset = mainHeader.offsetHeight + 130
  , scrollFaq = new SmoothScroll('a[href*="#question"]', {
    	offset: faqOffset,
    });
stickybits('#faq nav', {
  useStickyClasses: true,
  stickyBitStickyOffset: faqOffset,
});
