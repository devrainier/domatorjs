# CoreJS - DOM Utilities 

This module provides powerful DOM selection, filtering and manipulation methods for **DomatorJS**.


First, to use `$` like in **jQuery**, make sure to wrap your code in an IIFE:

```js

(function($) {
 
   // your code here using $ namespace

})(Domator)

```

> Note: `$` is internally just **Domator** wrapped inside an IIFE and aliased to `$`, so it returns **Domator**.


## Selector

Method | Use |
|----------|------| 
`$(arg, filter)` | Use to select an element, returns  Domator 

**Supported Argument**: `arg`

Argument Type | Description | Sample Argument 
|------------------|----------------|----------------------|
`'string'` |  for normal selector, uses `document.querySelectorAll(arg)` internally and uses `document.getElementsByTagName(arg)` as fallback | `$('#div1')`

**Supported Argument**: `filter` = `optional`

Argument Type | Description | Sample Argument 
-------------------|----------------|----------------------|
`'string'` | use for extended filtering | `'>[@class=heading /Hello World/]'`

#### Example
```js

$('h4', '[@class=heading color=red /Hello World/]')

```

> First, it selects elements with `TAG = h4`. Then, using the extended filtering, it select element with `CLASS = heading` with inline style `color = red` and `TEXT = Hello World`

## Inserters

Methods | Use
|-----------|------|
`.append(arg)` | appends childNode |
`.prepend(arg)` | prepends childNode |
`.before(arg)` | inserts node before element |
`.after(arg)` | inserts node after element |


**Supported Argument**: `arg`


Argument Type | Description | Sample Argument
|------------------|----------------|----------------------|
`'html string'` | inserts html | `'<h1>Hello World</h1>'`
`{elem: 'html tag' }` | inserts a node | `{elem: 'h1'}`
`{text: "text"}` | inserts a text | `{text: 'Hello World'}`

#### Example

```js 

// arg type = html string

$('#div1')
  .append('<h4>Hello World</h4>')

// arg type = node and text

$('#div1')
  .append({elem: 'h4'})
  .node()  // to access the h4 element 
  .append({text: 'Hello World'})
 
```

> Both examples will append an element with `TAG = h4` and `TEXT = 'Hello World'` to an element with `ID = div1`


## Other Inserters Methods

Method | Use
|----------|-----|
`.replace(arg)` | to replace the current selected element


**Supported Argument**: `arg`


Argument Type | Description | Sample Argument 
|-------------------|---------------|-----------------------|
`'html string'` | replaced by html | `'<h1>New Element</h1>'`
`{elem: valid_node}` | replaced by a node | `{elem: div1}`
`{text: "text"}` | replaced by a text | `{text: 'New Element'}`

#### Example

```js 

// arg type = html string

$('#div1')
  .replace('<h4>This is div1</h4>')

// arg type = valid node

const hdiv1 = $('#hdiv1').copy()

$('#div1')
  .replace({elem: hdiv1})

// arg type = text

$('#div1')
  .replace({text: 'This is div1'})

 
```

> First example, uses html string to replace the element with `ID = div1`. 

> Second example, `ELEMENT = '#div1'` is replaced by a valid node or `ELEMENT = '#hdiv1'`. Take note, since it uses an element which is already available on `DOM`, it will just take the position of the element you want to be replaced. 

> Third example, `ELEMENT = '#div1'` is replaced by text.


Methods | Use
|-----------|------|
`.val(arg)` | if `arg` sets element's `value = arg`, else returns element's value
`.html(arg)` | uses `element.innerHTML = arg`
`.text(arg)` | if `arg` uses `element.innerText = arg`, else returns text content


## Filtering

Method | Use
|----------|-----|
`.filter(arg)` | like `Array.filter()`, use to filter elements

**Supported Argument**: `arg`

Argument Type | Description | Sample Argument 
|-------------------|---------------|-----------------------|
`'string'` | filters elements using `$('arg')` selector | `.filter('#div1')`
`valid node` | filters elements using `$(node)` selector | `.filter(div1)`
`function` | filters elements using `function` that returns `true` or `false` | `.filter(x => { return x.getAttribute('id') === 'div1' })`


