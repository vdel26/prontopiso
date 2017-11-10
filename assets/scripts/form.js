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
      if (target.nodeName) focusFirstElement(target)
    }, 50)
  }
})

// global state
var questions = {
  current: 0,
  total: fieldsets.length,

  initialize: function (scroll) {
    console.log('initialize')
    if (isZipFilled()) {
      var emailFieldset = fieldsets[0]
      saveFieldset(emailFieldset)
      validateFieldset(emailFieldset)
      this.setActive(1, true)
    }
    else {
      fieldsets[this.current].classList.remove('o-30')
      focusFirstElement(fieldsets[this.current])
      if (scroll) {
        autoscrolling = true
        scroller.animateScroll(60) // CHANGE: value should depend on screen height
      }
    }
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

function markFieldsetAsComplete (fieldset) {
  fieldset.classList.add('complete')
  fieldset.classList.remove('incomplete')
  updateProgressBar()
}

function markFieldsetAsIncomplete (fieldset) {
  fieldset.classList.add('incomplete')
  fieldset.classList.remove('complete')
  updateProgressBar()
}

function validateAndSaveEmailFieldset () {
  var email = document.querySelector('#email-fieldset')
  saveFieldset(email)
  validateFieldset(email)
}

// set as active the fieldset that's closest to 1/3 of the window height
function setOpacityCenteredElement () {
  // skip if movement didnt start from a scroll event
  if (autoscrolling) return
  var elem = document.elementFromPoint(window.innerWidth / 2, (window.innerHeight / 2) - 100) // CHANGE: value should depend on screen height
  if (elem.nodeName === 'FIELDSET') {
    var idx = getFieldsetIndex(elem)
    questions.setActive(idx)
    updateProgressBar()
  }
}

function updateProgressBar () {
  console.log('updateProgressBar')
  // Count how many fieldsets are valid
  var completeFieldsets = completedFieldsets()

  // Set progress bar to completed number
  progressBar.value = completeFieldsets
  currentFieldsNo.innerHTML = completeFieldsets
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
      // always save inputs, they will be overwritten by the user later
      // in case they are not valid
      saveFieldset(fieldset)
      validateFieldset(fieldset)
      questions.goForward(true)
    })
  }

  // case 2
  else {
    var radios = fieldset.querySelectorAll('input[type=radio]')
    Array.from(radios).forEach(function (r) {
      r.addEventListener('change', function () {
        if (this && this.validity.valid) {
          saveInputValue(this)
          markFieldsetAsComplete(fieldset)
          var error = document.querySelector('#' + this.name + '-error')
          error.classList.remove('db')
          questions.goForward(true)
        }
      })
    })
  }
}

/* google autocomplete code */

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

/* end google autocomplete code */

/* tooltips */

// Tippy Tooltips
tippy.Defaults.zIndex = 1;
tippy.Defaults.position = 'top';
tippy.Defaults.offset = '0, 12';
tippy.Defaults.trigger = 'click';
tippy.Defaults.hideOnClick = true;
tippy.Defaults.popperOptions = {
  modifiers: { flip: { enabled: false } }
};

const tipFeaturesArea = tippy('#anchor-features-area', {
  html: document.querySelector('#tooltip-features-area'),
  appendTo: document.querySelector('#tooltip-features-area').parentNode,
})  , elFeaturesArea = document.querySelector('#anchor-features-area')
    , popperFeaturesArea = tipFeaturesArea.getPopperElement(elFeaturesArea);

const tipFeaturesRooms = tippy('#anchor-features-rooms', {
  html: document.querySelector('#tooltip-features-rooms'),
  appendTo: document.querySelector('#tooltip-features-rooms').parentNode,
})  , elFeaturesRooms = document.querySelector('#anchor-features-rooms')
    , popperFeaturesRooms = tipFeaturesRooms.getPopperElement(elFeaturesRooms);

const tipFeaturesBathrooms = tippy('#anchor-features-bathrooms', {
  html: document.querySelector('#tooltip-features-bathrooms'),
  appendTo: document.querySelector('#tooltip-features-bathrooms').parentNode,
})  , elFeaturesBathrooms = document.querySelector('#anchor-features-bathrooms')
    , popperFeaturesBathrooms = tipFeaturesBathrooms.getPopperElement(elFeaturesBathrooms);

