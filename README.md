# Introduction 

## DomatorJS

**DomatorJS** is a lightweight DOM utility library inspired by the simplicity of **jQuery** focused on practical DOM manipulation, extended node filtering, custom touch gesture handling and basic animation support.

It combines:

- DOM selection and filtering utilities

- Flexible event handling with support for multiple events and easy removal

- Custom touch gestures: `tap`, `doubleclick`, `longpress`, `drag`, `drop`, `slideright`, `slideleft`, `slideup`, `slidedown`, `zoomin`, `zoomout`

- A simple animation engine 

This project is built from scratch as a learning-driven framework to understand how core UI libraries work behind the scenes while keeping the API simple and practical.


## Features

  - Extended DOM selector and filtering methods

  - Multi-event binding and clean event removal

  - Built-in touch gesture system

  - Basic animation system

  - Chainable methods for cleaner usage


## Purpose

**DomatorJS** is designed to explore and demonstrate how DOM utilities, event systems, gesture handling, and animation engines can be built from the ground up without relying on large external frameworks.
## Installation

1. Download the `domator.js` source code [here](./dist/domator.js)

2. Include it in your html file:

```html

<script type="text/javascript" src="domator.js"></script>

```


# Usage Examples

## DOM Methods 

```js

$('h4')
  .ext('[@class=heading color=red /Hello World/]')
  .css({color: 'green'})
  .not()
  .each(x => {
    $(x).css({color: 'red'})
  })
  
```


## Event Handling

```js

// to attach an event

$.on(div1, {
  id: 'div1',
  click: (e) => { log(e.type) }
},
{
  remove: 'div1' // optional: use $.off() to remove
})


// to remove an event

$.off('div1', {
  condition: () => { return $.isEventDone(div1, 'click') }
  callback: (e) => { log('remove event ' + e.type) }
}


```


## Touch Gestures

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
    free: [50, 300, 50, 300], // drag limits
    callback: (e) => { log(e.type) }
  },
  drop: (e) => { log(e.type) },
  zoomin: {
    max: 3, // max scaling (default 4)
    callback: (e) => { log(e.type) }
  },
  zoomout: {
    max: 0.5, // max scaling (default 1)
    callback: (e) => { log(e.type) }
  }
})


```


## Animation

```js

const div1 = $('#div1').copy()
  
$.animate(div1, {
  css : {
    width : [100, 350],
    height: [100, 200]
  },
  config : {
    duration : 1000,
    delay : 500,
    easing : 'linear',
    repeat: 5,
    r_delay: 500 
  },
   callback: {
    before: () => { log('before') },
    during: () => {log('during')},
    after: () => { log('after') }
  },  
})
  
```
 
## Documentation

For full details and tutorial, see the docs:

- [CoreJS](./docs/corejs.md)
- [EventJS](./docs/eventjs.md)
- [AnimeJS](./docs/animejs.md)

## File Structure 

```bash

.
├── README.md
├── demos
│   ├── anime.html
│   ├── anime_script.js
│   ├── core.html
│   ├── core_script.js
│   ├── event.html
│   ├── event_script.js
│   └── style.css
├── dist
│   └── domator.js
├── docs
│   ├── animejs.md
│   ├── corejs.md
│   └── eventjs.md
└── src
    └── domatorjs
        ├── anime.js
        ├── core.js
        ├── event.js
        └── utils.js

```

# License 
MIT LICENCE 