#### Example

```js

$('.heading').filter('#hdiv1')

// equivalent code using function 
$('.heading).filter(x => {
   return $(x).attr('id') === 'hdiv1'
})

```

> First it selects all elements with `class = heading` then then it selects an element with `ID = hdiv1`


Method | Use
|----------|-----|
`.not()` | selects the excluded elements during filtering or extended filtering


#### Example

```js

$('h4')
  .filter('#hdiv1')
  .css({color: 'green'})
  .not()
  .each(x => {
    $(x).css({color: 'blue'})
  })

```

> In our example, it selects first the elements with `TAG = h4` then it uses `.filter()` to select an element with an `ID = hdiv1` then after selecting that element, we applied css property `color = green`. 

> Now, it uses `.not()` to select the excluded elements during filtering (where we select only the `ELEMENT = hdiv1`), so our current element are the remaining elements with `TAG = h4`. Then, we use `.each() to access each element and we apply css property `color = blue`.


Methods | Use
|-----------|------|
`.parent()` | selects element's parent node/s
`.children()` | selects element's child node/s
`.siblings()` | selects element's sibling node/s


### Example

```js

$(`.div`).children()

```

> In our example, it selects first elements with `class = div`. Now, we select their child nodea using `.children()`.

> Take Note: There should be atleast 1 element not yet in current selected elements before using `.parent()`, `.children()` and `.siblings()`. 


### Example (Do NOT Do This)

**HTML File**

```html

<div><h4>This is from div1</div>
<div><h4>This is from div2</div>
<div><h4>This is from div3</div>

```

**Script**

```js

$('h4').siblings()

```

> So, in our example it selects all elements with `TAG = h4` then it uses `.siblings()` to select it's siblings. But, in our html file, there are only 3 elements with `TAG = h4` and they are child nodes of `ELEMENT = div`. Since all elements with `TAG = h4` is currently selected and there is no siblings left, element's value will be `NULL`.


Method | Use
|----------|--------|
`.range(direction, end, skip)` | use to include siblings to the selected elements array

**Supported Argument**: `direction`

Argument Type | Description | Sample Argument 
|------------------|----------------|-----------------------|
`'string'` = `'+'` | includes sibling/s after current element | `.range('+')`
`'string'` = `'+` | includes sibling/s before current element | `.range('-')`

**Supported Argument**: `end`

Argument Type | Description | Sample Argument 
|-------------------|---------------|-----------------------|
`number` | selection until `siblings[end]` | `.range('+', 5)`
`'string'` | selection until the resulting sibling in selector `$(arg)` | `.range('+', '#div5')`

**Supported Argument**: `skip`

Argument Type | Description | Sample Argument 
|-------------------|---------------|-----------------------|
`number` | use to skip siblings | `.range('+', '#div6', 2)`


#### Example

```js

  $('#div1')
    .range('+', '#div6', 2)
    .each(x => {
      $(x).css({ 'background-color': 'orange' })
    })
    .not()
    .each(x => {
      $(x).css({ 'background-color': 'blue' })
  })

```

> Here, we first select `ELEMENT = #div1`. Then we use `.range()` to include sibblings after current element `+` until only the sibling with `ID = div6`, skipping `2 siblings` during selection.

> Then to access each element, we use `.each()` to apply css property. We also use `.not()` to access those skipped siblings .Again, we use `.each()` to apply css property to those unselected or skipped `siblings`.

> Take Note: You can only use `.not()` after `.range()` if you use the `skip option` or else element will have a value of `NULL`.


Method | Use
|----------|------|
`.first()`| to select element's first child node 
`.last()` | to select element's last child node
`.next()` | to select element's next sibling 
`.prev()` | to select element's previous sibling


#### Example

```js

  $('#div1').first()

```

> Here, it selects `ELEMENT = #div1` first child node.


## Extended Filtering 

