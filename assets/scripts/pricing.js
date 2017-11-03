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

const tipMiddle = tippy('#calculator-range', {
  position: 'top',
  html: document.querySelector('#tooltip-middle'),
  offset: '0, 25',
  popperOptions: {
    modifiers: {
      flip: {
        enabled: false
      }
    }
  }
});
const elMiddle = document.querySelector('#calculator-range');
const popperMiddle = tipMiddle.getPopperElement(elMiddle);

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
tipMiddle.show(popperMiddle);
tipRight.show(popperRight);



// Calculator
var calculatorInput = document.querySelector('#calculator-input')
  , calculatorRange = document.querySelector('#calculator-range')
  , tooltipMiddle = document.querySelector('#tooltip-middle')
  , calculatorMin = document.querySelector('#calculator-min')
  , calculatorMid = document.querySelector('#calculator-mid')
  , calculatorMax = document.querySelector('#calculator-max')
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
    , calculatorMaxVal = calculatorInputVal * 1.00
    , calculatorComVal = baseFee + (incentiveFee / (calculatorInputVal - calculatorMinVal) * (calculatorMidVal - calculatorMinVal))
    , calculatorResVal = calculatorMidVal * (1 - calculatorComVal);

  tooltipMiddle.innerHTML = formatCurrencyValue(Math.round(calculatorMidVal));
  calculatorMin.innerHTML = formatCurrencyValue(Math.round(calculatorMinVal));
  calculatorMid.innerHTML = formatCurrencyValue(Math.round(calculatorMidVal));
  calculatorMax.innerHTML = formatCurrencyValue(Math.round(calculatorMaxVal));
  calculatorRes.innerHTML = formatCurrencyValue(Math.round(calculatorResVal));
  calculatorCom.innerHTML = formatPercentageValue(calculatorComVal);
};

var rangeEdges = calculatorRange.getBoundingClientRect()
  , tooltip = document.querySelector('#tippy-tooltip-2')
  , tooltipEdges = tooltip.getBoundingClientRect()
  , rangeThumbWidth = 30;

tooltip.style.zIndex = 2;

function moveTooltip(e) {
  var value = Number(e.target.value)
    , movement = (value - calculatorRange.min) / (calculatorRange.max - calculatorRange.min)
    , newPos = movement * rangeEdges.width
    , newPosNormalized = mapRange(newPos, 0, rangeEdges.width, rangeEdges.left + rangeThumbWidth / 2, rangeEdges.right - rangeThumbWidth / 2)
    , leftEdge = newPosNormalized - (tooltipEdges.width / 2)
    , [x, y, z] = get3dValues(tooltip.style.transform);

  requestAnimationFrame(function () {
    tooltip.style.transform = get3dString(leftEdge, y, z)
  })
};



// Helpers

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

function get3dValues (transform3d) {
  let matches = transform3d.match(/\((\d+)px,\s?(\d+)px,\s?(\d+)px\)/)
  return [matches[1], matches[2], matches[3]]
}

function get3dString (x, y, z) {
  return`translate3d(${x}px, ${y}px, ${z}px)`
}

function mapRange (val, inMin, inMax, outMin, outMax) {
  return (val - inMin) * (outMax - outMin) / (inMax - inMin) + outMin
}
