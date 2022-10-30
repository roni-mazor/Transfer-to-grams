'use strict'

const REPLACE_CHILD_KEY = 'replaceChild'
const REPLACE_SELF_KEY = 'replaceSelf'

const gSigns = ['½', '¼', '¾', '⅓', '⅔']
const gSignsMap = {
    '½': '1/2',
    '¼': '1/4',
    '¾': '3/4',
    '⅓': '1/3',
    '⅔': '2/3',
}
findTextElements(document.body)
// confronting numbers with the tiny guy and no spaces 
function findTextElements(element) {
    if (element.hasChildNodes()) {
        if ((element.tagName === 'P' || element.tagName === 'LI') && Array.from(element.childNodes).some(e => e.nodeName === 'SPAN' || e.nodeName === '#text')) {
            replaceText(element, REPLACE_CHILD_KEY, element.innerText)
            // in tasy it doesnt go here when ti is supposed to go need to check how to genereliase it 
        }
        element.childNodes.forEach(findTextElements)
    } else {
        replaceText(element, REPLACE_SELF_KEY, element.textContent)
    }
}

function replaceText(element, method, txt) {
    const modifiedTxt = swapSigns(txt)
    let regex = getRegex(modifiedTxt)
    if (regex) {
        const span = makeSpan(regex, modifiedTxt)
        if (method === REPLACE_CHILD_KEY) element.replaceChildren(span)
        else if (method === REPLACE_SELF_KEY) element.replaceWith(span)
        return true
    }

}

function makeSpan(regex, txt) {
    const span = document.createElement('span')
    span.innerHTML = txt.replace(regex, changeMeasurement)
    return span
}

function changeMeasurement(match, index, string) {
    var { unit, unitCount } = separateString(match)
    const idx = string.indexOf(match)
    const unitTypeContainer = string.slice(idx) // needs a better name substring says nothing
    const grams = (unitCount * toGrams(unit, unitTypeContainer))
    return `<span style="color: #2469c5;">${(grams > 5) ? grams.toFixed(0) : grams.toFixed(1)} gram</span>`

}

function swapSigns(string) {
    if (!/½|¼|¾|⅓|⅔/ig.test(string)) return string
    gSigns.forEach((sign) => {
        if (string.includes(sign)) {

            // const regex = new RegExp('d', `${sign}`)
            const regex = /\d½|\d¼|\d¾|\d⅓|\d⅔/gi
            if (regex.test(string)) {
                string = string.replace(sign, ` ${gSignsMap[sign]}`)
            } else {
                string = string.replace(sign, gSignsMap[sign])
            }
        }
    })
    return string
}



function separateString(string) {
    if (string.charAt(0) === ' ') {
        string = string.slice(1)
    }
    var unitCount
    var unit
    if (string.includes('/')) {
        if (string.charAt(1) === '/') {
            unitCount = +string.charAt(0) / +string.charAt(2)
            unit = string.slice(4)
        } else {
            unitCount = +string.charAt(0) + +string.charAt(2) / +string.charAt(4)
            unit = string.slice(6)
        }
    } else {
        if (string.charAt(1) === ' ') {
            unitCount = +string.charAt(0)
            unit = string.slice(2)
        } else {
            unitCount = +string.slice(0, 2)
            unit = string.slice(3)
        }

    }
    return { unitCount, unit }
}

function toGrams(unit, string) {
    switch (unit) {
        case ('ounce'):
            return 28.3495
        case ('oz'):
            return 28.3495
        case ('pound'):
            return 453.592
        case ('cup'):
            return cupToGrams(string)
        case ('tablespoon'):
            return cupToGrams(string) / 16
        case ('teaspoon'):
            return cupToGrams(string) / 48
        case ('tsp'):
            return cupToGrams(string) / 48

    }
}



function getRegex(txt) {
    let regex
    // go in aloop with an object that contains the regex and the key is the unit
    // if general regex returns true give a regex that is allso general

    if (txt.includes('ounce')) {
        regex = /\d? ?\d?\/?\d ounce/ig
    } else if (txt.includes('pound')) {
        regex = /\d? ?\d?\/?\d pound/ig
    } else if (txt.includes('oz')) {
        regex = /\d? ?\d?\/?\d oz/ig
    } else if (txt.includes('cup')) {
        regex = /\d? ?\d?\/?\d cup/ig
    } else if (txt.includes('tablespoon')) {
        regex = /\d? ?\d?\/?\d tablespoon/ig
    } else if (txt.includes('teaspoon')) {
        regex = /\d? ?\d?\/?\d teaspoon/ig
    } else if (txt.includes('tsp')) {
        regex = /\d? ?\d?\/?\d tsp/ig
    }
    return regex
}

function cupToGrams(txt) {
    if (txt.includes('flour')) return 120
    else if (txt.includes('milk')) return 240
    else if (txt.includes('sugar')) return 200
    else if (txt.includes('oil')) return 225
    else if (txt.includes('butter')) return 227
    else if (txt.includes('yoghurt')) return 245
    else if (txt.includes('water')) return 240
    else if (txt.includes('cornmeal')) return 180
    else if (txt.includes('buttermilk')) return 225
    else if (txt.includes('cream cheese')) return 225
    else if (txt.includes('chocolate chips')) return 170
    else if (txt.includes('chocolate')) return 225
    else if (txt.includes('heavy cream')) return 240
    else if (txt.includes('baking soda')) return 208
    else if (txt.includes('baking powder')) return 208
    else if (txt.includes('vanilla extract')) return 208
    else if (txt.includes('cornstarch')) return 122
    else if (txt.includes('cocoa')) return 80
    else if (txt.includes('powdered sugar')) return 110
    else if (txt.includes('salt')) return 273
    else if (txt.includes('zest')) return 96
    else if (txt.includes('cinnamon')) return 125
    else if (txt.includes('lemon juice')) return 230
    else if (txt.includes('allspice')) return 96
    else if (txt.includes('ginger')) return 97
    else if (txt.includes('carrot')) return 168
    else if (txt.includes('vinegar')) return 230
    else if (txt.includes('pecans')) return 125
    else if (txt.includes('nutmeg')) return 112
    else if (txt.includes('cloves')) return 112
    else if (txt.includes('black pepper')) return 112
    else if (txt.includes('yeast')) return 150
    else if (txt.includes('raisins')) return 155
    else if (txt.includes('oat')) return 110
    else if (txt.includes('peanut butter')) return 250
    else if (txt.includes('honey')) return 340
    else if (txt.includes('lime juice')) return 230
    else if (txt.includes('orange juice')) return 230
    else if (txt.includes('apple juice')) return 248
    else if (txt.includes('apple')) return 118
    else if (txt.includes('basil')) return 25
    else if (txt.includes('graham cracker')) return 120

}


