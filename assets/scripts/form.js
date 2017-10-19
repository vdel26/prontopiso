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
      postal_code:'zipCode',
      street_number:'streetNumber',
      route:'street',
      locality:'city',
      administrative_area_level_2:'province',
      country:'country'
    };

function initAutocomplete() {
  // Create the google_address object
  google_address = new google.maps.places.Autocomplete(
    /** @type {!HTMLInputElement} */
    document.getElementById('address-street'), {
      types: ['geocode'],
      componentRestrictions: { country: 'es' }
    }
  );
  // When the user selects an address from the dropdown, populate the address fields in the form.
  google_address.addListener('place_changed', fillInAddress);
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

function sendResponseObject(response) {
  var request = new XMLHttpRequest()
    , url = 'https://staging.prontopiso.com/api/building_surveys'
    , data = JSON.stringify(response);

  request.open('POST', url, true);
  request.setRequestHeader('Content-type', 'application/json');
  request.send(data);
}



var forms = document.querySelectorAll('form')
  , fieldsets = document.querySelectorAll('fieldset')
  , inputs = document.querySelectorAll('input')
  , response = {};


document.addEventListener('wheel', function() {
  // Get closest element to window center
  var elem = document.elementFromPoint( window.innerWidth / 2, window.innerHeight / 2 );
  if( elem.nodeName == 'FIELDSET' ) {
    // Reset all fieldsets opacity and set only for current one
    for (i = 0; i < fieldsets.length; ++i) {
      fieldsets[i].style.opacity = '';
    } elem.style.opacity = 1;
    // DON'T DO UNLESS YOU WANT TO RESET RADIOS
    // Focus first input element in current fieldset
    // elem.querySelectorAll('input')[0].focus();
  }
}, supportsPassive ? { passive: true } : false);



/* Form Validation */

// Add the novalidate attribute when the JS loads
for (var i = 0; i < forms.length; i++) {

  // Disable HTML validation if JavaScript is running
  forms[i].setAttribute('novalidate', true);

  // Before submitting the form…
  forms[i].addEventListener('submit', function(e) {
    e.preventDefault();
    console.log( response );
    sendResponseObject(response);
  }, false);
}

// Attach blur event to inputs
for (i = 0; i < inputs.length; ++i) {

  inputs[i].addEventListener('blur', function(e) {
    var validity = this.validity
      , error = document.querySelector('#' + this.name + '-error');
    if (this.value && validity.valid && error) {
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
  });
}
