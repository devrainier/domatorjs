# DomatorJS

**DomatorJS** is a lightweight yet powerful DOM utility library inspired by the simplicity of jQuery, built from scratch to explore how real DOM, event, gesture and animation systems work internally.

It focuses on **practical DOM manipulation**, **advanced node filtering**, **custom touch gesture handling** and a **simple animation engine**, all designed with a clean, chainable API.


## Why DomatorJS?

**DomatorJS** is not just a small helper library. It contains 40+ custom methods across:

- DOM selection and advanced filtering

- Flexible multi-event system with clean removal logic
 
- Built-in custom touch gesture engine

- Basic but extensible animation engine

- Chainable API for readable code

This project demonstrates how UI libraries can be engineered from the ground up **without external frameworks**.

## Installation 

1. Download the build file:

```bash

dist/domator.js

```

2. Include it in your HTML:

```html

<script type="text/javascript" src="domator.js"></script>

```

3. Wrap your code in an IIEF to use `$` just like in **jQuery**:

```js

(function($) {

  // your code here using $ namespace

})(Domator)


```


## Build Process

**DomatorJS** does not use any bundler or build tool.

The `dist/domator.js` file is a manually combined version of the source files:

- `core.js`
- `event.js`
- `anime.js`
- `utils.js`

This is intentionally done to keep the project transparent and easy to understand for learning purposes, showing how a library can be structured internally without relying on tools like Webpack or Rollup.

## Overview 

### DOM Methods

```js

  $('.div')
    .each((x, y) => {
      $(x)
        .css({'background-color': 'orange'})
        .append(`<h4 class="heading" style="color: red;">This is from div${++y}</h4>`)
    })
    .filter('#div1')
    .prepend('<h3 class="heading" id="hdiv1">Hello World</h3>')
    .node()
    .css({ color: 'green' })
  
  
  $('.div')
    .ext('>[@class=heading /Hello World/')
    .not()
    .each(x => {
      $(x).css({ color: 'blue' })
    })
  
 
```

### Event Handling 

```js

  // add an event
  
  $.on(div1, {
    id: 'div1',
    click: (e) => { log(e.type) }
  }, {
    remove: 'div1' // optional for $.off()
  })
  
  
  // remove an event
  
  $.off('div1', {
    condition: () => { return $.isEventDone(div1, 'click') },
    callback: (e) => { log('removed event: ' + e.type) },
    delay: 500,
    repeat: true,
  })
  
```


### Touch Gestures

```js

  $.on(div2, {
     tap: e => { log(e.type) },
     doubleclick: e => { log(e.type) },
     longpress: e => { log(e.type) },
     slideright: e => { log(e.type) },
     slideleft: e => { log(e.type) },
     slideup: e => { log(e.type) },
     slidedown: e => { log(e.type) },
     drag: {
       free: [50, 300, 50, 300],
       callback: e => { log(e.type) }
     },
     drop: (e) => { log(e.type) },
     zoomin: {
       max: 3,
       callback: e => { log(e.type) }
     },
     zoomout: {
       max: 0.5,
       callback: (e) => { log(e.type) }
     }
  })
  
```


### Animation Engine

```js

  const div1 = $('#div1').copy();
  
  $.animate(div1, {
    css: {
      width: [100, 350],
      height: [100, 200]
    },
    config: {
      duration: 1000,
      delay: 500,
      easing: 'linear',
      repeat: 5,
      r_delay: 500
    },
    callback: {
      before: () => log('before'),
      during: () => log('during'),
      after: () => log('after')
    }
  })
  
```


## CoreJS Methods

**For DOM Manipulation and Filtering**

Category | Methods
|---------|--------|
Inserters | `.append()`, `.prepend()`, `.after()`, `.before()`, .`replace()`, `.val()`, `.html()`, `.text()`
Filtering | `.filter()`, `.with()`, `.ext()`, `.not()`,  `.range()`, `.parent()`, `.children()`, `.siblings()`,  `.hasParent()`, `.hasChild()`, `.hasSibling()`, `.first()`, `.last()`, `.next()`, `.prev()`
Getters | `.copy()`, `.len()`, `.name()`, `.type()`, `.value()`, `.get()`, `.node()`
Utilities | `.clone()`, `.remove()`, `.attr()`, `.css()`, `.rcss()`, `.addClass()`


## EventJS Methods

**For Event Handling and Touch Gesture Support**

Category | Methods 
|--------|----------|
Add events | `.on()`
Remove events | `.off()`
Event chaining | .`chainEvent()`
Event Inspection | `.isEventDone()`, `.getEventList()`


## AnimeJS Methods

**For Animation Engine**

Features | Methods 
|--------|----------|
Animate css | `.animate()`


## Documentation

**For Full Details and Tutorials**

- [CoreJS](./docs/corejs.md)
- [EventJS](./docs/eventjs.md)
- [AnimeJS](./docs/animejs.md)


## Project Structure 

```bash

.
├── LICENSE
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
├── docs  // documentation
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

## License 

MIT License

