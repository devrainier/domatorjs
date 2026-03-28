
## EventJS Methods 


### Add Event

**$.on(element, event_config, remove_event_config)**
  - use to add an event

`element` = the element or node where we will attach an event

`event_config` = handles both the type  and callback of event

`remove_event_config` = optional argument for event removal


```js

// simple $.on() format

$.on(elem, {
  click: (e) => { console.log(e.type) } 
})

```

> Based on code sample above, we attach event on elem with type = click with it's corresponding callback. Then after running this code, if we click on element, it should log 'click'

> Also the `e parameter` on callback is just an object passed on callback which is `{elem: element, type: event_type}` that's why we use `e.type` cause we want to log the event type


### Remove Event

**$.off(typeof_remove_event, remove_event_config)**
  - use to remove an event

`typeof_remove_event` =  can be an element or node, type of event (example: `click`) or custom id (example: 'div1')

`remove_event_config` = options for removing the event


**Supported remove event options**

`condition` = a function that returns true or false

if true, then the event will be removed
else false, keep the event from running

`callback` = a callback after successful event removal

`delay` = delay in callback, just uses `setTimeout`

`repeat` = option true or false

if true, it will keep the callback from running so even the event is remove, it will just replaced the original callback with remove event callback

if false, it will removed the event only if the type of event is native like `click` but with custom touch events it will not directly remove the event cause if we remove the event, other custom touch events will also be removed, thus we just set the callback to () => {}


**To use \$.off(), you need to add first { remove: typeof_remove_event } on \$.on()**

```js

const elem = $('#div1').copy()

$.on(elem, {
   click: (e) => { console.log(e.type) }
},
{
   remove: 'div1'
})

```

`remove` = if this option is available on `$.on()`, it means the remove event config will be provided by external event method $.off() 

**Now we can use $.off()**

```js

$.off('div1', {
  // the remove event config 
  condition: () => { return $.isEventDone(div1, 'click) },
  callback: (e) => { console.log('remove event' + e.type') },
  delay: 100,
  repeat: true
})

```

based on our code sample above

`typeof_remove_event` = `'div1'` which is a custom id, i suggest to use custom id over elements or nodes as it's not heavy, just a string use as a key

also on `$.on()`, you can also add `id: 'div1'` to make it clearer that this event has an id of 'div1' so if we will use `$.off()` later, it's clear that this is the remove event config for event with `id = div1`

```js
// sample code with id option

$.on(elem, {
  id: 'div1',
  click: func,
})

```

remove_event_config = {condition, callback, delay, repeat }

`condition` = uses $.isEventDone() to check whether an event with exact type is done. so here, it will remove the event if an event with element div1 with type click is already done

`callback` = just log remove event click


**Using $.on() with its optional remove_event_config argument to remove event**

```js

$.on(elem, {
   click: (e) => { console.log(e.type) }
},
{
  condition: () => { return $.isEventDone(div1, 'click) },
  callback: (e) => { console.log('remove event' + e.type') },
  delay: 100,
  repeat: true
})

```

> so here no need to use separate methods to remove an event, just add the remove event config


### MultiTouch Events

  - supports multiple touch events attach to a single element

```js

$.on(div2, {
      tap: (e) => { log(e.type) },
    doubleclick: (e) => { log(e.type) },
    longpress: (e) => { log(e.type) },
    slideright: (e) => { log(e.type) },
    slideleft: (e) => { log(e.type) },
    slideup: (e) => { log(e.type) },
    slidedown: (e) => { log(e.type) },
    drag: {
      free: [50, 300, 50, 300], // set limit for dragging, 
      callback: (e) => { log(e.type) }
    },
    drop: (e) => { log(e.type) },
    zoomin: {
      max: 3, // set max scaling to 3 default is 4
      callback: (e) => { log(e.type) }
    },
    zoomout: {
       max: 0.5, // set max scaling to 0.5 default is 1
      callback: (e) => { log(e.type) }
    }
  })
  
```

