## CoreJS Methods

First, to use `$` like in **jQuery**, make sure to wrap your code in an IIFE:

```js

(function($) {
 
   // code here using $ namespace

})(Domator)

```

### Main Selector
**$(arg, filter)**

`arg` = for normal or default pattern use in `document.querySelectorAll` or `document. getElementsByTagName` as fallback 

`filter` = pattern for extended filtering

```js
// sample code

$('h4', '[@class=heading color=red /Hello World/]')

```

> this selects elements with `h4 tag` then through extended filtering it select element with `class = heading` with inline style `color = red` and `text = Hello World`


### DOM Inserters

**$.append(arg)** 
**$.prepend(arg)**
**$.before(arg)**
**$.after(arg)**

to insert element, html or text to current element

```js 

// for html
$('#div1').append('<h4>Hello World</h4>')

// for element and text
$('#div1').append({elem: 'h4'}).node().append({text: 'Hello World'})

```


**.node()**
  - to retrieve the node after inserting an html or element 
  - only use this after calling dom inserters


**.clone()**
  - to clone an element


**.remove()**
  - to remove an element


**.replace(arg)**
  - replaces the current element by html, element or text
  - no need to call `.node()` if the current element will be replaced by html or element 

```js

// sample code

const elem = $('#div1', '>[/Hello World/]').copy()

// using html
$(elem).replace('<h4>New Element</h4>')

// using element
$(elem).replace('#hdiv2')

// using text
$(elem).replace('This is a text')

```

> on `.replace('#hdiv2')` since our argument is a string , it will just use the main selector `$('#hdiv2')` then if the resulting element `isNode()`, it will be used as new element to replaced the previous element 


**.copy()**
  - to get the element
  - useful if we want to save the element after heavy filtering 

```js
// sample code

cons elem =  $('h4', '[@class=heading color=red /Hello World/]').copy()

```
> so here if we want to use the element we can just `$(elem)` instead of doing the heavy filtering again


**.get(n)**
  - useful especially if the current selected element is a NodeList or array


**.html(arg)**
  - shortcut for innerHTML


**.len()**
  - to get the length of elements


**.text(arg)**
  - if has argument, uses `element.innerText = arg`
else, returns `element.textContent`


**.val(arg)**
  - if has argument, set elements `value = arg`
else, returns `element.value`


**.name()**
  - returns `element.nodeName`


**.type()**
  - returns `element.nodeType`


**.value()**
  - returns `element.nodeValue`


**.each(func)**
  - just like `Array.forEach()`, you can use it if you wanna have something to do to each selected elements 

```js

// sample code

$('h4').each(x => {
   $(x).css({color: 'green'})
})

```

> this selects all h4 tag elements then set color to green


**.filter(arg)**
  - just like `Array.filter()`, you can use if you wanna filter the current elements
arg can be string, element or node or a function that returns true or false

if `arg` is string, it uses `$(arg)` selector then if `isNode()` match if any of current elements is equal to the element, also same with `arg = node`

if `arg` is function it test if any of elements meets the condition that the function has

```js

// sample code

// first it selects all elements with class heading then select an element with id = hdiv1
$('.heading').filter('#hdiv1')

// equivalent code using function 
$('.heading).filter(x => {
   return $(x).attr('id') === 'hdiv1'
})

```


### For Extended Filtering 

**.with(arg)**

```js

// sample code

$('h4').with({attr: 0, class: 'heading'}, {attr: 0, id: 'hh4'}, {css: 0, 'color': 'red'}, {text: /Hello World/})

```

this selects first all elements with `tag h4` then filter it then only select element with attributes (attr) `class = heading` and `id = hh4` and with inline style (css) `color = red` and with `text = 'Hello World'`

notice that for attributes we didn't combined it in a single object rather we define another and that's the proper pattern for multiple attributes even for css properties.

so do not do this pattern where there are 2 attributes in 1 object 

```js

.with({attr: 0, class: 'heading', id: 'hh4'}, {css: 0, 'color': 'red'}, {text: /Hello World/})

```

always define another object starting with `{attr: 0}` or `{css: 0}` for another attributes or css properties

with texts, you need always to define with regex
`{text: /regex pattern/optional_flag}`

also for css properties, if you don't have inline style then make sure the css value is also aligned with `getComputedStyle` result

so in case of color property 

instead of `{css: 0, color: red}`
you have to do it like `{css: 0, color: rgb(255, 0, 0,)}`

also `.with()` can return array of elements especially if there are multiple elements passed the filtering so if you wanna use it to avoid error use `.each()` to access each element or `.get(n)` if you wanna get single element 


