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
  // When the user selects an address from the dropdown, populate the address fields in the form.
  google_address.addListener('place_changed', fillInAddress);
  // Prevent ENTER from submitting the form
  google.maps.event.addDomListener(addyInput, 'keydown', function(event) {
    if (event.keyCode === 13) event.preventDefault();
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

function getBaseApiUrl() {
    if (location.hostname === 'staging-www.prontopiso.com' || location.hostname === 'localhost') {
      return 'https://staging.prontopiso.com';
    } else {
      return 'https://api.prontopiso.com';
    }
}

function sendResponseObject(response) {
  var request = new XMLHttpRequest()
    , url = getBaseApiUrl() + '/api/building_surveys'
    , data = JSON.stringify(response)
    , form_element = document.getElementById('main-form')
    , submitButton = document.getElementById('submit');

  // Call a function when the state changes
  request.onreadystatechange = function() {
    // Disable submit button while waiting on request.status
    submitButton.disabled = true;
    if (request.readyState === 4 && request.status === 201) {
      resetForm(form_element);
      submitButton.disabled = false;
      document.getElementById('form-buttons').classList.add('dn');
      document.getElementById('form-thanks-message').classList.remove('dn');
    } else if (request.readyState === 4 && request.status === 400) {
      submitButton.disabled = false;
      var error = JSON.parse(request.responseText);
      console.error(error.detail)
    } else {
      console.info('Waiting...');
    }
  }

  request.open('POST', url, true);
  request.setRequestHeader('Content-type', 'application/json');
  request.send(data);
}

function resetForm(form) {
  form.reset();
  response = {};
}


// Set address-zipCode if in URL
var zipCodeInUrl = window.location.search.split('=')[1]
  , zipCodeInput = document.getElementById('address-zipCode');
if (zipCodeInUrl) zipCodeInput.value = zipCodeInUrl;


var forms = document.querySelectorAll('form')
  , fieldsets = document.querySelectorAll('fieldset')
  , inputs = document.querySelectorAll('input')
  , progressBar = document.querySelector('progress')
  , currentFieldsNo = document.querySelector('#form-current-fields')
  , response = {};


document.addEventListener('wheel', function() {
  // Get closest element to window center
  var elem = document.elementFromPoint( window.innerWidth / 2, window.innerHeight / 2 );
  if( elem.nodeName == 'FIELDSET' ) {
    // Reset all fieldsets opacity and set only for current one
    for (i = 0; i < fieldsets.length; ++i) {
      fieldsets[i].style.opacity = '';
    } elem.style.opacity = 1;
  }
}, supportsPassive ? { passive: true } : false);



/* Form Validation */

// Set today as max value for date input
var now = new Date()
  , maxDate = now.toISOString().substring(0,10)
  , dateInput = document.getElementById('buyDate');
dateInput.setAttribute('max', maxDate);

// Add the novalidate attribute when the JS loads
for (var i = 0; i < forms.length; i++) {

  // Disable HTML validation if JavaScript is running
  forms[i].setAttribute('novalidate', true);

  // Before submitting the form…
  forms[i].addEventListener('submit', function(e) {
    e.preventDefault();
    var completeFieldsets = completedFieldsets();

    // Prevent submitting the form if it hasn't been filled
    if (completeFieldsets >= (fieldsets.length - 1)) {
      var submitResponse = sendResponseObject(response);
    } else {
      // Validate and scroll to first fieldset not completed
    }

  }, false);
}

// Attach blur event to inputs
for (i = 0; i < inputs.length; ++i) {

  inputs[i].addEventListener('blur', function(e) {

    var validity = this.validity
      , error = document.querySelector('#' + this.name + '-error');

    if (this.id === 'address-street') {
      if (response.address && response.address.streetNumber) error.classList.remove('db');
      else error.classList.add('db');
    } else if (this.value && validity.valid && error) {
      error.classList.remove('db');
    } else if (error) error.classList.add('db');

    // Save values in response object
    if (this.value && this.name !== 'cancel' && this.name !== 'submit') {
      var responseAddy = this.name.split('-')
        , value = this.value;

      // Make sure the value is the right type
      if (value === 'true') value = true;
      else if (value === 'false') value = false;
      else if (this.type === 'radio' || this.type === 'number') value = parseInt(value, 10);
      else if (this.type === 'date') value = value + 'T00:00:00+00:00';

      // Save the value where it belongs to
      if (responseAddy.length === 1) {
        response[responseAddy] = value;
      } else {
        if (!response[responseAddy[0]]) response[responseAddy[0]] = {};
        response[responseAddy[0]][responseAddy[1]] = value;
      }
    }

    // Check if all inputs inside the parent fieldset is valid
    var parentFieldset = closest(this, 'fieldset', 'form')
      , siblingInputs = parentFieldset.querySelectorAll('input')
      , validInputsBool = true
      , completeFieldsets = 0;

    for (i = 0; i < siblingInputs.length; ++i) {
      if (siblingInputs[i].id === 'address-street' && (!response.address || !response.address.streetNumber)) {
        validInputsBool = false;
      } else if (!siblingInputs[i].validity.valid) {
        validInputsBool = false;
      }
    }

    // Toggle fieldsets classes
    if (validInputsBool) {
      parentFieldset.classList.add('complete');
      parentFieldset.classList.remove('incomplete');
    } else {
      parentFieldset.classList.add('incomplete');
      parentFieldset.classList.remove('complete');
    }

    // Count how many fieldsets are valid
    completeFieldsets = completedFieldsets();

    // Set progress bar to completed number
    progressBar.value = completeFieldsets;
    currentFieldsNo.innerHTML = completeFieldsets;

  });

}



// Show/hide conditional typeBuilding inputs
toggleConditionalInputs('[name="typeBuilding"]', '#address-floor, #address-block, #address-stair, #address-door', 'typeBuilding-2');
// Show/hide conditional features-parking inputs
toggleConditionalInputs('[name="features-parking"]', '#features-parkingPlaces', 'features-parking-false');
// Show/hide conditional features-terrace inputs
toggleConditionalInputs('[name="features-terrace"]', '#features-terraceArea', 'features-terrace-false');





/* Helpers */

// Show/hide conditional inputs
function toggleConditionalInputs(toggle, disable, condition) {
  var toggleInput = document.querySelectorAll(toggle)
    , inputsToDisable = document.querySelectorAll(disable);
  for (i = 0; i < toggleInput.length; ++i) {
    toggleInput[i].addEventListener('change', function(e) {
      if (this.id === condition) {
        for (i = 0; i < inputsToDisable.length; ++i) {
          inputsToDisable[i].classList.add('o-50');
          inputsToDisable[i].disabled = true;
        }
      } else {
        for (i = 0; i < inputsToDisable.length; ++i) {
          inputsToDisable[i].classList.remove('o-50');
          inputsToDisable[i].disabled = false;
        }
      }
    });
  }
}


// Count how many fieldsets are valid
function completedFieldsets() {
  var completeFieldsets = 0;
  for (i = 0; i < fieldsets.length; ++i) {
    if (fieldsets[i].classList.contains('complete') && fieldsets[i].classList.contains('mb30-ns'))
      ++completeFieldsets;
  } return completeFieldsets;
}


// Get closest parent to element that matches selector
function closest(el, selector, stopSelector) {
  var retval = null;
  while (el) {
    if (el.matches(selector)) {
      retval = el;
      break
    } else if (stopSelector && el.matches(stopSelector)) {
      break
    }
    el = el.parentElement;
  }
  return retval;
}
