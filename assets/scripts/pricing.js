/* Pricing */

// Tippy Tooltips
tippy.Defaults.zIndex = 1;
tippy.Defaults.arrow = true;
tippy.Defaults.trigger = 'manual';
tippy.Defaults.hideOnClick = false;
tippy.Defaults.sticky = false;
tippy.Defaults.popperOptions = {
  modifiers: { flip: { enabled: false } }
};

const tipLeft = tippy('#input-left', {
  position: 'top-end',
  html: document.querySelector('#tooltip-left'),
  offset: '76, 25',
})  , elLeft = document.querySelector('#input-left')
    , popperLeft = tipLeft.getPopperElement(elLeft);

const tipMiddle = tippy('#calculator-range', {
  position: 'top',
  html: document.querySelector('#tooltip-middle'),
  offset: '0, 25',
  onShown: moveTooltip,
  popperOptions: {
    eventsEnabled: false,
  }
})  , elMiddle = document.querySelector('#calculator-range')
    , popperMiddle = tipMiddle.getPopperElement(elMiddle);

const tipRight = tippy('#input-right', {
  position: 'top-start',
  html: document.querySelector('#tooltip-right'),
  offset: '-76, 25',
})  , elRight = document.querySelector('#input-right')
    , popperRight = tipRight.getPopperElement(elRight);

tipLeft.show(popperLeft);
tipMiddle.show(popperMiddle);
tipRight.show(popperRight);



// Calculator
var calculatorInput = document.querySelector('#calculator-input')
  , calculatorRange = document.querySelector('#calculator-range')
  , tooltipMiddle = document.querySelector('#tooltip-middle')
  , calculatorMin = document.querySelector('#calculator-min')
  , calculatorMid = document.querySelector('#calculator-mid')
  , calculatorMax = document.querySelector('#calculator-max')
  , calculatorTot = document.querySelector('#calculator-total')
  , calculatorRes = document.querySelector('#calculator-result')
  , calculatorCom = document.querySelector('#calculator-comission')
  , baseFee = .0325, incentiveFee = .0275;

calculatorInput.addEventListener('input', updateCalculator, true);
calculatorRange.addEventListener('input', updateCalculator, true);
calculatorRange.addEventListener('input', moveTooltip, true);

function updateCalculator() {
  var calculatorInputVal = calculatorInput.value
    , calculatorRangeVal = calculatorRange.value
    , calculatorMinVal = calculatorInputVal * 0.94
    , calculatorMidVal = calculatorInputVal * (calculatorRangeVal / 100)
    , calculatorMaxVal = calculatorInputVal * 1.10
    , calculatorComVal = baseFee + (incentiveFee / (calculatorInputVal - calculatorMinVal) * (calculatorMidVal - calculatorMinVal));

  calculatorComVal = (calculatorComVal > .10) ? .10 : calculatorComVal;
  var calculatorResVal = calculatorMidVal * (1 - calculatorComVal);

  calculatorMin.innerHTML = formatCurrencyValue(Math.round(calculatorMinVal));
  calculatorMid.innerHTML = formatCurrencyValue(Math.round(calculatorMidVal));
  calculatorMax.innerHTML = formatCurrencyValue(Math.round(calculatorMaxVal));
  calculatorTot.innerHTML = formatCurrencyValue(Math.round(calculatorMidVal));
  calculatorRes.innerHTML = calculatorResVal ? formatCurrencyValue(Math.round(calculatorResVal)) : '0 €';
  calculatorCom.innerHTML = calculatorComVal ? formatPercentageValue(calculatorComVal) : '0 %';

  moveTooltip();
};

var tooltip = document.querySelector('#tippy-tooltip-2')
  , rangeThumbWidth = 30;

tooltip.style.zIndex = 2;
document.body.classList.add('overflow-x-hidden');

function moveTooltip() {
  var rangeEdges = calculatorRange.getBoundingClientRect()
    , tooltipEdges = tooltip.getBoundingClientRect()
    , movement = (calculatorRange.value - calculatorRange.min) / (calculatorRange.max - calculatorRange.min)
    , newPos = movement * rangeEdges.width
    , newPosNormalized = mapRange(newPos, 0, rangeEdges.width, rangeEdges.left + rangeThumbWidth / 2, rangeEdges.right - rangeThumbWidth / 2)
    , leftEdge = newPosNormalized - (tooltipEdges.width / 2)
    , [x, y, z] = get3dValues(tooltip.style.transform);

  requestAnimationFrame(function () {
    tooltip.style.transform = get3dString(leftEdge, y, z)
  });
};

window.addEventListener('resize', function() {
  moveTooltip();
}, supportsPassive ? { passive: true } : false);



// Helpers

function formatCurrencyValue(val) {
  return val.toLocaleString('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

function formatPercentageValue(val) {
  return val.toLocaleString('es-ES', {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
};

function get3dValues(transform3d) {
  var matches = transform3d.match(/\((\d*\.?\d*)px,\s?(\d*\.?\d*)px,\s?(\d*\.?\d*)px\)/);
  if (matches) return [matches[1], matches[2], matches[3]];
}

function get3dString(x, y, z) {
  return `translate3d(${x}px, ${y}px, ${z}px)`;
}

function mapRange(val, inMin, inMax, outMin, outMax) {
  return (val - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}