const tipFeaturesToilets = tippy('#anchor-features-toilets', {
  html: document.querySelector('#tooltip-features-toilets'),
  appendTo: document.querySelector('#tooltip-features-toilets').parentNode,
})  , elFeaturesToilets = document.querySelector('#anchor-features-toilets')
    , popperFeaturesToilets = tipFeaturesToilets.getPopperElement(elFeaturesToilets);

/* end tooltips */

// set today as max value for date input
function setMaxDate () {
  var now = new Date()
  var maxDate = now.toISOString().substring(0,10)
  var dateInput = document.getElementById('buyDate')
  dateInput.setAttribute('max', maxDate)
}

// Count how many fieldsets are valid
function completedFieldsets() {
  var completeFieldsets = 0;
  for (i = 0; i < fieldsets.length; ++i) {
    if (fieldsets[i].classList.contains('complete') && fieldsets[i].classList.contains('mb30-ns'))
      ++completeFieldsets;
  }
  return completeFieldsets;
}


function toggleConditionalInputs(toggle, disable, condition) {
  var toggleInput = document.querySelectorAll(toggle)
    , inputsToDisable = document.querySelectorAll(disable);
  for (i = 0; i < toggleInput.length; ++i) {
    toggleInput[i].addEventListener('change', function(e) {
      if (this.id === condition) {
        for (i = 0; i < inputsToDisable.length; ++i) {
          var inputPlaceholder = inputsToDisable[i].getAttribute('data-placeholder');
          inputsToDisable[i].classList.add('o-50');
          inputsToDisable[i].placeholder = 'Desactivado';
          inputsToDisable[i].disabled = true;
          if (!inputPlaceholder.includes('Opcional'))
            inputsToDisable[i].required = false;
        }
      } else {
        for (i = 0; i < inputsToDisable.length; ++i) {
          var inputPlaceholder = inputsToDisable[i].getAttribute('data-placeholder');
          inputsToDisable[i].classList.remove('o-50');
          inputsToDisable[i].placeholder = inputPlaceholder;
          inputsToDisable[i].disabled = false;
          if (!inputPlaceholder.includes('Opcional'))
            inputsToDisable[i].required = true;
        }
      }
    });
  }
}

/* validations */
// strategy:
//  - validate multi inputs when button is clicked
//  - validate radio input on change event
//  - on form submission:
//      - validate everthing again (in case someone has scrolled instead of clicking button)
//      - hide error messages as user corrects his mistakes

function validateFieldset (fieldset) {
  var inputs = fieldset.querySelectorAll('input')
  var fieldsetValid = true
  inputs.forEach(function (el) {
    var error = document.querySelector('#' + el.name + '-error')
    if (el.id === 'address-street' && (!response.address || !response.address.streetNumber)) {
      fieldsetValid = false
      error.classList.add('db')
    }
    else if (!el.validity.valid && error) {
      fieldsetValid = false
      error.classList.add('db')
    }
    else if (el.value && el.validity.valid && error) {
      error.classList.remove('db')
    }
  })

  // Toggle fieldsets classes
  if (fieldsetValid) {
    markFieldsetAsComplete(fieldset)
  } else {
    markFieldsetAsIncomplete(fieldset)
  }
}

/* end validation */

/* building the response */
// - radio inputs invoke on change
// - rest of inputs on button click

function saveInputValue (input) {
  var value = input.value
  var type = input.type
  var name = input.name
  var error = document.querySelector('#' + name + '-error')

  // Save values in response object
  if (value && name !== 'cancel' && name !== 'submit') {
    var responseAddy = name.split('-')
    // Make sure the value is the right type
    if (value === 'true' || value === 'false') value = !!value
    else if (type === 'radio' || type === 'number') value = parseInt(value, 10)
    else if (type === 'date') value = value + 'T00:00:00+00:00'
    // Save the value where it belongs to
    if (responseAddy.length === 1) {
      response[responseAddy] = value
    }
    else {
      if (!response[responseAddy[0]]) response[responseAddy[0]] = {}
      response[responseAddy[0]][responseAddy[1]] = value
    }
  }
}

