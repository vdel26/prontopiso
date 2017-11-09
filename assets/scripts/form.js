var forms = document.querySelectorAll('form')
  , header = document.querySelector('header')
  , fieldsets = document.querySelectorAll('fieldset')
  , inputs = document.querySelectorAll('input')
  , progressBar = document.querySelector('progress')
  , currentFieldsNo = document.querySelector('#form-current-fields')
  , mediaQueryList = window.matchMedia('screen and (min-width: 30em)')
  , verticalOffset, response = {};

// scroller
var autoscrolling = false
var scroller = new SmoothScroll('*', {
  header: 'header',
  speed: 600,
  offset: 100, // CHANGE: value should depend on screen height
  after: function (target) {
    // wait 50ms for scrolling to settle
    setTimeout(function () {
      if (autoscrolling) autoscrolling = false
      focusFirstElement(target)
    }, 50)
  }
})

// global state
var questions = {
  current: 0,
  total: fieldsets.length,
  // errors: [],

  initialize: function (scroll) {
    console.log('initialize')
    fieldsets[this.current].classList.remove('o-30')
    focusFirstElement(fieldsets[this.current])
    if (scroll) questions.autoscroll(100) // CHANGE: value should depend on screen height
  },
  autoscroll: function (next) {
    autoscrolling = true
    scroller.animateScroll(fieldsets[this.current])
  },
  setActive: function (next, scroll) {
    console.log('setActive', this.current)
    if (next < 0 || next > this.total) return
    fieldsets[this.current].classList.add('o-30')
    fieldsets[next].classList.remove('o-30')
    this.current = next
    if (scroll) questions.autoscroll(fieldsets[this.current])
  },
  goForward: function (scroll) {
    console.log('goForward')
    if (this.current === this.total) return
    fieldsets[this.current].classList.add('o-30')
    fieldsets[++this.current].classList.remove('o-30')
    if (scroll) questions.autoscroll(fieldsets[this.current])
  },
  goBack: function (scroll) {
    console.log('goBack')
    if (this.current === 0) return
    fieldsets[this.current].classList.add('o-30')
    fieldsets[--this.current].classList.remove('o-30')
    if (scroll) questions.autoscroll(fieldsets[this.current])
  }
}

// returns a function that will call *func* every *wait* miliseconds at most
function throttle (func, wait) {
  var context, args, timeout, result
  var previous = 0
  var later = function () {
    previous = new Date()
    timeout = null
    result = func.apply(context, args)
  }
  return function () {
    var now = new Date()
    var remaining = wait - (now - previous)
    context = this
    args = arguments
    if (remaining <= 0) {
      clearTimeout(timeout)
      timeout = null
      previous = now
      result = func.apply(context, args)
    } else if (!timeout) {
      timeout = setTimeout(later, remaining)
    }
    return result
  }
}

// find index of a fieldset
function getFieldsetIndex (fieldset) {
  return Array.from(fieldsets).findIndex(function (el) {
    return el === fieldset
  })
}

// focus on the first input of a fieldset
function focusFirstElement (fieldset) {
  fieldset.querySelectorAll('input')[0].focus()
}

// set as active the fieldset that's closest to 1/3 of the window height
function setOpacityCenteredElement () {
  // skip if movement didnt start from a scroll event
  if (autoscrolling) return
  var elem = document.elementFromPoint(window.innerWidth / 2, (window.innerHeight / 2) - 100) // CHANGE: value should depend on screen height
  if (elem.nodeName === 'FIELDSET') {
    var idx = getFieldsetIndex(elem)
    questions.setActive(idx)
  }
}

// check if fieldset is ready to go to next one. Ready means *one of these two*
// conditions is met:
//   Case 1. Button is clicked (for fieldsets that have at least one text / date / number input)
//   Case 2. Choice is clicked (for fieldsets that just have radio inputs)
function fieldsetReady (fieldset) {
  console.log('attaching events to fieldset')
  var button = fieldset.querySelector('.js-next')

  // case 1
  if (button) {
    button.addEventListener('click', function () {
      // TODO: call validations
      questions.goForward(true)
    })
  }

  // case 2
  else {
    var radios = fieldset.querySelectorAll('input[type=radio]')
    Array.from(radios).forEach(function (r) {
      r.addEventListener('change', function () {
        questions.goForward(true)
      })
    })
  }
}

/* validations */
// strategy:
//  - validate multi inputs when button is clicked
//  -
// validate date
// validate multi
// validate radio


////// entry point //////

// set address-zipCode if in URL
var zipCodeInUrl = window.location.search.split('=')[1]
var zipCodeInput = document.getElementById('address-zipCode')
if (zipCodeInUrl) zipCodeInput.value = zipCodeInUrl

