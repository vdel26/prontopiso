var google_address;
var componentForm = {
    street_number: 'short_name',
    route: 'long_name',
    locality: 'long_name',
    administrative_area_level_2: 'long_name',
    country: 'long_name',
    postal_code: 'short_name'
};

var prontopiso_address_model = {
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
        /** @type {!HTMLInputElement} */(document.getElementById('address-street')),
        {types: ['geocode']});

    // When the user selects an address from the dropdown, populate the address
    // fields in the form.
    google_address.addListener('place_changed', fillInAddress);
}

function fillInAddress() {
    // Get the place details from the google_address object.
    var place = google_address.getPlace();
    var prontopiso_address = {};
    // Get each component of the address from the place details
    // and fill the corresponding field on the form.
    for (var i = 0; i < place.address_components.length; i++) {
        var addressType = place.address_components[i].types[0];
        if (componentForm[addressType]) {
            var val = place.address_components[i][componentForm[addressType]];
            prontopiso_address[prontopiso_address_model[addressType]] = val;
        }
    }
    console.log(prontopiso_address);
}


var fieldsets = document.querySelectorAll('fieldset');
document.addEventListener('wheel', function() {
  // Get closest element to window center
  var elem = document.elementFromPoint( window.innerWidth / 2, window.innerHeight / 2 );
  if( elem.nodeName == 'FIELDSET' ) {
    // Reset all fieldsets opacity and set only for current one
    for (i = 0; i < fieldsets.length; ++i) {
      fieldsets[i].style.opacity = '';
    } elem.style.opacity = 1;
    // Focus first input element in current fieldset
    elem.querySelectorAll('input')[0].focus();
  }
}, supportsPassive ? { passive: true } : false);
