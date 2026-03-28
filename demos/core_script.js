(function($) {
  
  /* DEMO for DomatorJS using core.js 
  // Demo includes related methods for manipulating the DOM
  * You can just uncomment those equivalent codes then comment the original codes
  * Also, you can comment the rest first to see how it was before applying those methods 
  */
  
  
  // filtering elements
  // select all elements with tag = div
  
  $('div')
    // apply filtering where id === 'div1' only
    .filter(x => {
      return x.getAttribute('id') === 'div1'
    })
    // apply css for filtered element
    .css({ 'background-color': 'blue' })
    // select the unfiltered elements 
    .not()
    // apply css to all unfiltered elements 
    .each(x => {
      $(x).css({ 'background-color': 'red' })
    })
  
  
  // we can also achieve the filtering using extended filtering
  // this is same with $.filter method, selects only element where id === 'div1'
  /*
  
  $('div', '[@id=div1]')
     .css({ 'background-color': 'blue' })
    // select the unfiltered elements 
    .not()
    // apply css to all unfiltered elements 
    .each(x => {
      $(x).css({ 'background-color': 'red' })
    })
    
  */
  
  
  // now here using the extended filtering

  /* supported syntax 
    > children //selects element children
    > parent //selects element parents
    _ siblings //selects element siblings
    + range('+') //selects all elements after current element
    - range('-') //selects all elements before current element
  */
  
  // this select first the element with id div1 then proceed to selecting its siblings represented by _ then only selects element with id = div2


  $('#div1', '_[@id=div2]')
    .css({ 'background-color': 'yellow' })
  
  
  
  // this extended filter you can actually add it on chaining using $.ext() 
  /*
  
  $('#div1')
    .ext('_[@id=div2]')
    .css({ 'background-color': 'yellow' })
    
  */
  
  // or if want more readable you can use a simpler filter $.with
  /*
  
  $('#div1')
   .siblings()
   .with({attr: 0, id: 'div2'})
   .css({'background-color': 'yellow'})
  
  */
  
  
  // with $.range, we can select element starting from current element to the element we specify, ex : #div3
  
  
  $('#div1')
    .range('+', '#div3')
    .each(x => {
      $(x).css({ 'background-color': 'orange' })
    })
  
  
  
  // to get element, use .copy() 
  const div1 = $('#div1').copy()
  
  // to append element, html or text
  
  
  $(div1)
    // here we append html string 
    .append('<h4 class="heading" id="h4">Hello World</h4>')
    .append('<h4 class="heading" id="hh4">Javascript</h4>')
    // now to access the html element we just appended, use .node()
    // $.node tho only access the last html element appended
    .node()
    // now we can apply css to html element
    .css({ color: 'red' })
  
  
  // without using .node() we have to manually select it
  // first using $.with
  /*
  
  $(div1)
    .children()
    .with({attr: 0, class: 'heading'}, {attr: 0, id: 'hh4'}, /Javascript/)
    .css({color : 'red'})
  
  */
  
  // now using the extended filter
  /*
  
  $(div1, '>[@class=heading, @id=hh4, /Javascript/]')
    .css({color : 'red'})
 
 */
  
  // equivalent code
  /*
  
  $(div1)
    // here we append only html element
    .append({elem: 'h4'})
    .node()
    .append({text: 'Hello World'})
    .attr({'class': 'heading', id: 'h4'})
    .parent()
    .append({elem : 'h4'})
    .node()
    .append({text : 'Javascript'})
    .attr({'class': 'heading', id: 'hh4'})
    .css({color : 'red'})
  
  */
  
  
  // to replace an element by an element or html or text
  
  
  const el = $(div2).append('<h4 class="heading" style="color: red">This is from div2</h4>').node().copy()
  
  // you can comment this first to see the original structure 
  
  // if the element will be replaced by an element or html, no need to call .node() if you want apply css cause $.replace automatically updates the current element if it's element or html 


  $(div2)
    .ext('>[@class=heading color=red /This is from div2/]')
    .replace('<h4 class="heading">Replaced by <b>HTML</b></h4>')
    .css({ color: 'green' })
  
  $(div1)
    .ext('>[/Javascript/]')
    .replace({ elem: el })
    .css({color : 'green'})
  
  $('#div3')
    .append({elem: 'h4'})
    .node()
    .append({text: 'This is div3'})
    .css({color: 'blue'})
    // now to replaced by html
    .replace('<h4>New element in div3</h4>')
    .css({color: 'green'})

  
  
  // $.children(), $.parent() and $.siblings() can also selects elements even the current element is a nodelist or array of elements
  // this selects all children from any element with div tag then apply new css

  $('div')
    .children()
    .each(x => {
      $(x).css({color: 'red'})
    }
    )
   
   
  //now here selects all h4 element parent then set background color to yellow
  
  $('h4')
    .parent()
    .each(x => {
      $(x).css({'background-color': 'yellow'})
    }
    )
    
    
  // with $.siblings() make sure that any siblings from current element is not included in current element or there should be at least 1 sibling not included in current element else it will return error
  // like this it will error since at first it selects all h4 elements then gets their siblings but since siblings are all in current element and we don't want duplication we just throw error
  
  /*
  $('h4')
    .siblings()
    .each(x => {
      $(x).css({color: 'blue'})
    })
  */  
    
  // so to fix for tha sake of this demo we can remove or replaced atleast 1 sibling listed on current element or you can just limit the selector like instead of selecting all h4 tags only select throught id or class or even use the extended filtering 
  
  
 $('#div1')
    .ext('>[/Hello World/]')
    .replace('<h3>Hello World</h3>')
    

  // now we can use $.siblings()
  $('h4')
    .siblings()
    .each(x => {
      $(x).css({color: 'blue'})
    })

    
  // Other filtering methods 
  // $.hasChild(), $.hasSiblings(), $.hasParent()
  // you can pass element, querySelector string, even same argument from with({att: 0, id: 'div1'}) or extended filtering '[@id=div1]'
  
  // here we first select elements with div tags then get their children then select only only a div element with attribute class = heading, with inline style color = red and with text 'This is from div2'
  

  $('div')
    .hasChild('[@class=heading, color=red, /This is from div2/]')
    .css({ 'background-color': 'orange' })
  
  
  // here we select first elements with h4 tags then get their parent then select only the h4 element with a parent with id = div3
  const h4 = $('h4').copy()
 
  $(h4)
    .hasParent('#div3')
    .css({color: 'green'})
    
  
  // here we select again select again elements with h4 tags then get their siblings then select only an element with text 'Hello World' then finally it removes the selected element by calling $.remove()


  $(h4)
    .hasSibling('[/Hello World/]')
    .css({color: 'green'})

  
  
})(Domator);