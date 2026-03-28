## AnimeJS Methods

### Example
  
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
  }
  )
  
```
 
**$.animate(element, config)**
  - Use to add animation 

Argument | Use
|---------|-----|
`element` | the element we want to add animation, should be a valid node or element
`config` | the config use in animation

### Options

`css` = we define here the css properties we want to animate where:
  
  `css_property = [start_value, end_value]`

so it will start animating the css property from `start_value` until it fills the gap to `end_value`

`config` = extra options for animation 

Options | Use | Default Value
|--------|-----|-------------|
duration | the duration for animation in ms | 400ms
delay | the delay for animation in ms | 10ms
easing | supported easing: `linear`, `ease-in`, `ease-out`, and `ease-in-out` | `linear`
repeat | the total loop for animation | 1
r_delay | a delay after each loop is finished animating so it will really reach the end_value | 10ms

`callback` = callback for each animation status, `before`, `during` and `after` animation 



