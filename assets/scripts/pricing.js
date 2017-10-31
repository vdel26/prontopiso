/* Pricing */

// Tippy Tooltips
tippy.Defaults.zIndex = 1;
tippy.Defaults.arrow = true;
tippy.Defaults.trigger = 'manual';
tippy.Defaults.hideOnClick = false;

const tipLeft = tippy('#input-left', {
  position: 'top-end',
  html: document.querySelector('#tooltip-left'),
  offset: '80, 25',
  popperOptions: {
    modifiers: {
      flip: {
        enabled: false
      }
    }
  }
});
const elLeft = document.querySelector('#input-left');
const popperLeft = tipLeft.getPopperElement(elLeft);

const tipRight = tippy('#input-right', {
  position: 'top-start',
  html: document.querySelector('#tooltip-right'),
  offset: '-80, 25',
  popperOptions: {
    modifiers: {
      flip: {
        enabled: false
      }
    }
  }
});
const elRight = document.querySelector('#input-right');
const popperRight = tipRight.getPopperElement(elRight);

tipLeft.show(popperLeft);
tipRight.show(popperRight);

// const breakpoint = window.matchMedia('screen and (min-width: 30em)');
// const breakpointChecker = function() {
//   if ( breakpoint.matches === false ) {
//     tipLeft.destroy(popperLeft);
//     tipRight.destroy(popperRight);
//     return;
//   } else if ( breakpoint.matches === true ) {
//     tipLeft.show(popperLeft);
//     tipRight.show(popperRight);
//     return;
//   }
// };
//
// breakpoint.addListener(breakpointChecker);
// breakpointChecker();



// Calculator
var calculatorInput = document.querySelector('#calculator-input')
  , calculatorRange = document.querySelector('#calculator-range')
  , calculatorMin = document.querySelector('#calculator-min')
  , calculatorMid = document.querySelector('#calculator-mid')
  , calculatorMax = document.querySelector('#calculator-max')
  , calculatorRes = document.querySelector('#calculator-result')
  , calculatorCom = document.querySelector('#calculator-comission')
  , baseFee = .0325, incentiveFee = .0275;

calculatorInput.addEventListener('input', updateCalculator, true);
calculatorRange.addEventListener('input', updateCalculator, true);

function updateCalculator() {
  var calculatorInputVal = calculatorInput.value
    , calculatorRangeVal = calculatorRange.value
    , calculatorMinVal = calculatorInputVal * 0.94
    , calculatorMidVal = calculatorInputVal * (calculatorRangeVal / 100)
    , calculatorMaxVal = calculatorInputVal * 1.00
    , calculatorComVal = baseFee + (incentiveFee / (calculatorInputVal - calculatorMinVal) * (calculatorMidVal - calculatorMinVal))
    , calculatorResVal = calculatorMidVal * (1 - calculatorComVal);

  calculatorMin.innerHTML = formatCurrencyValue(Math.round(calculatorMinVal));
  calculatorMid.innerHTML = formatCurrencyValue(Math.round(calculatorMidVal));
  calculatorMax.innerHTML = formatCurrencyValue(Math.round(calculatorMaxVal));
  calculatorRes.innerHTML = formatCurrencyValue(Math.round(calculatorResVal));
  calculatorCom.innerHTML = formatPercentageValue(calculatorComVal);
};

function formatCurrencyValue(val) {
  return val.toLocaleString('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
};

function formatPercentageValue(val) {
  return val.toLocaleString('es-ES', {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 1
  });
};
