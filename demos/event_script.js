(function($) {
  
  // DEMO for DomatorJS using event.js 
  // Demo includes related methods for handling events and custom touch events
  
  
  const div1 = $('#div1').copy()
  const div2 = $('#div2').copy()
  const div3 = $('#div3').copy()
  
  $(div1).append('<h5>click event only</h5>')
  $(div2).append('<h5>multiple touch events</h5>')
  $(div3).append('<h5>multiple touch events with remove events enabled</h5>')
  

  // to add and remove an event
  
  $.on(div1, {
    click: (e) => { 
      log(e.type)
    }
  })
  
  
  // equivalent version, more readable
  
  // we have to put id to make it clear but even without id it will work as long as we same custom id on remove and $.off() later
  
  /*

    $.on(div1, {
      id: 'div1',
      click: (e) => { 
        counter++
        log(e.type) 
      }
    },
    {
      // it means we will use the remove event config with custom id = div1
      remove: 'div1'
    })
    
    // we use $.off() to remove event based on id, element or type
    $.off('div1', {
      condition: () => { return counter === 3},
      callback: () => { 
        log('event click removed') },
    })
    
  */
  
  
  // with multiple touch events
  
  $.on(div2, {
    tap: (e) => { log(e.type) },
    doubleclick: (e) => { log(e.type) },
    longpress: (e) => { log(e.type) },
    slideright: (e) => { log(e.type) },
    slideleft: (e) => { log(e.type) },
    slideup: (e) => { log(e.type) },
    slidedown: (e) => { log(e.type) },
    drag: (e) => { log(e.type) },
    drop: (e) => { log(e.type) },
    zoomin: (e) => { log(e.type) },
    zoomout: (e) => { log(e.type) }
  })
  
  
  $.on(div3, {
    id: 'event1',
    tap: (e) => { log(e.type) },
    doubleclick: (e) => { log(e.type) },
    longpress: (e) => { log(e.type) },
    slideright: (e) => { log(e.type) },
    slideleft: (e) => { log(e.type) },
    slideup: (e) => { log(e.type) },
    slidedown: (e) => { log(e.type) },
    drag: {
      free: [20, 400, 20, 400], // set limit for dragging, 
      callback: (e) => { log(e.type) }
    },
    drop: (e) => { log(e.type) },
    zoomin: {
      max: 3, // set max scaling to , default is 4
      callback: (e) => { log(e.type) }
    },
    zoomout: (e) => { log(e.type) }
  },
  {
    remove: 'div3'
  })
  
  
  
  $.off("div3", {
    
    // here as your condition is an object, meaning we can specify each condition for each touch events with id = event1
    // condition.drag only works for drag event while condition.other works for remaining events
    // same also with other options, callback and repeat where we can specify for each events 
    
    condition: {
      // only remove the event if div2 with type longpress is done 
      drag: () => { return $.isEventDone(div2, 'longpress') },
      
      // only remove the event if div2 with type doubleclick is done
      other: () => { return $.isEventDone(div2, 'doubleclick') }
    },
    
    // callback after removing the event
    callback: {
      drag: (e) => { log('removed drag event ' + e.type + ' ' + e.elem.id) },
      other: (e) => { log('removed event ' + e.elem.id + ' ' + e.type) },
    },
    
    // removing the event isn't actually removed natively since it uses touch event listeners behind the scene and we can't actually remove those event as other custom touch events will also be removed 
    // it is only simulated or replaced by the remove event callback
    // repeat = false, means the callback will be triggered once while repeat = true will keep triggering the callback
    delay: 500,
    repeat: {
      drag: false,
      zoomin: false,
      zoomout: false,
      other: true,
    }
    
  })
  
  
  // with $.chainEvent(), we can add a callback where if listed events are done consecutively, then it will trigger the callback
  // here the pattern is, div1 with type click first then div2 with type drag and div3 with doubleclick, then callback
  
  $.chainEvent([
    {
      element: div1,
      type: ['click']
    },
    {
      element: div2,
      type: ['slideright']
    },
    {
      element: div3,
      type: ['doubleclick']
    },
    
  ],
  {
    id: 'chain1',
    callback: () => { alert('3 events done') }
  })
  
  
  
  
})(Domator);