Method | Use
|----------|------|
`.with(...args)` | Use for extended filtering of elements 

**Supported Argument**: `args` = `Object { key: value }`

Argument Pattern | Description 
|----------------------|---------------|
`{attr: 0, 'class': 'div'}` | for filtering elements through attributes |
`{css: 0, color: 'red'}` | for filtering elements through css properties 
`{text: /Hello World/}` | for filtering elements using regex to match for text contents

#### Example

```js

$('h4')
    .with({attr: 0, class: 'heading'}, {text: /Javascript/})
    .css({color : 'red'})
  
```

> Here, it selects first elements with `TAG = h4` then it uses `.with()` to filter or select only the element with attribute of `class = heading` and with text contents that exactly match the regex pattern `/Javascript/. Lastly, it applies css property to resulting element

> Take Note: If you wanted to add more attributes and css properties, you should always define new object: `{attr: 0}` for attributes while `{css: 0}` for css properties. For regex, you can also apply `regex flags`.

```js

// If using multiple attributes and css properties
// Also with regex flag

$('div')
    .with({attr: 0, class: 'div'}, {attr: 0, id: 'div1'}, 
{css: 0, 'background-color': 'red'}, {text: /javascript/i})
    .css({'background-color' : 'green'})

```

> Also, when using css properties inside `.with()` and the element does not have inline style, the value you pass must match the result from getComputedStyle(element)[css_property]

So for the color property:

Instead of: `{css: 0, color: 'red'}`

Make it like this: `{css: 0, color: 'rgb(255, 0, 0)'}`


Method | Use
|----------|------|
`.ext(arg)` | use for regex-based extended filtering

> This is also the method used in `$(arg, filter)` when filter argument is available. So if you want shorter codes, use `.ext(arg)` argument to `$(arg, ext_argument)`.

**Supported Argument**: `arg` = `'string'`

Argument Pattern | Description | Sample
|----------------------|---------------|----------|
`'@attr_name=value'` | for filtering elements through attributes, uses `@` symbol | `'@class=div'`
`'css_property=value'` | for filtering elements through css properties, don't use `@` symbol | `'color=red'`
`'/regex_pattern/regex_flag'` | for filtering elements through regex pattern to match for text contents | `'/javascript/i'`


**Supported Symbols Before Main Pattern**

Symbol | Use
|---------|--------|
`'>'` | uses `.children()` internally to select element's children
`'<'` | uses `.parent()` internally to select element's parent/s
`'_'` | uses `.siblings()` internally to element's sibling/s
`'+'` | uses `.range('+')` internally to include siblings after current element
`'-'` | uses `.range('-')` internally to include element's sibling/s


#### Example

```js

$('.div')
  .ext('>[@class=heading color=red /javascript/i]')
  .css({color: 'green'})

// equivalent code using $(arg, ext_argument) selector

$('.div', '>[@class=heading color=red /javascript/i]')
  .css({color: 'green'})


```

**Main Pattern**: `'[@class=heading color=red /javascript/i]'`

**Symbol**: `'>'` 

> Based on our example, it select first all elements with `class = div`. Now, we use `.ext()` to:

  > 1. select elements' children cause we use `>` symbol
  > 2. then from children, we select elements with an attribute of `class = heading`
  > 3. from elements with `class = heading`, we only selected elements with css property `color = red`
  > 4. finally from elements with `color = red`, we selected only the element that match our regex pattern `/javascript/i`

> Take Note: Since it also use `.with()` internally, you should also apply the rule with css properties where we  must use the exact result from `getComputedStyle(element)[css_property]` as css value.


## Other Filtering Methods 

Methods below are used to select an element only if it has a parent, child or sibling that matches the resulting element/s from selector `$(arg)` or extended filtering methods `.with(...args)` and `.ext(arg)`

Methods | Use
|-----------|-------|
`.hasParent(arg)` | selects an element only if it has a parent that matches the resulting element
`.hasChild(arg)` | selects an element only if it has a child that matches the resulting element
`.hasSibling(arg)` | selects an element only if it has a sibling that matches the resulting element

**Supported Argument**: `arg`

Argument Pattern | Description 
|----------------------|---------------|
`'#div1'` | uses `$(arg)` then if is a valid node, used as the element to be matched by parents, children and sibblings 
`'[@id=div1]'` | use `.ext('arg')` then if is a valid node, used as the element to be matched by parents, children and sibblings
`{attr: 0, id: 'div1'}` | uses `.with(...arg)` then if is a valid node, used as the element to be matched by parents, children and sibblings


#### Example

```js

