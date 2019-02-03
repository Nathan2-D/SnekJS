/**
 * YES currently this is just a function..
 * This will probably become a class in the future,
 * but for now its only some experimentations on scroll linked effects.
 * Its about finding and testing logic to apply on elements,
 * in correlation with the scroll to create a range of cool effects.
 *
 * A big parts of the function's based on css, the 'logic' we're applying on element's determined by its class
 *
 * ATM its only works on (Chrome +66) because we're using CSS Typed OM
 *
 *  allElements @type {array} - contains each elements with the 's-snek' class
 *  activeElements @type {array} - contains active elements
 *  activeElement @type {object} - an active element (always inside a loop)
 */
let w = window,
    d = document,
    dE = d.documentElement,
    b = dE.getElementsByTagName('body')[0],
    windowHeight = w.innerHeight|| dE.clientHeight|| b.clientHeight,
    allElements = [],
    snekInside, arrayReady, elementIsEligible = false
let activeElements = []
let hasTargets = false
let raf = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    window.oRequestAnimationFrame

const isNil = val => val === undefined || val === null
const hasClass = (el, className) => el.classList.contains(className)

function snekTypedOM(parent, container, trigger = 50){
  // set the trigger once  (->at 50% of the window height by default)
  if(typeof triggerLine == 'undefined'){triggerLine = ((windowHeight/100) * trigger)}

  // set/update the scrollTop position
  fromTop = (window.pageYOffset || dE.scrollTop)  - (dE.clientTop || 0)

  // generate array containing each snek elems  // (once only)
  if(!arrayReady){
    allObjects = dE.querySelector(parent).querySelectorAll(container)
    for(let i = allObjects.length-1; i > 0; i--){
      allElements.unshift(allObjects[i])
    }
    allElements.unshift(allObjects[0])
  }

  // generate snek parts (span) & inject them in all .snek-content element  // (once only)
  // this is provisory, span not needed in some case..
  // so maybe it will be managed by css classes too,
  // & maybe even add two more span in some case, to offer more possibilities for cool effects on the background
  if (!snekInside) {
    snekInside = true
    for (let i = allObjects.length - 1; i >= 0; i--) {
      for(j = 1; j >= 0; j--){
        let span = document.createElement('span')
        allObjects[i].appendChild(span)
      }
    }
  }

  // array's now filled & ready
  // we'll map our array until an element meet the conditions to be activate
  if(allElements.length == allObjects.length && !elementIsEligible){
    arrayReady = true
    allElements.map(function(e){
      if(typeof e !== 'undefined'){
        if(e.offsetTop < (triggerLine + fromTop)  && Math.round(e.offsetTop + e.clientHeight) > (triggerLine + fromTop)){
          // we found an element meeting condition to be activated
          activatedElement = e
          activatedElement.classList.add('s-active')

          // we build an array containing each elements to activate
          if(!hasTargets){
            activeElements.push(activatedElement)
          }
        }else{
          // these elements are inactive so we remove 's-active' class
          e.classList.remove('s-active')
          if(hasClass(e, 's-sSs-s')){
            // these elements were active
            // first we clear all style rules previously applied on these elements
            activeElements.forEach(function(activeElement){
              activeElement.querySelectorAll('span')[0].attributeStyleMap.clear()
              activeElement.querySelectorAll('span')[1].attributeStyleMap.clear()
            })

            // then we need to know if the element we just desactivated is below or above the trigger line
            if(e.offsetTop <  (triggerLine + fromTop) && e.offsetTop !== (triggerLine + fromTop)){
              // these element(s) are above our trigger line
              // so we clear our activeElements array (activeElements)
              if(activeElements.length > 0){activeElements.length = 0}
            }else{
              // we're removing 'snek trace' on these elements since they're currently below our trigger line,
              // so they can go back to their default syling
              e.classList.remove('s-sSs-s')
            }
          }
        }
      }
      return false
    })
    // if activeElements contains at least one element we can assume we have at least one target
    // so we set our boolean, to stop pushing element in our active elements array
    if(activeElements.length>0){hasTargets = true}
  }
  // function activated one or more elements, lets first check if they still meet the condition to be active
  // if not, we just leave the execution right away
  // & we set our boolean to re-enter in above condition & map until we find another element meeting conditions
  if(activeElements.length > 0 && hasTargets){
    if(activatedElement.offsetTop < (triggerLine + fromTop)  && Math.round(activatedElement.offsetTop + activatedElement.clientHeight) > (triggerLine + fromTop)){
      // element(s) still meeting conditions to be active
      elementIsEligible = true
    }else{
      // element(s) doesn't meet conditions to be active anymore
      // here we clear our active elements array & set our booleans to re-enter the map function
      hasTargets = false
      elementIsEligible = false
      // .s-sSs-s is the class that snek leaves as a trace in an element previously active
      // its also used in the css parts of snek to define the style we want on element previously 'fully played'
      activeElements.forEach(function(activeElement){
        activeElement.classList.add('s-sSs-s')
      })
      return false
    }
    // one or more elements are active & elligible
    // we send it to treatment function
    if(hasClass(activatedElement, 's-active') && elementIsEligible){
      treatment(activatedElement)
    }
  }
}
// Treatment Functions
function treatment(activeElement){
  // we update data needed on each elements inside our array of actives elements (activeElements)
  for (index in activeElements) {
    activeElements[index].offset = activeElements[index].offsetTop
    activeElements[index].relativeScroll =  Math.abs((activeElements[index].offset - (fromTop + triggerLine)))
    activeElements[index].elementHalf = (activeElements[index].clientHeight / 2)

    // below doesnt need to be updated so we set it just once
    // 1.find the logic we need to apply based on the css class of element we just receive
    // the order is important below / eg: elements having both 's-middle' & 's-is-content' css class, need to be treat as 's-is-content' only.
    // (this is temporary) testing and researching possibilities..
    if(isNil(activeElements[index].logic)){
      if(hasClass(activeElement, 's-middle')){activeElements[index].logic = 's-middle'}
      if(hasClass(activeElement, 's-is-content')){activeElements[index].logic = 's-is-content'}
      if(hasClass(activeElement, 's-is-parallax')){activeElements[index].logic = 's-is-parallax'}
      if(hasClass(activeElement, 's-top') || hasClass(activeElement, 's-bottom')){activeElements[index].logic = 's-xy'}
      if(hasClass(activeElement, 's-eg')){activeElements[index].logic = 'demo'}
    }
    // 2. we set easy access to our span if it's not already done
    if(isNil(activeElements[index].span1) && isNil(activeElements[index].span2)){
      activeElements[index].span1 = activeElements[index].querySelectorAll('span')[0]
      activeElements[index].span2 = activeElements[index].querySelectorAll('span')[1]
    }
  }

  switch(activeElement.logic) {
    // s-is-content treatment
    case 's-is-content':
      raf(function(){
        if(activeElement.relativeScroll < activeElement.elementHalf){
          activeElements.forEach(function(activeElement){
            activeElement.attributeStyleMap.set('width', CSS.percent((activeElement.relativeScroll / activeElement.elementHalf) * 100))
          })
        }
        if(activeElement.relativeScroll > activeElement.elementHalf){
          activeElements.forEach(function(activeElement){
            activeElement.attributeStyleMap.set('width', CSS.percent(100))
          })
        }
      })
    break
    // (WIP) s-is-parallax treatment
    // // not sure how to deal with this,...
    // current logic :
    // if the background-image height used for parallax is greater than 2/3 of its size, background-position max output will be 100%
    // else it will be 200%
    // will implement different direction & effect like zoom or blur when i find a decent logic
    // i still need to make some research about css background property to come up with sastisfying base css for '.s-is-parralax'
    // and all combinations with other existing or new css classes
    case 's-is-parallax':
      raf(function(){
        activeElements.forEach(function(activeElement){
          style = activeElement.currentStyle || window.getComputedStyle(activeElement, false),
          url = style.backgroundImage.slice(4, -1).replace(/['"]/g, "");
          img = new Image
          img.src = url
          if(hasClass(activeElement, 's-left') || hasClass(activeElement, 's-right')){
            if(hasClass(activeElement, 's-left')){
              activeElement.attributeStyleMap.set('background-position-x', CSS.percent(((activeElement.relativeScroll / activeElement.elementHalf) * 100)).toString())
            }
            if(hasClass(activeElement, 's-right')){
              activeElement.attributeStyleMap.set('background-position-x', CSS.percent(-Math.abs(((activeElement.relativeScroll / activeElement.elementHalf) * 100))).toString())
            }
            //activeElement.attributeStyleMap.set('background-position-x', CSS.percent(((activeElement.relativeScroll / activeElement.elementHalf) * 100)).toString())
          }else{
            if(img.height > ((img.width/3) * 2)){
              activeElement.attributeStyleMap.set('background-position-y', CSS.percent((((activeElement.relativeScroll / activeElement.elementHalf) * 100) / 2)).toString())
            }else{
              activeElement.attributeStyleMap.set('background-position-y', CSS.percent(((activeElement.relativeScroll / activeElement.elementHalf) * 100)).toString())
            }
          }
        })
      })
    break
    // s-middle treatment
    case 's-middle':
      raf(function(){
        if(activeElement.relativeScroll < activeElement.elementHalf){
          activeElements.forEach(function(activeElement){
            activeElement.span2.attributeStyleMap.set('height', 0)
            activeElement.span2.attributeStyleMap.set('top', CSS.percent(50))
            activeElement.span1.attributeStyleMap.set('width', CSS.percent((activeElement.relativeScroll / activeElement.elementHalf) * 100))
            activeElement.span1.attributeStyleMap.set('left', CSS.percent((100 - (activeElement.relativeScroll / activeElement.elementHalf) * 100) / 2))
          })
        }
        if(activeElement.relativeScroll > activeElement.elementHalf){
          activeElements.forEach(function(activeElement){
            activeElement.span1.attributeStyleMap.set('width', CSS.percent(100))
            activeElement.span1.attributeStyleMap.set('left', 0)
            activeElement.span2.attributeStyleMap.set('height', CSS.percent(((activeElement.relativeScroll - (activeElement.elementHalf)) / (activeElement.elementHalf)) * 100))
            activeElement.span2.attributeStyleMap.set('top', CSS.percent((100 - (((activeElement.relativeScroll - (activeElement.elementHalf)) / (activeElement.elementHalf)) * 100)) / 2))
          })
        }
      })
    break
    // s-top || s-bottom treatment
    case 's-xy':
      raf(function(){
        if(hasClass(activeElement, 's-is-full')){
          activeElements.forEach(function(activeElement){
            activeElement.span1.attributeStyleMap.set('width', 0)
            activeElement.span1.attributeStyleMap.set('height', 0)
            activeElement.span2.attributeStyleMap.set('height', CSS.percent((activeElement.relativeScroll / activeElement.elementHalf) * 100))
          })
        }else{
          activeElements.forEach(function(activeElement){
            activeElement.span2.attributeStyleMap.set('height', CSS.percent(((activeElement.relativeScroll / activeElement.elementHalf) * 100) / 2))
          })
        }
      })
    break
    case 'demo':
      eg1 = d.getElementById('eg1')
      eg1_rS = d.getElementById('eg1_rS')
      eg1_eH = d.getElementById('eg1_eH')
      eg1_r = d.getElementById('eg1_r')
      raf(function(){
        if(activeElement.relativeScroll < activeElement.elementHalf){
          eg2.classList.remove('active')
          eg1.classList.add('active')
          eg1_rS.innerHTML = Math.round(activeElement.relativeScroll)
          eg1_eH.innerHTML = activeElement.elementHalf
          eg1_r.innerHTML = (Math.round((activeElement.relativeScroll / activeElement.elementHalf) * 100))
          activeElement.span1.attributeStyleMap.set('width', CSS.percent((activeElement.relativeScroll / activeElement.elementHalf) * 100))
        }
        if(activeElement.relativeScroll > activeElement.elementHalf){
          eg1.classList.remove('active')
          eg2.classList.add('active')
          eg2_rS.innerHTML = Math.round(activeElement.relativeScroll)
          eg2_eH.innerHTML = (activeElement.elementHalf * 2)
          eg2_r.innerHTML = (Math.round(((activeElement.relativeScroll - (activeElement.elementHalf)) / (activeElement.elementHalf)) * 100))
          activeElement.span2.attributeStyleMap.set('height', CSS.percent(((activeElement.relativeScroll - (activeElement.elementHalf)) / (activeElement.elementHalf)) * 100))
        }
      })
    break
    // default treatment
    default:
    raf(function(){
      if(activeElement.relativeScroll < activeElement.elementHalf){
        activeElements.forEach(function(activeElement){
          activeElement.span2.attributeStyleMap.set('height', 0)
          activeElement.span1.attributeStyleMap.set('width', CSS.percent((activeElement.relativeScroll / activeElement.elementHalf) * 100))
        })
      }
      if(activeElement.relativeScroll > activeElement.elementHalf){
        activeElements.forEach(function(activeElement){
          activeElement.span1.attributeStyleMap.set('width', CSS.percent(100))
          activeElement.span2.attributeStyleMap.set('height', CSS.percent(((activeElement.relativeScroll - (activeElement.elementHalf)) / (activeElements[0].elementHalf)) * 100))
        })
      }

    })
  }
}
