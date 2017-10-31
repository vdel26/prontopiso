/* FAQ */

// Toggle FAQ Mobile
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
