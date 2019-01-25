/**
 * YES currently this is just a function..
 * This will probably become a class in the future,
 * but for now its only some experimentations on scroll linked effects.
 * Its about finding and testing logic we can apply on elements,
 * in correlation with the scroll to create a range of cool effects.
 * A big parts of the function's based on css, the 'logic' we're applying on element's determined by its class
 *
 * ATM its only works on (Chrome +66) because we're using CSS Typed OM
 *
 */
let w = window,
    d = document,
    dE = d.documentElement,
    b = dE.getElementsByTagName('body')[0],
    windowHeight = w.innerHeight|| dE.clientHeight|| b.clientHeight,
    snekContainers = {},
    sC = [],
    snekInside, arrayReady, elementIsEligible = false
let eActive = []
let hasTargets = false
function snekTypedOM(parent, container, trigger = 50){
  // we set the trigger once  (->at 50% of the window height by default)
  if(typeof triggerLine == 'undefined'){triggerLine = ((windowHeight/100) * trigger)}
  fromTop = (window.pageYOffset || dE.scrollTop)  - (dE.clientTop || 0)
  // generate array containing each snek elems  // (once only)
  if(!arrayReady){
    snekContainers = dE.querySelector(parent).querySelectorAll(container)
    for(let i = snekContainers.length-1; i > 0; i--){
      sC.unshift(snekContainers[i])
    }
    sC.unshift(snekContainers[0])
  }
  // generate snek parts (span) & inject them in all .snek-content element  // (once only)
  // this is provisory, span not needed in some case..
  // so maybe it will be managed by css classes too,
  // & maybe even add two more span in some case, to offer more possibilities for cool effects on the background
  if (!snekInside) {
    snekInside = true
    for (let i = snekContainers.length - 1; i >= 0; i--) {
      for(j = 1; j >= 0; j--){
        let span = document.createElement('span')
        snekContainers[i].appendChild(span)
      }
    }
  }
  // array's now filled & ready
  // below will exec until an element meet the conditions to be active
  if(sC.length == snekContainers.length && !elementIsEligible){
    arrayReady = true
    sC.map(function(e){
      if(typeof e !== 'undefined'){
        if(e.offsetTop < (triggerLine + fromTop)  && Math.round(e.offsetTop + e.clientHeight) > (triggerLine + fromTop)){
          // we found an element meeting condition to be activated
          activeElement = e
          activeElement.classList.add('s-active')
          // we build an array containing each active elements
          if(!hasTargets){
            eActive.push(activeElement)
          }
        }else{
          e.classList.remove('s-active') // these elements are inactive

          if(e.classList.contains('s-sSs-s')){ // these elements were active
            // set correct styles if we're above our trigger line
            if(e.offsetTop <  (triggerLine + fromTop) && e.offsetTop !== (triggerLine + fromTop)){
              eActive.forEach(function(activeElement){
                activeElement.querySelectorAll('span')[0].attributeStyleMap.clear()
                activeElement.querySelectorAll('span')[1].attributeStyleMap.clear()
              })
              // we clear eActive array
              eActive.length = 0
            }else{
              // we're removing 'snek trace' on the element since they're below our trigger line,
              // so they can go back to their default syling
              e.classList.remove('s-sSs-s')
              if(eActive.length > 0){
                eActive.forEach(function(activeElement){
                  activeElement.querySelectorAll('span')[0].attributeStyleMap.clear()
                  activeElement.querySelectorAll('span')[1].attributeStyleMap.clear()
                })
              }
            }
          }
        }
      }
      return false
    })
    // if eActive contains at least one element we can assume we have at least one target
    // so we set our boolean, to stop pushing element in our active elements array
    if(eActive.length>0){ hasTargets = true}
  }
  // function activated one or more elements, lets first check if they still meet the condition to be active
  // if not, we just leave the execution right away
  // & we set our boolean to re-enter in above condition & map until we find another element meeting conditions
  if(eActive.length > 0 && hasTargets){
    if(activeElement.offsetTop < (triggerLine + fromTop)  && Math.round(activeElement.offsetTop + activeElement.clientHeight) > (triggerLine + fromTop)){
      elementIsEligible = true

    }else{
      // element(s) doesn't meet conditions to be active anymore
      // here we clear our active elements array & set our booleans to re-enter the map function
      hasTargets = false
      elementIsEligible = false
      // .s-sSs-s is the class that snek leaves as a trace in an element previously active
      // its also used in the css parts of snek to define the style we want on element previously 'fully played'
      eActive.forEach(function(activeElement){
        activeElement.classList.add('s-sSs-s')
      })
      return false
    }
    // one or more elements are active & elligible
    // we send it to treatment function
    if(activeElement.classList.contains('s-active') && elementIsEligible){
      treatment(activeElement)
    }
  }
}
// Treatment Functions
function treatment(activeElement){
  let logic
  // find the logic we need to apply based on the css class of element we just receive
  // the order is important below / eg: elements having both 's-middle' & 's-is-content' css class, need to be treat as 's-is-content' only.
  if(activeElement.classList.contains('s-middle')){logic = 's-middle'}
  if(activeElement.classList.contains('s-is-content')){logic = 's-is-content'}
  if(activeElement.classList.contains('s-is-parallax')){logic = 's-is-parallax'}
  if(activeElement.classList.contains('s-top') || activeElement.classList.contains('s-bottom')){logic = 's-xy'}
  if(activeElement.classList.contains('s-eg')){logic = 'demo'}

  // we update data needed on each elements inside our array of actives elements (eActive)
  for (index in eActive) {
    eActive[index].offset = eActive[index].offsetTop
    eActive[index].relativeScroll =  Math.abs((eActive[index].offset - (fromTop + triggerLine)))
    eActive[index].elementHalf = (eActive[index].clientHeight / 2)
    // below doesnt need to be updated so we set it just once
    if(typeof eActive[index].span1 == 'undefined' && typeof eActive[index].span2 == 'undefined'){
      eActive[index].span1 = eActive[index].querySelectorAll('span')[0]
      eActive[index].span2 = eActive[index].querySelectorAll('span')[1]
    }
  }

  switch(logic) {
    // s-is-content treatment
    case 's-is-content':
      if(activeElement.relativeScroll < activeElement.elementHalf){
        eActive.forEach(function(activeElement){
          activeElement.attributeStyleMap.set('width', CSS.percent((activeElement.relativeScroll / activeElement.elementHalf) * 100))
        })
      }
      if(activeElement.relativeScroll > activeElement.elementHalf){
        eActive.forEach(function(activeElement){
          activeElement.attributeStyleMap.set('width', CSS.percent(100))
        })
      }
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
      eActive.forEach(function(activeElement){
        style = activeElement.currentStyle || window.getComputedStyle(activeElement, false),
        url = style.backgroundImage.slice(4, -1).replace(/['"]/g, "");
        img = new Image
        img.src = url
        if(img.height > ((img.width/3) * 2)){
          activeElement.attributeStyleMap.set('background-position-y', CSS.percent((((activeElement.relativeScroll / activeElement.elementHalf) * 100) / 2)).toString())
        }else{
          activeElement.attributeStyleMap.set('background-position-y', CSS.percent(((activeElement.relativeScroll / activeElement.elementHalf) * 100)).toString())

        }
      })
    break
    // s-middle treatment
    case 's-middle':
      if(activeElement.relativeScroll < activeElement.elementHalf){
        eActive.forEach(function(activeElement){
          activeElement.span2.attributeStyleMap.set('height', 0)
          activeElement.span2.attributeStyleMap.set('top', CSS.percent(50))
          activeElement.span1.attributeStyleMap.set('width', CSS.percent((activeElement.relativeScroll / activeElement.elementHalf) * 100))
          activeElement.span1.attributeStyleMap.set('left', CSS.percent((100 - (activeElement.relativeScroll / activeElement.elementHalf) * 100) / 2))
        })
      }
      if(activeElement.relativeScroll > activeElement.elementHalf){
        eActive.forEach(function(activeElement){
          activeElement.span1.attributeStyleMap.set('width', CSS.percent(100))
          activeElement.span1.attributeStyleMap.set('left', 0)
          activeElement.span2.attributeStyleMap.set('height', CSS.percent(((activeElement.relativeScroll - (activeElement.elementHalf)) / (activeElement.elementHalf)) * 100))
          activeElement.span2.attributeStyleMap.set('top', CSS.percent((100 - (((activeElement.relativeScroll - (activeElement.elementHalf)) / (activeElement.elementHalf)) * 100)) / 2))
        })
      }
    break
    // s-top || s-bottom treatment
    case 's-xy':
      if(activeElement.classList.contains('s-is-full')){
        eActive.forEach(function(activeElement){
          activeElement.span1.attributeStyleMap.set('width', 0)
          activeElement.span1.attributeStyleMap.set('height', 0)
          activeElement.span2.attributeStyleMap.set('height', CSS.percent((activeElement.relativeScroll / activeElement.elementHalf) * 100))
        })
      }else{
        eActive.forEach(function(activeElement){
          activeElement.span2.attributeStyleMap.set('height', CSS.percent(((activeElement.relativeScroll / activeElement.elementHalf) * 100) / 2))
        })
      }
    break
    case 'demo':
      eg1 = d.getElementById('eg1')
      eg1_rS = d.getElementById('eg1_rS')
      eg1_eH = d.getElementById('eg1_eH')
      eg1_r = d.getElementById('eg1_r')
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
    break
    // default treatment
    default:
      if(activeElement.relativeScroll < activeElement.elementHalf){
        eActive.forEach(function(activeElement){
          activeElement.span2.attributeStyleMap.set('height', 0)
          activeElement.span1.attributeStyleMap.set('width', CSS.percent((activeElement.relativeScroll / activeElement.elementHalf) * 100))
        })
      }
      if(activeElement.relativeScroll > activeElement.elementHalf){
        eActive.forEach(function(activeElement){
          activeElement.span1.attributeStyleMap.set('width', CSS.percent(100))
          activeElement.span2.attributeStyleMap.set('height', CSS.percent(((activeElement.relativeScroll - (activeElement.elementHalf)) / (eActive[0].elementHalf)) * 100))
        })
      }
  }
}
