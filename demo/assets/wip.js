class Snek{
  constructor(parent, container, trigger = 50){
    var w = window;
    var d = document;
    var dE = d.documentElement;
    var b = dE.getElementsByTagName('body')[0];
    var windowHeight = w.innerHeight|| dE.clientHeight|| b.clientHeight;
    var snekContainers = {};
    var sC = [];
    var eActive = [];
    var snekInside, arrayReady, elementIsEligible, hasTargets = false;

    var triggerLine = ((windowHeight/100) * trigger);

    // if(!arrayReady){
    //   snekContainers = dE.querySelector(parent).querySelectorAll(container)
    //   for(let i = snekContainers.length-1; i > 0; i--){
    //     sC.unshift(snekContainers[i])
    //   }
    //   sC.unshift(snekContainers[0])
    // }
    // if (!snekInside) {
    //   snekInside = true
    //   for (let i = snekContainers.length - 1; i >= 0; i--) {
    //     for(j = 1; j >= 0; j--){
    //       let span = document.createElement('span')
    //       snekContainers[i].appendChild(span)
    //     }
    //   }
    // }
  }
}

// new Snek('.directParentContainer', '.s-Snek')