function saveFieldset (fieldset) {
  var inputs = fieldset.querySelectorAll('input')
  var fieldsetValid = true
  inputs.forEach(saveInputValue)
}

/* end building the response */

/* sending the response to the API */

// Get base API url
function getBaseApiUrl() {
  if (location.hostname === 'prontopiso.com') {
    return 'https://api.prontopiso.com'
  }
  else {
    return 'https://staging.prontopiso.com'
  }
}

// Send response object to API
function sendResponseObject (response) {
  var request = new XMLHttpRequest()
  var url = getBaseApiUrl() + '/api/building_surveys'
  var data = JSON.stringify(response)
  var form_element = document.getElementById('main-form')
  var submitButton = document.getElementById('submit')

  // Call a function when the state changes
  request.onreadystatechange = function() {
    // Disable submit button while waiting on request.status
    submitButton.disabled = true
    if (request.readyState === 4 && request.status === 201) {
      resetForm(form_element)
      submitButton.disabled = false
      document.getElementById('form-buttons').classList.add('dn')
      document.getElementById('form-thanks-message').classList.remove('dn')
    }
    else if (request.readyState === 4 && request.status === 400) {
      submitButton.disabled = false
      var error = JSON.parse(request.responseText)
      console.error(error.detail)
    }
    else {
      console.info('Waiting...')
    }
  }

  request.open('POST', url, true)
  request.setRequestHeader('Content-type', 'application/json')
  request.send(data)
}


// Reset form and response object
function resetForm (form) {
  form.reset()
  response = {}
}

// set address-zipCode if in URL
function isZipFilled () {
  var zipCodeInUrl = window.location.search.split('=')[1]
  var zipCodeInput = document.getElementById('address-zipCode')
  if (zipCodeInUrl) {
    zipCodeInput.value = zipCodeInUrl
    return true
  }
  return false
}

/* handle form submission */

function onFormSubmit (evt) {
  console.log('onFormSubmit')
  evt.preventDefault()
  validateAndSaveEmailFieldset()

  fieldsets.forEach(validateFieldset)
  // overwrite response when user sends — this will catch the case where
  // the user might have fixed errors in text input fields but not committed
  // them with the confirmation button
  fieldsets.forEach(saveFieldset)

  var completeFieldsets = completedFieldsets()
  if (completeFieldsets >= (fieldsets.length - 1)) {
    // send response to the API — TODO: handle HTTP errors
    var submitResponse = sendResponseObject(response)
  }
  else {
    // Prevent submitting the form if it hasn't been filled
    // Scroll to first fieldset not completed
    var firstIncompleteFieldset = document.querySelector('fieldset.incomplete')
    var firstIncompleteFieldsetIdx = getFieldsetIndex(firstIncompleteFieldset)
    questions.setActive(firstIncompleteFieldsetIdx, true)
  }
}

////////////////////////////// entry point //////////////////////////////


// form Progress bar
stickybits('#form-progress', {
  useStickyClasses: true,
  noStyles: true,
})

questions.initialize(true)
document.addEventListener('scroll', throttle(setOpacityCenteredElement, 50), false)
document.addEventListener('keydown', function (evt) {
  // dont submit form on enter
  if (evt.keyCode === 13) evt.preventDefault()
})

// set max date to today on date input
setMaxDate()

// attach events for moving forward between fieldsets
for (i = 0; i < fieldsets.length; i++) {
  fieldsetReady(fieldsets[i])
}

// show/hide conditional inputs
toggleConditionalInputs('[name="typeBuilding"]', '#address-floor, #address-block, #address-stair, #address-door', 'typeBuilding-2');
toggleConditionalInputs('[name="features-parking"]', '#features-parkingPlaces', 'features-parking-false');
toggleConditionalInputs('[name="features-terrace"]', '#features-terraceArea', 'features-terrace-false');

// Add the novalidate attribute when the JS loads
for (var i = 0; i < forms.length; i++) {
  // Disable HTML validation if JavaScript is running
  forms[i].setAttribute('novalidate', true);
  forms[i].addEventListener('submit', onFormSubmit, false);
}
