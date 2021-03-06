/* General */

// Passive Events Util
var supportsPassive = false;
try {
  var opts = Object.defineProperty({}, 'passive', {
    get: function() { supportsPassive = true; }
  });
  window.addEventListener('test', null, opts);
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