// form Progress bar
stickybits('#form-progress', {
  useStickyClasses: true,
  noStyles: true,
})

questions.initialize()
document.addEventListener('scroll', throttle(setOpacityCenteredElement, 50), false)


// attach events for moving forward between fieldsets
for (i = 0; i < fieldsets.length; i++) {
  fieldsetReady(fieldsets[i])
}

////////////////////////////////////////////////////////////////////////////////



// // Set mediaQueryList for different breakpoints
// function handleMediaQueries(mql) {
//   console.log(mql);
//   if (mql.matches) verticalOffset = window.innerHeight / 3; // Desktop
//   else verticalOffset = window.innerHeight / 5; // Mobile
// } handleMediaQueries(mediaQueryList);
// mediaQueryList.addListener(handleMediaQueries);



// // Set address-zipCode if in URL
// var zipCodeInUrl = window.location.search.split('=')[1]
//   , zipCodeInput = document.getElementById('address-zipCode');
// if (zipCodeInUrl) zipCodeInput.value = zipCodeInUrl;
//
//
//
// // Attach setOpacityCenteredElement to wheel event
// document.addEventListener('scroll', setOpacityCenteredElement, supportsPassive ? { passive: true } : false);
//
//
//
// // Form Progress
// stickybits('#form-progress', {
//   useStickyClasses: true,
//   noStyles: true,
// });
//
//
//




// Set and init Google Autocomplete for address
var google_address
  , componentForm = {
      street_number: 'short_name',
      route: 'long_name',
      locality: 'long_name',
      administrative_area_level_2: 'long_name',
      country: 'long_name',
      postal_code: 'short_name'
    }
  , prontopiso_address_model = {
      postal_code: 'zipCode',
      street_number: 'streetNumber',
      route: 'street',
      locality: 'city',
      administrative_area_level_2: 'province',
      country: 'country'
    };

function initAutocomplete() {
  var addyInput = document.getElementById('address-street');
  // Create the google_address object
  google_address = new google.maps.places.Autocomplete(
    /** @type {!HTMLInputElement} */
    addyInput, {
      types: ['geocode'],
      componentRestrictions: { country: 'es' }
    }
  );
  var event = new Event('build');
  // When the user selects an address from the dropdown, populate the address fields in the form.
  google_address.addListener('place_changed', fillInAddress);
  // Prevent ENTER from submitting the form
  google.maps.event.addDomListener(addyInput, 'keydown', function(e) {
    if (e.keyCode === 13) e.preventDefault();
  });
}

function fillInAddress() {
  // Get the place details from the google_address object.
  var place = google_address.getPlace()
    , prontopiso_address = {};
  // Get each component of the address from the place details and fill the corresponding field on the form.
  for (var i = 0; i < place.address_components.length; i++) {
    var addressType = place.address_components[i].types[0];
    if (componentForm[addressType]) {
      var val = place.address_components[i][componentForm[addressType]];
      prontopiso_address[prontopiso_address_model[addressType]] = val;
    }
  }
  response.address = prontopiso_address;
}
//
//
//
//
// /* Form Validation */
//
// // Add the novalidate attribute when the JS loads
// for (var i = 0; i < forms.length; i++) {
//   // Disable HTML validation if JavaScript is running
//   forms[i].setAttribute('novalidate', true);
//   // Before submitting the form…
//   forms[i].addEventListener('submit', function(e) {
//     e.preventDefault();
//
//     var completeFieldsets = completedFieldsets();
//     // Prevent submitting the form if it hasn't been filled
//     if (completeFieldsets >= (fieldsets.length - 1)) {
//       var submitResponse = sendResponseObject(response);
//     } else {
//       // Validate
//       for (var i = 0; i < inputs.length; i++) {
//         var id = inputs[i].id, name = inputs[i].name
//           , value = inputs[i].value, validity = inputs[i].validity
//           , error = document.querySelector('#' + name + '-error');
//
//         if (id === 'address-street') {
//           if (response.address && response.address.streetNumber) error.classList.remove('db');
//           else error.classList.add('db');
//         } else if (value && validity.valid && error) {
//           error.classList.remove('db');
//         } else if (error) error.classList.add('db');
//       }
//
//       // Scroll to first fieldset not completed
//       var firstIncompleteFieldset = document.querySelector('fieldset.incomplete')
//         , scroll = new SmoothScroll()
//         , anchor = firstIncompleteFieldset ? firstIncompleteFieldset : document.querySelector('fieldset')
//         , toggle = document.getElementById('submit');
//       if (anchor) {
//         resetFieldsetsOpacity(anchor);
//         scroll.animateScroll(anchor, toggle, {
//           offset: verticalOffset,
//         });
//       }
//     }
//   }, false);
// }
//
//
//
// // Set today as max value for date input
// var now = new Date()
//   , maxDate = now.toISOString().substring(0,10)
//   , dateInput = document.getElementById('buyDate');
// dateInput.setAttribute('max', maxDate);
//
//
//
// // Attach blur event to inputs
// for (i = 0; i < inputs.length; ++i) {
//   inputs[i].addEventListener('blur', inputOnInputBlur, true);
//   inputs[i].addEventListener('blur', fieldsetOnInputBlur, true);
//   inputs[i].addEventListener('change', fieldsetOnInputBlur, true);
//   if (inputs[i].type === 'radio') {
//     inputs[i].addEventListener('change', function() {
//       if (this && this.validity.valid) {
//         var error = document.querySelector('#' + this.name + '-error');
//         error.classList.remove('db');
//       }
//     }, true);
//   }
// }

