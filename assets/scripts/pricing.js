/* Pricing */
/* global tippy AutoNumeric supportsPassive */

// Tippy Tooltips
tippy.Defaults.zIndex = 1
tippy.Defaults.arrow = true
tippy.Defaults.trigger = 'manual'
tippy.Defaults.hideOnClick = false
tippy.Defaults.sticky = false
tippy.Defaults.popperOptions = {
  modifiers: { flip: { enabled: false } }
}

const tipLeft = tippy('#input-left', {
  position: 'top-end',
  html: document.querySelector('#tooltip-left'),
  appendTo: document.querySelector('#tooltip-left').parentNode,
  offset: '76, 25'
})
const elLeft = document.querySelector('#input-left')
const popperLeft = tipLeft.getPopperElement(elLeft)

const tipMiddle = tippy('#calculator-range', {
  position: 'top',
  html: document.querySelector('#tooltip-middle'),
  // appendTo: document.querySelector('#tooltip-middle').parentNode,
  offset: '0, 5',
  onShown: moveTooltip,
  popperOptions: { eventsEnabled: false }
})
const elMiddle = document.querySelector('#calculator-range')
const popperMiddle = tipMiddle.getPopperElement(elMiddle)

const tipRight = tippy('#input-right', {
  position: 'top-start',
  html: document.querySelector('#tooltip-right'),
  appendTo: document.querySelector('#tooltip-right').parentNode,
  offset: '-76, 25'
})
const elRight = document.querySelector('#input-right')
const popperRight = tipRight.getPopperElement(elRight)

tipLeft.show(popperLeft)
tipMiddle.show(popperMiddle)
tipRight.show(popperRight)

// Calculator
var calculatorInput = document.querySelector('#calculator-input')
var calculatorRange = document.querySelector('#calculator-range')
var calculatorMin = document.querySelector('#calculator-min')
var calculatorMid = document.querySelector('#calculator-mid')
var calculatorMax = document.querySelector('#calculator-max')
var calculatorTot = document.querySelector('#calculator-total')
var calculatorRes = document.querySelector('#calculator-result')
var calculatorCom = document.querySelector('#calculator-comission')
var baseFee = 0.0325
var incentiveFee = 0.0275

calculatorInput.addEventListener('keydown', anArrowKeys, true)
calculatorInput.addEventListener('input', updateCalculator, true)
calculatorRange.addEventListener('input', updateCalculator, true)
calculatorRange.addEventListener('input', moveTooltip, true)

var anCalculatorInput = new AutoNumeric(calculatorInput, {
  currencySymbol: ' €',
  decimalCharacter: ',',
  digitGroupSeparator: '.',
  decimalPlaces: 0,
  modifyValueOnWheel: false,
  minimumValue: 0,
  maximumValue: 10000000,
  currencySymbolPlacement: AutoNumeric.options.currencySymbolPlacement.suffix
})

function anArrowKeys (event) {
  var code = event.code
  var key = event.key
  var keyCode = event.keyCode
  if (code === 'ArrowDown' || key === 'ArrowDown' || keyCode === 40) {
    anCalculatorInput.set(parseInt(anCalculatorInput.rawValue) - 100000)
    updateCalculator()
  } else if (code === 'ArrowUp' || key === 'ArrowUp' || keyCode === 38) {
    anCalculatorInput.set(parseInt(anCalculatorInput.rawValue) + 100000)
    updateCalculator()
  }
}