> here, div2 has all the supported custom touch events attached to it, which means depending on our gesture, it will trigger different callbacks


### Removing Events for MultiTouch Events

```js

// using the previous example, we just neee to add remove option first 

$.on(div2, {
      tap: (e) => { log(e.type) },
    doubleclick: (e) => { log(e.type) },
    longpress: (e) => { log(e.type) },
    slideright: (e) => { log(e.type) },
    slideleft: (e) => { log(e.type) },
    slideup: (e) => { log(e.type) },
    slidedown: (e) => { log(e.type) },
    drag: {
      free: [50, 300, 50, 300], // set limit for dragging, 
      callback: (e) => { log(e.type) }
    },
    drop: (e) => { log(e.type) },
    zoomin: {
      max: 3, // set max scaling to 3 default is 4
      callback: (e) => { log(e.type) }
    },
    zoomout: {
       max: 0.5, // set max scaling to 0.5 default is 1
      callback: (e) => { log(e.type) }
    }
  },
  {
   remove: 'div2'
  })


// then we can now define a remove event config using $.off()

  
  $.off("div3", {
    condition: {
      drag: () => { return $.isEventDone(div2, 'longpress') },
      other: () => { return $.isEventDone(div2, 'doubleclick') }
    },
    callback: {
      drag: (e) => { log('removed drag event ' + e.type + ' ' + e.elem.id) },
      other: (e) => { log('removed event ' + e.elem.id + ' ' + e.type) },
    },
    delay: 500,
    repeat: {
      drag: false,
      zoomin: false,
      zoomout: false,
      other: true,
    }
    
  })


```

First, we added `remove: 'div2'` on `$.on()` which means we will use the remove event config from external method `$.off()`. Now, on `$.off()`, you can see the condition is an object, with `drag` (a custom touch event type) and `other` as key with functions that returns true or false as values which supposed to be the value in condition not an object. 

Since we use multiple touch events, we can also handle each events in removing events and it's through using object type with event types as key and the condition as their values. 

Now, `condition.drag` the means condition it has will only work on event with type drag while `condition.other` means the condition it has will work on remaining event types. So in other words, to remove the drag event, we refer to `condition.drag` and for reaming types we refer to `condition.other`.

Same with callback, it's value is also an object which means, if the `condition.drag` is true we will call the `callback.drag` after removing the event and `callback.other` for reaming types.

Now, with delay it has a value of 500 which means this will be the delay for all use in remove event callback. But you can also use object as value if you want to handle each event type.

On option `repeat`, it's also an object wherein `repeat.drag`, `repeat.zoomin`, `repeat.zoomout` has a value of false, which mean for `drag`, `zoomin` and `zoomout` event types we don't want to keep the callback on running after event removal. 

Behind the scene, it doesn't actually remove the event since it's a custom touch events and we don't want other types to be removed as using `removeEventListener` will literally remove the touch event attached to the element. Also, we have `repeat.other = true` which means we want to keep the remove event callback from running.
 
    
### Chaining Events

- With event chaining, we can handle different events and attached a callback once we trigger each event callback in order
 
```js

// sample code

  $.chainEvent([
    {
      element: div1,
      type: ['click']
    },
    {
      element: div2,
      type: ['longpress']
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

```

So here, we use an array to include events we want to manage with `{element: your_element_or_node, type: [event_type]}` as the main pattern. For element key, make sure the value is literally an element or node and for type key, make sure you use an array for value since for 1 element we can also manage multiple event types especially for touch events. 

Also, we have a config that includes id and callback, as for id it's necessary you input a value.

The callback will only be trigger once the listed events with their event type is done consecutively. So, you must consider the way they are listed or arrange cause whether the callback will trigger depends on the order. 

In our code sample, it means  div1 with type click should be done first, then div2 with type longpress and div3 with type doubleclick to trigger the callback.


**$.isEventDone(element, event_type)**
  - use to check if an event with specific element and type is done
  - useful for removing events