// // Attach blur event to fieldsets
// for (i = 0; i < fieldsets.length; ++i) {
//   fieldsets[i].addEventListener('click', fieldsetOnClick);
// }
//
//
//
// // Show/hide conditional inputs
// toggleConditionalInputs('[name="typeBuilding"]', '#address-floor, #address-block, #address-stair, #address-door', 'typeBuilding-2');
// toggleConditionalInputs('[name="features-parking"]', '#features-parkingPlaces', 'features-parking-false');
// toggleConditionalInputs('[name="features-terrace"]', '#features-terraceArea', 'features-terrace-false');
//
//
//
//
// /* Helpers */
//
// // Get base API url
// function getBaseApiUrl() {
//   if (location.hostname === 'staging-www.prontopiso.com' || location.hostname === 'localhost') {
//     return 'https://staging.prontopiso.com';
//   } else {
//     return 'https://api.prontopiso.com';
//   }
// }
//
//
// // Send response object to API
// function sendResponseObject(response) {
//   var request = new XMLHttpRequest()
//     , url = getBaseApiUrl() + '/api/building_surveys'
//     , data = JSON.stringify(response)
//     , form_element = document.getElementById('main-form')
//     , submitButton = document.getElementById('submit');
//
//   // Call a function when the state changes
//   request.onreadystatechange = function() {
//     // Disable submit button while waiting on request.status
//     submitButton.disabled = true;
//     if (request.readyState === 4 && request.status === 201) {
//       resetForm(form_element);
//       submitButton.disabled = false;
//       document.getElementById('form-buttons').classList.add('dn');
//       document.getElementById('form-thanks-message').classList.remove('dn');
//     } else if (request.readyState === 4 && request.status === 400) {
//       submitButton.disabled = false;
//       var error = JSON.parse(request.responseText);
//       console.error(error.detail)
//     } else {
//       console.info('Waiting...');
//     }
//   }
//
//   request.open('POST', url, true);
//   request.setRequestHeader('Content-type', 'application/json');
//   request.send(data);
// }
//
//
// // Reset form and response object
// function resetForm(form) {
//   form.reset();
//   response = {};
// }
//
//
// // Show/hide conditional inputs
// function toggleConditionalInputs(toggle, disable, condition) {
//   var toggleInput = document.querySelectorAll(toggle)
//     , inputsToDisable = document.querySelectorAll(disable);
//   for (i = 0; i < toggleInput.length; ++i) {
//     toggleInput[i].addEventListener('change', function(e) {
//       if (this.id === condition) {
//         for (i = 0; i < inputsToDisable.length; ++i) {
//           var inputPlaceholder = inputsToDisable[i].getAttribute('data-placeholder');
//           inputsToDisable[i].classList.add('o-50');
//           inputsToDisable[i].placeholder = 'Desactivado';
//           inputsToDisable[i].disabled = true;
//           if (!inputPlaceholder.includes('Opcional'))
//             inputsToDisable[i].required = false;
//         }
//       } else {
//         for (i = 0; i < inputsToDisable.length; ++i) {
//           var inputPlaceholder = inputsToDisable[i].getAttribute('data-placeholder');
//           inputsToDisable[i].classList.remove('o-50');
//           inputsToDisable[i].placeholder = inputPlaceholder;
//           inputsToDisable[i].disabled = false;
//           if (!inputPlaceholder.includes('Opcional'))
//             inputsToDisable[i].required = true;
//         }
//       }
//     });
//   }
// }
//
//
// // Validate input on blur
// function inputOnInputBlur(e) {
//
//   var validity = this.validity
//     , value = this.value, type = this.type, name = this.name, id = this.id
//     , error = document.querySelector('#' + name + '-error');
//
//   // Save values in response object
//   if (value && name !== 'cancel' && name !== 'submit') {
//     var responseAddy = name.split('-');
//     // Make sure the value is the right type
//     if (value === 'true') value = true;
//     else if (value === 'false') value = false;
//     else if (type === 'radio' || type === 'number') value = parseInt(value, 10);
//     else if (type === 'date') value = value + 'T00:00:00+00:00';
//     // Save the value where it belongs to
//     if (responseAddy.length === 1) {
//       response[responseAddy] = value;
//     } else {
//       if (!response[responseAddy[0]]) response[responseAddy[0]] = {};
//       response[responseAddy[0]][responseAddy[1]] = value;
//     }
//   }
//
//   if (id === 'address-street' && response.address && response.address.streetNumber) error.classList.remove('db');
//   else if (value && validity.valid && error) error.classList.remove('db');
// }
//
// // Validate input on blur
// function fieldsetOnInputBlur(e) {
//
//   var validity = this.validity
//     , value = this.value, type = this.type, name = this.name, id = this.id
//     , error = document.querySelector('#' + name + '-error');
//
//   // Check if all inputs inside the parent fieldset is valid
//   var parentFieldset = closest(this, 'fieldset', 'form')
//     , siblingInputs = parentFieldset.querySelectorAll('input')
//     , validInputsBool = true
//     , completeFieldsets = 0;
//
//   for (i = 0; i < siblingInputs.length; ++i) {
//     if (siblingInputs[i].id === 'address-street' && (!response.address || !response.address.streetNumber)) {
//       validInputsBool = false;
//     } else if (!siblingInputs[i].validity.valid) {
//       validInputsBool = false;
//     }
//   }
//
//   // Toggle fieldsets classes
//   if (validInputsBool) {
//     parentFieldset.classList.add('complete');
//     parentFieldset.classList.remove('incomplete');
//   } else {
//     parentFieldset.classList.add('incomplete');
//     parentFieldset.classList.remove('complete');
//   }
//
//   // Scroll to next fieldset if current one is complete
//   // var scroll = new SmoothScroll();
//   if (parentFieldset.classList.contains('complete')) {
//     var anchor = parentFieldset.nextElementSibling
//       , toggle = undefined;
//     questions.goForward()
//     // scroll.animateScroll(anchor, toggle, {
//     //   offset: verticalOffset,
//     // });
//     console.log('scroll next')
//     // setOpacityCenteredElement();
//     // Focus first input of centered fieldset
//     var firstInputInside = anchor.querySelector('input');
//     firstInputInside.focus();
//   }
//
//   // Count how many fieldsets are valid
//   completeFieldsets = completedFieldsets();
//
//   // Set progress bar to completed number
//   progressBar.value = completeFieldsets;
//   currentFieldsNo.innerHTML = completeFieldsets;
// }
//
//
// // Scroll to fieldset on click
// function fieldsetOnClick() {
//   if (this.style.opacity == 1) {
//     return;
//   } else {
//     resetFieldsetsOpacity(this);
//     var scroll = new SmoothScroll()
//       , anchor = this
//       , toggle = undefined;
//     scroll.animateScroll(anchor, toggle, {
//       offset: verticalOffset,
//     });
//     return;
//   }
// }
//
// function resetFieldsetsOpacity(elem) {
//   for (i = 0; i < fieldsets.length; ++i) {
//     fieldsets[i].style.opacity = '';
//   } elem.style.opacity = 1;
// }
//
//
// // Count how many fieldsets are valid
// function completedFieldsets() {
//   var completeFieldsets = 0;
//   for (i = 0; i < fieldsets.length; ++i) {
//     if (fieldsets[i].classList.contains('complete') && fieldsets[i].classList.contains('mb30-ns'))
//       ++completeFieldsets;
//   } return completeFieldsets;
// }
//
//
// // Set opacity for element in center of window
// function setOpacityCenteredElement() {
//   // Get closest element to window center
//   var elem = document.elementFromPoint( window.innerWidth / 2, verticalOffset );
//   if( elem.nodeName == 'FIELDSET' ) {
//     // Reset all fieldsets opacity and set only for current one
//     resetFieldsetsOpacity(elem);
//     // Don't // Focus first input of centered fieldset // to prevent the browser from auto-scrolling to it
//     // var firstInputInside = elem.querySelector('input');
//     // firstInputInside.focus();
//   }
// }
//
//
// // Get closest parent to element that matches selector
// function closest(el, selector, stopSelector) {
//   var retval = null;
//   while (el) {
//     if (el.matches(selector)) {
//       retval = el;
//       break
//     } else if (stopSelector && el.matches(stopSelector)) {
//       break
//     }
//     el = el.parentElement;
//   }
//   return retval;
// }