**.ext(arg)**
  - the extended filtering use in `$(arg, filter)`

  - it just uses `.with()` for advanced filtering but uses string as argument then is handled by regex instead of duplicated long objects

```js

// sample code

// instead of from .with()

$('h4').with({attr: 0, class: 'heading'}, {attr: 0, id: 'hh4'}, {css: 0, 'color': 'red'}, {text: /Hello World/})

// we can make it like this with .ext()

$('[@class=heading @id=hh4 color=red /Hello World/]

```

> for attributes (with @ symbol)
`@class=heading, @id=hh4`
 
> for css (no @ symbol)
color=red

> for text (with /regex/flag pattern)
`/Hello World/ = text`

take note, since it uses `.with()` if you are matching with css properties and there's no inline style, you should also make the value match with `getComputedStyle` result 

`color=rgb(255, 0, 0)`

**symbol for extended filtering** which is added before the main pattern

Symbol | Use
|-----------|--------|
\> | selects current element children
< | selects current element parent/s
_ | selects current element sibling/s
\+ | selects all elements after current element
\- | selects all elements before current element

```js
sample code

$('div').ext('>[@class=heading @id=hh4 color=red /Hello World/]')

```

> this select first elements with div tags then get their `children (>)` then the main pattern that filters if any of children has `class = heading`, `id = hh4`, inline style `color = red` and with `text = 'Hello World'` then set the current element to children/child that passed the heavy filtering 


### Other Filtering Methods 

**.hasChild(arg)**
**.hasParent(arg)**
**.hassibling(arg)**

`arg` can be string or element passed on `$('#div1')`, can be an argument passed on `.with({attr: 0, id: 'div1')` or an argument passed on `.ext('[@id=div1]')`

then it becomes the element to be match 

```js
// sample code

// using extended filtering 

$('div').hasChild('[@class=heading /Hello World/]')

// using $() selector 
// $('div').hasChild('#hdiv1')

```

> it selects first all elements with `div tags` then get their children then if any of children has a `class = heading` and `text = Hello World`, it will update then the current element to a div element with children/child that is equals to element to be match

syntax for .hasParent(arg) and .hassibling(arg) is just same with .hasChild(arg)


**.range(direction, end position, escape or modulo)**

  - allows selecting all elements after or before current element, just like getting the siblings but start with current element.

 - also end position mean until this index only, end position can also be an element
with escape or modulo so we can skip elements depending on number 

Symbol | Use
|-----------|-------|
\+ | after current element 
\- | before current element

```js

// sample codes
$('#hdiv1').range('+', '#hdiv10', 2)

```

> it selects first an element with `id = hdiv1` then selects all elements after the current element but it skip 2 elements until it reach an element with an `id = hdiv10`


### Other DOM Methods 

**.first()**
  - selects the first element child


**.last()**
  - selects the last element child


**.next()**
  - selects the next element sibling


**.prev()**
  - selects the previous element sibling


**.parent(), .children() and .siblings()**
  - support multiple current element and return an array of parents, children or siblings elements from multiple current element 

```js

// sample code
$('div').children()

```

> this select first all elements with div tag then select theirs children 

also take note, that there should be atleast 1 element not currently selected when calling `.parent()`, `.sibling()` or `.children()` cause it will set the current element to null since there's no siblings left unselected 

like this one

`$('h4').siblings()`

it selects all elements with `h4 tags` but if elements siblings are also `h4`, it means there is no siblings left 

this also applies to filtering methods `.hasParent()`, `.hasChild()` and `.hassibling()`
always make sure there is atleast 1 element left before filtering 


**.css(arg)**
  - if has argument set css to current element 
else returns css values

```js

// sample code 

// to set css
$(elem).css({color: 'red'})

// to get css value
$(elem).css()

```


**.attr(arg)**
  - if has argument, set attributes to current element
else returns the attribute values

```js 

//sample codes

// to set attribute
$(elem).attr({id: 'div1})

// to get attribute
$(elem).attr()

```

Also both `.css()` and `.attr()` support multiple values

```js

// sample codes

// to set multiple css
$(elem).css({width: '200px', height: '200px'})

// this returns array 
$(elem).css('width height') 

```


**.rcss()**
  - to remove css from current element, also support multiple values 

```js

// sample code
$.rcss('width height')

```


**.addClass()**
to add class to current element, also support multiple class

```js
// to add classess
$(elem).addClass('heading h2')

```

### Chaining

You can also do chaining just like with jQuery as long as the method you use doesn't return a value

```js

$('div')
  .children()
  .each(x => {
    $(x).css({color: 'red'})
  })
  .filter(x => {
    return $(x).attr('id') === 'hdiv1'
  })
  .css({color: 'green'})

```