function updateCalculator () {
  var calculatorInputVal = anCalculatorInput.rawValue
  var calculatorRangeVal = calculatorRange.value
  var calculatorMinVal = calculatorInputVal * 0.94
  var calculatorMidVal = calculatorInputVal * (calculatorRangeVal / 100)
  var calculatorMaxVal = calculatorInputVal * 1.10
  var calculatorComVal = baseFee + (incentiveFee / (calculatorInputVal - calculatorMinVal) * (calculatorMidVal - calculatorMinVal))

  calculatorComVal = (calculatorComVal > 0.06) ? 0.06 : calculatorComVal
  var calculatorResVal = calculatorMidVal * (1 - calculatorComVal)

  calculatorMin.innerHTML = formatCurrencyValue(Math.round(calculatorMinVal))
  calculatorMid.innerHTML = formatCurrencyValue(Math.round(calculatorMidVal))
  calculatorMax.innerHTML = formatCurrencyValue(Math.round(calculatorMaxVal))
  calculatorTot.innerHTML = formatCurrencyValue(Math.round(calculatorMidVal))
  calculatorRes.innerHTML = calculatorResVal ? formatCurrencyValue(Math.round(calculatorResVal)) : '0 €'
  calculatorCom.innerHTML = calculatorComVal ? formatPercentageValue(calculatorComVal) : '0 %'

  moveTooltip()
}

var tooltip = document.querySelector('#tippy-tooltip-2')
var tooltipLeft = document.querySelector('#tooltip-left')
var tooltipRight = document.querySelector('#tooltip-right')
var tooltipLeftEdges = tooltipLeft.getBoundingClientRect()
var tooltipRightEdges = tooltipRight.getBoundingClientRect()
var rangeThumbWidth = 30

tooltip.style.zIndex = 2
document.body.classList.add('overflow-x-hidden')

function moveTooltip () {
  tooltipLeftEdges = tooltipLeft.getBoundingClientRect()
  tooltipRightEdges = tooltipRight.getBoundingClientRect()

  var rangeEdges = calculatorRange.getBoundingClientRect()
  var tooltipEdges = tooltip.getBoundingClientRect()
  var movement = (calculatorRange.value - calculatorRange.min) / (calculatorRange.max - calculatorRange.min)
  var newPos = movement * rangeEdges.width
  var newPosNormalized = mapRange(newPos, 0, rangeEdges.width, rangeEdges.left + rangeThumbWidth / 2, rangeEdges.right - rangeThumbWidth / 2)
  var leftEdge = newPosNormalized - (tooltipEdges.width / 2)
  var rightEdge = newPosNormalized + (tooltipEdges.width / 2)
  var [x, y, z] = get3dValues(tooltip.style.transform)

  tooltip.style.transform = get3dString(leftEdge, y, z)
  setTimeout(function () {
    tooltip.style.transform = get3dString(leftEdge, y, z)
  }, 1)

  var tooltipLeftDistance = tooltipLeftEdges.x + tooltipLeftEdges.width
  var tooltipRightDistance = tooltipRightEdges.x
  var inputLeft = document.querySelector('#input-left')
  var inputRight = document.querySelector('#input-right')

  if (leftEdge < tooltipLeftDistance) {
    tooltipLeft.classList.add('o-0')
    inputLeft.classList.add('triangle-o-0')
  } else {
    tooltipLeft.classList.remove('o-0')
    inputLeft.classList.remove('triangle-o-0')
  }

  if (rightEdge > tooltipRightDistance) {
    tooltipRight.classList.add('o-0')
    inputRight.classList.add('triangle-o-0')
  } else {
    tooltipRight.classList.remove('o-0')
    inputRight.classList.remove('triangle-o-0')
  }
}

window.addEventListener('resize', function () {
  moveTooltip()
}, supportsPassive ? { passive: true } : false)

// Helpers

function formatCurrencyValue (val) {
  return val.toLocaleString('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })
}

function formatPercentageValue (val) {
  return val.toLocaleString('es-ES', {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  })
}

function get3dValues (transform3d) {
  var matches = transform3d.match(/\((-?\d*\.?\d*)px,\s?(\d*\.?\d*)px,\s?(\d*\.?\d*)px\)/)
  if (matches) return [matches[1], matches[2], matches[3]]
}

function get3dString (x, y, z) {
  return `translate3d(${x}px, ${y}px, ${z}px)`
}

function mapRange (val, inMin, inMax, outMin, outMax) {
  return (val - inMin) * (outMax - outMin) / (inMax - inMin) + outMin
}