// using $(arg) selector

$('div').hasChild('#hdiv1')

// using $.with(...args) 

$('div).hasChild({attr: 0, 'class': 'heading'}, {text: /hello world/i})

// using $.ext(arg)

$('div').hasChild('[@class=heading /hello world/i]')

```

> On first example, it selects first elements with `TAG = div` then by using `.hasChild()` we then select their children. Our argument type is `string` so it uses `$(arg)` selector and if is a valid node, it will be the element to be matched. So here, it's an element with `ID = hdiv1`. Now, it filters the children until it matches the element with `ID = hdiv1` then if it's same or has matches, it then returns the parent who has the exact child (a child with `ID = hdiv1`). 

> On second and third example, the element to be match is the child with `class = heading` and `text = 'hello world'` (it can be 'Hello World' since we set a regex flag `i` which mean case-insensitive

> Take Note: Since internally it also uses `.parent()`, `.children()` and `.siblings()`, we should also follow the rules where there must be atleast 1 unselected element or an element haven't used in `$(arg)` selector or simply does not belong to current element.


## Getters

Methods | Use
|-----------|-------|
`.copy()` | returns the element 
`.len()` | returns the elements' length 
`.name()` | returns element's `nodeName`
`.type()` | returns element's `nodeType`
`.value()` | returns element's `nodeValue`
`.get(n)` | if has argument, selects elements[n], else just selects current element
`.node()` | retrieves the node after inserting an html or element using `.append()`, `.prepend()`, `.after()` and `.before()`


#### Example

```js

$('#div1')
  .append('<h4>Hello World</h4>')
  .node()
  .css({color: 'green'})

```

> Here it appends html to element with an `ID = div1` then we access its node to set a css property to the html element we just added

> Take Note: `.node()` only updates the element, does not return a value and don't use this other than dom inserter methods listed above


## Utilities 

Methods | Use
|----------|------|
`.clone()` | use to clone a node 
`.remove()` | use to remove a node 
`.attr(arg)` | if argument is an object `{'class': 'heading'}`, sets atribute else returns attribute
`.css(arg)` | if argument is an object `{color: 'red'}` sets css property else returns css property
`.rcss(arg)` | removes css property
`.addClass(arg)` | adds attribute `class = arg`, doesn't overwrites existing classes


Methods that supports setting or removing of multiple attributes and css properties:

Sample | Description 
|---------|--------------|
`.attr({'class': 'heading', id: 'hdiv1'})` | this sets attributes `class` and `id`, just extend the object to set multiple attributes 
`.css({height: '100px', width: '100px'})` | this sets `height` and `width` css properties, just extend the object to set multiple css properties 
`.rcss('height width')` | this removes the css properties: `height` and `width`, just add space between properties to remove multiple css properties 


Methods that supports returning of multiple attributes and css property values:

Sample | Description 
|----------|---------------|
`.attr('class id')` | returns an array `[class, id]`, just add space between attribute names
`.css('height width')` | returns an array `[height, width]`, just add space between css property


#### Example

```js

$('#div1').attr('class') // returns the value of class

$('#div1').attr('class id') // returns an array [class_name, id_value]

```


## Chaining


Most methods are **chainable** as long as they don't return values, so you can run multiple operations together.

#### Example

```js
 
$('.div')
  .ext('>[@class=heading /Hello World/')
  .not()
  .each(x => {
    $(x).css({color: 'blue'})
  })
  
```



