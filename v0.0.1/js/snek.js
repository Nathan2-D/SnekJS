let w = window,
    d = document,
    dE = d.documentElement,
    b = dE.getElementsByTagName('body')[0],
    windowHeight = w.innerHeight|| dE.clientHeight|| b.clientHeight,
    snekContainers = {},
    sC = [],
    snekInside, arrayReady, elementIsEligible = false
const triggerLine = ((windowHeight/100) * 50) // we set the trigger once  (->at 50% of the window height in this case)

function snekTypedOM(parent, container){
  fromTop = (window.pageYOffset || dE.scrollTop)  - (dE.clientTop || 0)
  // generate array containing each snek elems
  if(!arrayReady){
    snekContainers = dE.querySelector(parent).querySelectorAll(container)
    for(let i = snekContainers.length-1; i > 0; i--){
      sC.unshift(snekContainers[i])
    }
    sC.unshift(snekContainers[0])
  }
  // generate snek parts (span) & inject them in all .snek-content element
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
          // our active element
          activeElement = e
          activeElement.classList.add('active', 's-sss-s')
        }else{
          e.classList.remove('active') // these elements are inactive
          if(e.classList.contains('s-sss-s')){ // these elements were active
            // set correct styles if we're above our trigger line
            if(e.offsetTop <  (triggerLine + fromTop) && e.offsetTop !== (triggerLine + fromTop)){
              if(e.classList.contains('s-middle')){
                if(e.classList.contains('s-is-content')){
                  e.attributeStyleMap.set('width', CSS.percent(100))
                }else{
                  span1.attributeStyleMap.set('width', CSS.percent(100))
                  span1.attributeStyleMap.set('left', CSS.percent(0))
                  span2.attributeStyleMap.set('height', CSS.percent(100))
                  span2.attributeStyleMap.set('top', CSS.percent(0))
                }
              }else if(e.classList.contains('s-top')){
                  span2.attributeStyleMap.set('bottom', CSS.percent(0))
              }else{
                e.querySelectorAll('span')[0].attributeStyleMap.set('width', CSS.percent(100))
                e.querySelectorAll('span')[1].attributeStyleMap.set('height', CSS.percent(100))
                e.querySelectorAll('span')[1].attributeStyleMap.set('top', CSS.percent(0))
              }
            }else{
              // set correct styles if we're below our trigger line
              if(e.classList.contains('s-middle') && e.classList.contains('s-is-content')){
                e.attributeStyleMap.set('width', CSS.percent(0))
              }else if(e.classList.contains('s-top')){
                span2.attributeStyleMap.set('bottom', CSS.percent(0))
              }else{
                e.querySelectorAll('span')[0].attributeStyleMap.set('width', CSS.percent(0))
                e.querySelectorAll('span')[1].attributeStyleMap.set('height', CSS.percent(0))
              }
            }
          }
        }
      }
      return false
    })
  }
  if(typeof activeElement !== 'undefined'){
    // function activated an element, lets first check if its still meet the condition to be active
    // if not, we just leave the execution rigth away
    // & we set our boolean to re-enter in above condition & map until we find an element to activate
    if(activeElement.offsetTop < (triggerLine + fromTop)  && Math.round(activeElement.offsetTop + activeElement.clientHeight) > (triggerLine + fromTop)){
      elementIsEligible = true
    }else{
      elementIsEligible = false
      return false
    }
    // get amount of pixels scrolled inside our active element
    offset = activeElement.offsetTop
    relativeScroll = Math.abs((offset - (fromTop + triggerLine)))
    span1 = activeElement.querySelectorAll('span')[0]
    span2 = activeElement.querySelectorAll('span')[1]
    // activeElement has active class & snekInside
    if(activeElement.classList.contains('active') && typeof span1 !== 'undefined'  && typeof span2 !== 'undefined'){
      elementHalf = (activeElement.clientHeight / 2)
      // s-is-content treatment
      if(activeElement.classList.contains('s-is-content')){
        if(relativeScroll < elementHalf){
          activeElement.attributeStyleMap.set('width', CSS.percent((relativeScroll / elementHalf) * 100))
        }
        if(relativeScroll > elementHalf){
          activeElement.attributeStyleMap.set('width', CSS.percent(100))
        }
      }
      // s-top & s-bottom treatment
      else if(activeElement.classList.contains('s-top') || activeElement.classList.contains('s-bottom')){
        if(activeElement.classList.contains('s-is-full')){
          span1.attributeStyleMap.set('width', CSS.percent(0))
          span1.attributeStyleMap.set('height', CSS.percent(0))
          span2.attributeStyleMap.set('height', CSS.percent((relativeScroll / elementHalf) * 100))
        }else{
          span2.attributeStyleMap.set('height', CSS.percent(((relativeScroll / elementHalf) * 100) / 2))
        }
      }
      // s-middle treatment
      else if(activeElement.classList.contains('s-middle')){
        if(relativeScroll < elementHalf){
          span2.attributeStyleMap.set('height', CSS.percent(0))
          span2.attributeStyleMap.set('top', CSS.percent(50))
          span1.attributeStyleMap.set('width', CSS.percent((relativeScroll / elementHalf) * 100))
          span1.attributeStyleMap.set('left', CSS.percent((100 - ((relativeScroll / elementHalf) * 100))))
        }
        if(relativeScroll > elementHalf){
          span1.attributeStyleMap.set('width', CSS.percent(100))
          span1.attributeStyleMap.set('left', CSS.percent(0))
          span2.attributeStyleMap.set('height', CSS.percent(((relativeScroll - (elementHalf)) / (elementHalf)) * 100))
          span2.attributeStyleMap.set('top', CSS.percent((100 - (((relativeScroll - (elementHalf)) / (elementHalf)) * 100)) / 2))
        }
      }
      // default treatment
      else{
        if(relativeScroll < elementHalf){
          span1.attributeStyleMap.set('width', CSS.percent((relativeScroll / elementHalf) * 100))
        }
        if(relativeScroll > elementHalf){
          span2.attributeStyleMap.set('height', CSS.percent(((relativeScroll - (elementHalf)) / (elementHalf)) * 100))
        }
      }
    }
  }
}
function snek(parent, container){
  fromTop = (window.pageYOffset || dE.scrollTop)  - (dE.clientTop || 0)
  // generate array containing each snek elems
  if(!arrayReady){
    snekContainers = dE.querySelector(parent).querySelectorAll(container)
    for(let i = snekContainers.length-1; i > 0; i--){
      sC.unshift(snekContainers[i])
    }
    sC.unshift(snekContainers[0])
  }
  // generate snek parts (span) & inject them in all .snek-content element
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
        // if(typeof e.dataset.trigger !== 'undefined'){triggerLine = ((windowHeight/100) * e.dataset.trigger)}else{triggerLine = windowHeight}
        if(e.offsetTop < (triggerLine + fromTop)  && Math.round(e.offsetTop + e.clientHeight) > (triggerLine + fromTop)){
          // our active element
          activeElement = e
          activeElement.classList.add('active', 's-sss-s')
        }else{
          e.classList.remove('active') // these elements are inactive
          if(e.classList.contains('s-sss-s')){ // these elements were active
            // set correct styles if we're above our trigger line
            if(e.offsetTop <  (triggerLine + fromTop) && e.offsetTop !== (triggerLine + fromTop)){
              if(e.classList.contains('s-middle')){
                if(e.classList.contains('s-is-content')){
                  e.style.width = '100%'
                }else{
                  span2.style.height ='100%'
                  span2.style.top = 0
                  span1.style.width = '100%'
                  span1.style.left = 0
                }
              }else if(e.classList.contains('s-top')){
                  span2.style.bottom = 0
              }else{
                e.querySelectorAll('span')[0].style.width = '100%'
                e.querySelectorAll('span')[1].style.height = '100%'
                e.querySelectorAll('span')[1].style.top = 0
              }
            }else{
              // set correct styles if we're below our trigger line
              if(e.classList.contains('s-middle') && e.classList.contains('s-is-content')){
                e.style.width = 0
              }else if(e.classList.contains('s-top')){
                 span2.style.bottom = 0
              }else{
                e.querySelectorAll('span')[0].style.width = 0
                e.querySelectorAll('span')[1].style.height = 0
              }
            }
          }
        }
      }
      return false
    })
  }
  if(typeof activeElement !== 'undefined'){
    // function activated an element, lets first check if its still meet the condition to be active
    // if not, we just leave the execution rigth away
    // & we set our boolean to re-enter in above condition & map until we find an element to activate
    if(activeElement.offsetTop < (triggerLine + fromTop)  && Math.round(activeElement.offsetTop + activeElement.clientHeight) > (triggerLine + fromTop)){
      elementIsEligible = true
    }else{
      elementIsEligible = false
      return false
    }
    // get amount of pixels scrolled inside our active element
    offset = activeElement.offsetTop
    relativeScroll = Math.abs((offset - (fromTop + triggerLine)))
    span1 = activeElement.querySelectorAll('span')[0]
    span2 = activeElement.querySelectorAll('span')[1]
    // activeElement has active class & snekInside
    if(activeElement.classList.contains('active') && typeof span1 !== 'undefined'  && typeof span2 !== 'undefined'){
      elementHalf = (activeElement.clientHeight / 2)
      // s-is-content treatment
      if(activeElement.classList.contains('s-is-content')){
        if(relativeScroll < elementHalf){activeElement.style.width =  (Math.round((relativeScroll / elementHalf) * 100)) + '%' }
        if(relativeScroll > elementHalf){activeElement.style.width = '100%' }
      }
      // s-top & s-bottom treatment
      else if(activeElement.classList.contains('s-top') || activeElement.classList.contains('s-bottom')){
        if(activeElement.classList.contains('s-is-full')){span2.style.height = (Math.round((relativeScroll / elementHalf) * 100)) + '%'
        }else{span2.style.height = (Math.round((relativeScroll / elementHalf) * 100)) / 2 + '%'}
      }
      // s-middle treatment
      else if(activeElement.classList.contains('s-middle')){
        if(relativeScroll < elementHalf){
          span2.style.height = 0
          span2.style.top = '50%'
          span1.style.width = (Math.round((relativeScroll / elementHalf) * 100)) + '%'
          span1.style.left = (100 - (Math.round((relativeScroll / elementHalf) * 100))) / 2 + '%'
        }
        if(relativeScroll > elementHalf){
          span1.style.width = '100%'
          span1.style.left = 0
          span2.style.height = (Math.round(((relativeScroll - (elementHalf)) / (elementHalf)) * 100)) + '%'
          span2.style.top = (100 - (Math.round(((relativeScroll - (elementHalf)) / (elementHalf)) * 100))) / 2 + '%'
        }
      }
      // default treatment
      else{
        if(relativeScroll < elementHalf){
          span1.style.width = (Math.round((relativeScroll / elementHalf) * 100)) + '%'
        }
        if(relativeScroll > elementHalf){
          span2.style.height = (Math.round(((relativeScroll - (elementHalf)) / (elementHalf)) * 100)) + '%'
        }
      }
    }
  }
}





