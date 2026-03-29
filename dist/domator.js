// utils.js


//runtime checkers
 
 function isArray(x) {
   return x instanceof Array;
 }
 
 function isBoolean(x) {
   return x === true || x === false;
 }
 
 function isObject(x) {
   return Object.prototype.toString.call(x) === '[object Object]';
 }
 
 function isAttribute(obj) {
   return isObject(obj) && 'attr' in obj;
 }
 
 function isCss(obj) {
   return isObject(obj) && 'css' in obj;
 }
 
 function isFunction(x) {
   return typeof x === 'function';
 }
 
 function isHTML(x) {
   return x instanceof HTMLElement;
 }
 
 function isHTMLCollection(x) {
   return x instanceof HTMLCollection || x instanceof NodeList;
 }
 
 function isHTMLString(x) {
   const div = document.createElement('div');
   div.innerHTML = x;
   
   return typeof x === 'string' && div.children.length > 0;
 }
 
 function isNode(x) {
   return (
     x instanceof Node ||
     (x && typeof x === 'object' && x[0] instanceof Node)
   );
 }
 
 function isNull(x) {
   return x === null || x === undefined;
 }
 
 function isNumber(x) {
   return typeof x === 'number' && !isNaN(x);
 }
 
 function isString(x) {
   return typeof x === 'string';
 }
 
 function isSVG(x) {
   return x instanceof SVGElement;
 }
 
 
  
  function isText(obj) {
    return isObject(obj) && 'text' in obj;
  }
  
 
 
 function loop(arr, fn) {
   let i = 0,
     len = arr.length,
     res = fn(arr[i], i);
   
   if (len > 1) {
     for (; i < len; i++) {
       res = fn(arr[i], i);
       if (res) return true;
     }
   }
   else {
     return res === true;
   }
   
 }
 
 
  
  function unwrapIfSingle(arg) {
    return arg.length === 1 ? arg[0] : arg;
  }
  
 
   function getcss(elem, css) {
    
    
    const data = [];
    let comp_style = window.getComputedStyle(elem);
    
    css.split(' ').forEach(x => {
      data.push(elem.style.getPropertyValue(x) || comp_style[x]);
    });
    
    return unwrapIfSingle(data);
  }
 
 
 function log(arg) {
   console.log(arg);
 }
 
 
 // core.js
 
 
 (function() {
  
  let _element;
  
  const _elem = {
    unfiltered: []
  };
  
  
  this.Domator = this.Domator ||
    function(elem, filter) {
      
      _element = $(elem);
      
      if (_element) {
        if (filter) {
          with_v2(filter)
        }
        return Domator;
      }
      else {
        throw new Error("ERROR: Invalid Element");
      }
    }
  
  
  const ns = this.Domator;
  
  
  function $(elem) {
    let data;
    elem = elem || _element;
    
    if (isArray(elem)) {
      data = collection(elem);
    } else {
      data = mainSelector(elem);
    }
    
    _element = data
    
    if (_element) return _element
    else {
      if (isString(elem)) {
        console.warn('WARNING: Passed arguments on $(arg) is ' + elem);
        console.warn('WARNING: $(arg) selector uses document.querySelectorAll so make sure to add # for id ex: #div1 or . for class ex: .div and just uses document.getElementsByTagName as fallback')
      }
      else if(isNull(elem)) {
        console.warn('WARNING: Element is Null')
      }
      else {
        console.warn('WARNING: No element matches on extended filter from $(arg, filter)')
      }
      
      throw new Error('ERROR: Invalid Element')
    }
  }
  
  
  function collection(elem) {
    const nodes = [],
      arr = extractArray([], elem);
    
    arr.forEach(el => {
      nodes.push(mainSelector(el));
    });
    
    return nodes;
  }
  
  
  function mainSelector(elem) {
    let doc;
    
    if (isHTML(elem) || isHTMLString(elem)) {
      return elem;
    }
    else if (isHTMLCollection(elem) || isArray(elem)) {
      doc = elem;
    }
    else if (isString(elem)) {
      if (doc = document.querySelectorAll(elem)) {
        try {
          if (doc[0].nodeName) {}
        } catch (e) {
          if (doc = document.getElementsByTagName(elem)) {}
        }
      }
    }
    
    return doc && doc[0] && unwrapIfSingle(extractCollection([], doc));
    
  }
  
  
  const inserter = {
    arg: null,
    html: null,
    text: null,
    node: null,
    pos: null
  }
  
  
  function mainInserter(arg, pos) {
    const elem = $(_element);
    arg = toArray(arg);
    
    let node;
    
    arg.forEach(x => {
      node = !isObject(x) && isNode($(x));
      
      switch (pos) {
        case 'beforeend':
          node ? elem.append(_element) : insertData(elem, x, 'beforeend');
          break;
        case 'afterbegin':
          node ? elem.prepend(_element) : insertData(elem, x, 'afterbegin');
          break;
        case 'afterend':
          node ? elem.after(_element) : insertData(elem, x, 'afterend');
          break;
        case 'beforebegin':
          node ? elem.before(_element) : insertData(elem, x, 'beforebegin');
          break;
      }
    })
    
    _element = elem;
    
    inserter.arg = arg;
    inserter.pos = pos;
  }
  
  
  ns.append = function(arg) {
    mainInserter(arg, 'beforeend');
    return this
  }
  
  ns.prepend = function(arg) {
    mainInserter(arg, 'afterbegin');
    return this
  }
  
  ns.after = function(arg) {
    mainInserter(arg, 'afterend');
    return this
  }
  
  ns.before = function(arg) {
    mainInserter(arg, 'beforebegin');
    return this
  }
  
  
  function insertData(elem, arg, pos) {
    //arg can be HTMLString, {text : str} or {elem : node}
    
    let node, text;
    
    if (isHTMLString(arg)) {
      elem.insertAdjacentHTML(pos, arg);
      inserter.html = arg;
    }
    else {
      
      if (node = arg.elem) {
        node = document.createElement(node);
        elem.insertAdjacentElement(pos, node);
        inserter.node = node;
      }
      else if (text = arg.text) {
        elem.insertAdjacentText(pos, text);
        inserter.text = text;
      }
      
    }
  }
  
  
  function getNode() {
    const arr = [];
    
    inserter.arg.forEach(x => {
      if (isHTMLString(x)) {
        arr.push(getNodeFromHtml());
      } else if (isObject(x)) {
        if (x.elem) {
          arr.push(inserter.node);
        }
      } else if (isNode(x)) {
        arr.push(x);
      }
    })
    
    _element = arr.length === 1 ? arr[0] : arr;
    
    return this;
  }
  
  
  ns.node = getNode;
  
  
  function getNodeFromHtml() {
    
    const filters = [];
    const attr = { attr: 0 };
    const css = { css: 0 };
    const txt = {};
    
    const html = inserter.html;
    const pos = inserter.pos;
    
    if (pos === 'beforeend' || pos === 'afterbegin') {
      children();
    }
    else {
      siblings();
    }
    
    const reg_text = /(?<=>)[^<]+/g;
    const reg_attr = /(?<=\s)\w+(-\w+)*="[^"]+"/g;
    const reg_key = /.+(?==")/;
    const reg_val = /(?<==")[^"]+/;
    
    const match_attr = html.match(reg_attr);
    const match_text = html.match(reg_text);
    
    let key, val;
    
    if (match_attr) {
      match_attr.forEach(x => {
        key = x.match(reg_key)[0]
        val = x.match(reg_val)[0]
        attr[key] = val;
        
        filters.push({ ...attr })
      })
    }
    
    if (match_text) {
      txt.text = new RegExp(match_text.join(''));
      filters.push({ ...txt })
    }
    
    
    with_(...filters)
    
    return _element;
  }
  
  
  ns.clone = function() {
    _element = $(_element).cloneNode(true);
    return this;
  }
  
  
  ns.remove = function() {
    $(_element).remove();
    return this;
  }
  
  
  function replace(arg) {
    //arg can be HTMLString, or {elem : element } || {text : 'your text'}
    
    const elem = $(_element);
    let new_val;
    
    let node, text;
    let pos;
    
    if (isHTMLString(arg)) {
      new_val = this.parent().append(arg).node().copy();
      
      // since .node() uses .with() it can also return many elements especially if the html string don't have any attributes and has same text content with others
      // thus we need to determine the position of elem then add 1 since it's always next to the current element cause we just use append method 
      
      pos = isArray(new_val) && new_val.indexOf(elem)
      
      new_val = isNumber(pos) ? new_val[pos+1] : new_val
    }
    else {
      if (node = arg.elem) {
        new_val = isNode($(node)) && _element
      }
      else if (text = arg.text) {
        new_val = text
      }
    }
    
    elem.replaceWith(new_val);
    _element = isNode(new_val) ? new_val : elem
    
    return this;
  }
  
  
  ns.replace = replace;
  
  
  ns.copy = function() {
    return _element;
  }
  
  
  ns.get = function(n) {
    
    if (arguments.length === 0) {
      _element = $(_element)
    } else {
      _element = $(_element)[n]
    }
    
    return this;
  }
  
  
  ns.html = function(arg) {
    $(_element).innerHTML = arg;
    return this;
  }
  
  
  ns.len = function() {
    return $(_element).length;
  }
  
  
  ns.text = function(data) {
    const elem = $(_element);
    
    if (arguments.length === 0) {
      
      if (elem.textContent !== '' || elem.firstChild.nodeValue !== '' || textData !== '') {
        return elem.textContent || elem.firstChild.nodeValue || textData;
      }
      
    }
    
    elem.innerText = data;
    
    return this;
  }
  
  
  ns.val = function(data) {
    if (arguments.length == 0) {
      return $(_element).value;
    }
    else {
      $(_element).value = data;
    }
  }
  
  
  ns.name = function() {
    return $(_element).nodeName;
  }
  
  ns.type = function() {
    return $(_element).nodeType;
  }
  
  ns.value = function() {
    return $(_element).nodeValue;
  }
  
  
  function each(func) {
    const arr = toArray($(_element));
    
    each_(arr, func);
    
    // here we assign _element to arr to go back to the elements we have before .each() cause if we use $(arg) inside .each(), it instanly update the _element
    
    _element = arr
    
    return this;
  }
  
  
  function filter(arg, type) {
    const elem = toArray($(_element));
    
    // if type is given, then don't reset the _elem.unfiltered 
    
    // cause if we don't reset it, there could be lots of unfiltered elements when calling .not() especially if we use .filter() before as it automatically collects unfiltered elements
    
    // also we, don't reset it if type is given, cause it means it's used by extended filtering which filters attributes, css properties and textContent, thus when we call .not() we still have complete list of unfiltered elements
    
    if(isNull(type)){
      _elem.unfiltered = []
    }
    
    let res;
    
    if (isFunction(arg)) {
      res = filter_(elem, arg);
    }
    else if (isString(arg) || isNode(arg)) {
      const node = $(arg);
      const isNodeArray = isArray(node);
      
      res = filter_(elem, x => {

        if (isNodeArray) {
          return node.includes(x);
        }
        return x === node;
      })
      
    }
    
    const { filtered, unfiltered } = res;
    
    unfiltered.length && _elem.unfiltered.push(unwrapIfSingle(unfiltered));
    
    if (filtered.length) {
      _element = unwrapIfSingle(filtered);
      return this;
    } else {
      return false;
    }
    
  }
  
  
  function with_(...args) {
    /*
    * this allows for filtering attributes, css properties even texts
    * sample format
    
      $.with({attr: 0, class : 'div'}, {css : 0, 'background-color' : 'red', /Hello World/)
    
    * if there's multiple attributes or css you need also to define another attr and css
    
      $.with({attr: 0, class: 'div'}, {attr: 0, id: 'div1'}, {css: 0, color: 'red'}, {css: 0, 'background-color': '100px'})
      
    */
    
    let filtered;
    
    // empty first _elem.unfiltered 
    
    _elem.unfiltered = []
    
    args.forEach(x => {
      filtered = _element;
      
      if (isAttribute(x)) {
        _element = filteringAttribute(filtered, x);
      }
      else if (isCss(x)) {
        _element = filteringCss(filtered, x);
      }
      else if (isText(x)) {
        _element = filteringText(filtered, x);
      }
      
      
    })
    
    if (_element) return this;
    else {
      console.warn('WARNING: No element matches on extended filter $.with()');
      throw new Error('ERROR: Element Not Found');
    }
    
  }
  
  
  function with_v2(arg) {
    
    const filters = [];
    let key, value;
    
    const regex = /@?\w+(-\w+)*(?==\w+-*)=\w+(-?\w+)*(\(((\d+.?\d*),?\s?)+\))?|\/(?<=\/).+/g;
    
    const match = arg.match(regex);
    
    const reg_sym = /(?<!.+)[><_+-](?=\[)/g;
    const sym = arg.match(reg_sym);
    const symbol = sym ? sym[0][0] : null;
    
    const attr = { attr: 0 };
    const css = { css: 0 };
    const txt = {};
    
    if (symbol) {
      
      switch (symbol) {
        case '<':
          parent();
          break;
        case '>':
          children();
          break;
        case '_':
          siblings();
          break;
        case '+':
          range('+');
          break;
        case '-':
          range('-');
          break;
      }
    }
    
    const reg_key = /.+(?==)/;
    const reg_val = /(?<==).+/;
    const reg_attr = /@/;
    
    const reg_text = /(?<=\/).+(?=\/[gimsuy]*)/g;
    const reg_flag = /(?<=.+\/)[gimsuy]*((?=\](?!.+))|(?!.+))/g
    
    if (isNull(match)) {
      console.warn('WARNING: Passed argument on extended filtering is ' + arg)
      console.warn('WARNING: Sample format : [@class=div, color=red, /Hello World/gi], @attr or css should always go first than /regex pattern/')
      throw new Error('ERROR: Invalid Argument')
    }
    
    match.forEach(x => {
      if (/=/.test(x)) {
        
        key = x.match(reg_key)[0];
        value = x.match(reg_val)[0];
        
        if (reg_attr.test(key)) {
          
          filters.push({
            ...attr, [key.replace('@', '')]: value
          });
        }
        else {
          filters.push({ ...css, [key]: value });
        }
        
      }
      else {
        txt.text = new RegExp(x.match(reg_text)[0], x.match(reg_flag)[0])
        filters.push(txt)
      }
    })
    
    const res = with_(...filters);
    
    if (res) return this;
    else {
      console.warn('WARNING: No element matches on extended filter $._()');
      throw new Error('ERROR: Element Not Found');
    }
    
  }
  
  
  ns.with = with_;
  ns.ext = with_v2;
  
  
  function filteringAttribute(node, attr) {
    
    return to_filter(node, attr, 'attr', (el, attr_key, attr_val) => {
      return el.getAttribute(attr_key) === attr_val;
    })
  }
  
  
  // intended to work only for inline style cause if we use computed style we also need to add more complex regex matching
  function filteringCss(node,
    css) {
    
    return to_filter(node, css, 'css', (el, css_key, css_val) => {
      return el.style.getPropertyValue(css_key) === css_val || getComputedStyle(el)[css_key] === css_val
    });
    
  }
  
  
  function filteringText(node,
    txt) {
    
    return to_filter(node, txt, 'text', el => {
      //only el since it's {text.regex}
      //ex: {text : /Hello/}
      return txt.text.test(el.textContent)
    });
    
  }
  
  
  function to_filter(node, type, type_in_str, func) {
    let res;
    
    res = filter(x => {
      if (isNode(x)) {
        
        for (const [k, v] of Object.entries(type)) {
          //since the type is in form of object {attr : 0} or {css : 0} so it needs not to enter the filter hanlder
          if (k !== type_in_str || k === 'text') {
            return func(x, k, v) === true
          }
        }
        
      }
    }, type_in_str);
    
    if (res) {
      return _element;
    }
    else {
      _element = null;
      return false;
    }
    
  }
  
  
  ns.hasParent = function(...arg) {
    const res = filteringThroughElement('parent', ...arg);
    
    if (res) return this;
    else return false;
  }
  
  
  ns.hasChild = function(...arg) {
    const res = filteringThroughElement('child', ...arg);
    
    if (res) return this;
    else return false;
  }
  
  
  ns.hasSibling = function(...arg) {
    
    const res = filteringThroughElement('sibling', ...arg);
    
    if (res) return this;
    else return false;
  }
  
  
  function filteringThroughElement(type_of_elem, ...arg) {
    
    let elem_to_match, elem_to_test;
    let match
    
    const type = Object.create(null);
    type.parent = parent;
    type.child = children;
    type.sibling = siblings;
    
    const elem = $(_element)
    
    type[type_of_elem]();
    
    try {
      
      if (isString(arg[0])) {
        if (/\[.+\]/.test(arg[0])) {
          with_v2(arg[0])
        }
        else {
          $(arg[0])
        }
      }
      else if (typeof(arg[0]) === 'object') {
        with_(...arg);
      }
      
      elem_to_match = _element
    }
    catch (e) {
      console.warn('WARNING: Element to match is null on $.hasParent(), $.hasChild() or $.hassiblings()')
      throw new Error('ERROR: Invalid Element')
    }
    
    _element = elem
    
    const res = filter((x) => {
      _element = x;
      type[type_of_elem]();
      elem_to_test = toArray(_element);
      
      res2 = loop(elem_to_test, x => {
        
        if (isArray(elem_to_match)) {
          if (elem_to_match.includes(x)) {
            return true;
          }
        }
        else {
        
          if (x === elem_to_match) {
            return true;
          }
        }
      });
      
      return res2 === true;
      
    })
    
    if (res) return _element;
    else return false;
    
  }
  
  
  function retrieveUnfilteredElems(...arg) {
    _elem.unfiltered = extractArray([], _elem.unfiltered);
    
    _element = $(_elem.unfiltered)
    
    _element = _element.length === 0 ? null : _element
    
    _elem.unfiltered = [];
    
    return this
  }
  
  
  function range(...arg) {
    const resulting_element = [];
    const main_elem = $(_element);
    
    _element = main_elem.parentElement;
    _elem.unfiltered = [];
    children();
    
    const siblings = _element;
    
    const len = siblings.length - 1;
    const esc = arg[2] || 1;
    
    let start = siblings.indexOf(main_elem);
    let end = arg[1];
    
    end = isNode($(end)) ? siblings.indexOf(_element) : end;
    
    if (arg[0] === '+') {
      --start;
      end = end < 0 ? len : end;
      
      while (start++ < end) {
        
        if (start % esc === 0) {
          resulting_element.push(siblings[start]);
        }
        else {
          if (esc > 1) {
            _elem.unfiltered.push(siblings[start]);
          }
        }
        
      }
    }
    
    else if (arg[0] === '-') {
      ++start;
      end = end < 0 ? 0 : end;
      
      while (start-- > end) {
        
        if (start % esc === 0) {
          resulting_element.push(siblings[start]);
        }
        else {
          if (esc > 1) {
            _elem.unfiltered.push(siblings[start]);
          }
        }
        
      }
    }
    
    _element = resulting_element;
    
    
    return this;
  }
  
  
  ns.first = function() {
    _element = $(_element).firstElementChild;
    return this;
  }
  
  
  ns.last = function() {
    _element = $(_element).lastElementChild;
    return this;
  }
  
  
  ns.next = function() {
    _element = $(_element).nextElementSibling;
    return this;
  }
  
  
  ns.prev = function() {
    _element = $(_element).previousElementSibling;
    return this;
  }
  
  
  function parent() {
    getElements('parent');
    return this;
  }
  
  
  function children() {
    getElements('children');
    return this;
  }
  
  
  function siblings() {
    getElements('siblings');
    return this;
  }
  
  
  function getElements(type_of_elem) {
    const nodes = [],
      parents = [];
    
    const elem = toArray($(_element));
    
    let node, parent;
    
    elem.forEach(x => {
      
      if (type_of_elem === 'parent') {
        node = x.parentElement;
        
        if (!nodes.includes(node)) {
          nodes.push(node)
        }
      }
      else if (type_of_elem === 'children') {
        node = Array.from(x.children);
        
        if (!containsAll(node, nodes)) {
          nodes.push(node);
        }
      }
      else if (type_of_elem === 'siblings') {
        parent = x.parentElement;
        
        if (!parents.includes(parent)) {
          const children = Array.from(parent.children);
          
          children.forEach(x => {
            if (!elem.includes(x)) {
              nodes.push(x)
            }
          })
          
          parents.push(parent);
        }
        
      }
      
      
    })
    
    const res = extractCollection([], nodes);
    
    res.length ? _element = unwrapIfSingle(res) : _element = null;
    
  }
  
  ns.range = range;
  ns.each = each;
  ns.filter = filter;
  ns.not = retrieveUnfilteredElems;
  ns.parent = parent;
  ns.children = children;
  ns.siblings = siblings;
  
  
  // attributes, css, class
  
  function setAttr(attr) {
    $(_element);
    
    for (const [key, val] of Object.entries(attr)) {
      _element.setAttribute(key, val);
    }
    
    return ns
  }
  
  
  function getAttr(attr) {
    const data = [];
    
    $(_element);
    
    attr.split(' ').forEach(x => {
      data.push(_element.getAttribute(x));
    });
    
    return unwrapIfSingle(data);
  }
  
  
  function removeAttr(attr) {
    $(_element);
    
    attr.split(' ').forEach(x => {
      _element.removeAttribute(x);
    });
    
    return this;
  }
  
  
  
  function setCss(css) {
    $(_element);
    
    for (const [key, val] of Object.entries(css)) {
      _element.style[key] = val;
    }
    
    return ns
    
  }
  
  
  function getCss(css) {
    $(_element);
    
    const data = [];
    let comp_style = getComputedStyle(_element);
    
    css.split(' ').forEach(x => {
      data.push(_element.style.getPropertyValue(x) || comp_style[x]);
    });
    
    return unwrapIfSingle(data);
  }
  
  
  function removeCss(css) {
    $(_element);
    
    css.split(' ').forEach(x => {
      _element.style.removeProperty(x);
    });
    
    return this;
  }
  
  
  function addClass(class_to_add) {
    setAttr({
      'class': getAttr('class') + ' ' + class_to_add
    });
    
    return this;
  }
  
  
  ns.attr = function(arg) {
    if (isString(arg)) {
      return getAttr(arg);
    }
    else {
      return setAttr(arg);
    }
  }
  
  
  ns.css = function(arg) {
    if (isString(arg)) {
      return getCss(arg);
    }
    else {
      return setCss(arg);
    }
  }
  
  
  ns.rcss = removeCss;
  ns.addClass = addClass;
  
  
  // utilities 
  
  function containsAll(arr1, arr2) {
    return arr1.every(x => arr2.includes(x))
  }
  
  
  function delete_(arr, pos) {
    let data = arr.splice(pos + 1);
    
    if (pos > 0) {
      data = arr.splice(0, pos).concat(data);
    }
    
    return data;
  }
  
  
  function each_(arr, fn = () => {}) {
    
    for (let i = 0; i < arr.length; i++) {
      fn(arr[i], i);
    }
    
  }
  
  
  function filter_(arr, fn) {
    const filtered = [],
      unfiltered = [];
    
    for (let i = 0; i < arr.length; i++) {
      const elem = arr[i];
      
      (fn(elem, i) ? filtered : unfiltered).push(elem);
    }
    
    return { filtered, unfiltered };
    
  }
  
  
  function extractArray(arr, target_array) {
    let data, len = target_array.length;
    
    for (let i = 0; i < len; i++) {
      data = target_array[i];
      
      if (!isArray(target_array[i])) {
        arr.push(target_array[i]);
      } else if (isArray(target_array[i])) {
        extractArray(arr, target_array[i]);
      }
      
    }
    
    return arr
  }
  
  
  function extractCollection(arr, target_list) {
    let elem, len = target_list.length;
    
    for (let i = 0; i < len; i++) {
      elem = target_list[i];
      
      if (isHTML(elem) || isSVG(elem)) {
        arr.push(elem);
      } else if (isHTMLCollection(elem) || isArray(elem)) {
        extractCollection(arr, elem);
      }
      
    }
    
    return arr;
  }
  
  
  function toArray(arg) {
    return isArray(arg) ? arg : [arg];
  }
  
  
})();


// event.js


(function($) {
  
  const Global_Events = Object.create(null)
  const finish_event = [];
  const remove_event = new Map();
  
  const touch_event = {
    onmove: ['drag', 'zoomin', 'zoomout'],
    onend: ['doubleclick', 'drop', 'longpress', 'slidedown', 'slideleft', 'slideright', 'slideup', 'tap']
  };
  
  
  
  function isEventDone(elem, type = null) {
    let res;
    
    finish_event.length && (res = loop(finish_event, x => {
      
      const [elem_, type_] = x;
      
      if (elem_ === elem) {
        if (isNull(type)) return true;
        
        if (type_ === type) return true;
      }
    }));
    
    return res === true;
  }
  
  
  function addToFinishEvents(elem, type) {
    if (!isEventDone(elem, type)) {
      finish_event.push([elem, type]);
    }
  }
  
  
  function AddEvent() {
    const data = Global_Events;
    
    let event_elem, event_type, event_callback, event_type_and_callback;
    
    function add(arg = {}) {
      
      const { element, type, callback, type_and_callback } = arg;
      
      
      event_elem = element;
      
      if (type) {
        event_type = type;
        event_callback = callback;
        data[event_elem] = [type, callback];
      }
      else {
        event_type_and_callback = type_and_callback;
        data[event_elem] = type_and_callback;
      }
      
      return this;
    }
    
    function exec(removal_config = {}) {
      
      /*
      * exec both handles adding and removing the event, it only uses a modified callback for handling event removal, then supplied as argument for addEventListener
      
      * to remove event using exec
      * if removal_config = object
      
      removal_config = {
        condition : fn, if true remove event
        callback : fn, callback after removing event
        repeat : bool, if true means it will not actually remove event just use the removal_config callback, acts as replacement for it's default callback
      }
      
      * if removal_config = string
      * argument can be a native event type like click, touchstart or touchmove or element/node or custom id
      * for custom touch events like longpress , it is handled by external methods so it never used here
      * it uses the external variable remove_event, a Map() 
      * removal_config is based from $.off(), then is inserted to remove_event Map
      
      */
      
      let { condition, callback, delay, repeat, remove } = removal_config;
      
      function modified_callback(e) {
        
        if (remove) {
          const _remove = remove_event.get(remove);
          
          condition = _remove.condition;
          callback = callback || _remove.callback;
          delay = delay || _remove.delay
          repeat = isBoolean(repeat) ? repeat : _remove.repeat;
          
        }
        
        
        if (condition && condition()) {
          
          if (e.type !== 'touchstart' && e.type !== 'touchmove') {
            
            setTimeout(function() {
              callback && callback(e)
            }, delay);
            
            if (!repeat) {
              this.removeEventListener(event_type, arguments.callee);
            }
            
          }
        }
        else {
          event_callback(e);
          addToFinishEvents(event_elem, event_type);
        }
        
        if (event_type !== 'touchstart' && event_type !== 'touchmove' && event_type !== 'touchend') {
          
          chainEventHandler(event_elem, event_type);
        }
      }
      
      event_elem.addEventListener(event_type, modified_callback);
      
      return this;
    }
    
    return {
      add,
      exec
    }
    
  }
  
  
  
  const default_remove_event = {
    callback: () => {},
    condition: () => { return false },
    delay: 10,
    repeat: false
  }
  
  
  $.on = function(element, event_config, removal_config) {
    
    let { condition, callback, delay, repeat, } = removal_config || {}
    
    const remove = Object.create(null);
    remove.remove = removal_config?.remove
    const to_remove = remove.remove ? true : false
    
    const event_list = [];
    const event_obj = Object.create(null);
    
    for (const [key, val] of Object.entries(event_config)) {
      if (key !== "id") {
        event_list.push(key);
      }
    }
    
    
    function init(obj, str_obj) {
      let res;
      
      event_list.forEach(type => {
        
        res = (obj && isObject(obj)) ? obj[type] ?? obj.other ?? obj : obj ?? default_remove_event[str_obj];
        
        !event_obj[str_obj] && (event_obj[str_obj] = {});
        
        event_obj[str_obj][type] = isObject(res) ? default_remove_event[str_obj] : res;
        
      });
      
      return event_obj[str_obj];
    }
    
    condition = init(condition, 'condition');
    callback = init(callback, 'callback');
    delay = init(delay, 'delay');
    repeat = init(repeat, 'repeat');
    
    const touch_events = {}
    
    for (const [key, val] of Object.entries(event_config)) {
      
      if ((!touch_event.onmove.includes(key) && !touch_event.onend.includes(key))) {
        
        const event = AddEvent()
          .add({
            element: element,
            type: key,
            callback: val,
          })
        
        if (to_remove) {
          event.exec(remove)
        }
        else {
          event.exec({
            condition: condition[key],
            callback: callback[key],
            delay: delay[key],
            repeat: repeat[key],
          })
        }
      }
      else {
        touch_events[key] = val
      }
      
      
    }
    
    
    if (Object.keys(touch_events).length > 0) {
      if (to_remove) {
        touchEventHandler(element, touch_events, remove)
      }
      else {
        touchEventHandler(element, touch_events, { condition, callback, repeat })
      }
    }
    
  }
  
  
  $.off = function(remove_event_type, arg) {
    
    //remove_event_type argument can be element, id, or event_type
    
    const {
      callback = () => {},
        condition = () => { return false },
        delay = 10,
        repeat = false
    } = arg || {};
    
    if (!remove_event.has(remove_event_type)) {
      remove_event.set(remove_event_type, { callback, condition, delay, repeat });
    }
    return {
      reset: () => {
        remove_event.set(remove_event_type, {})
      }
    }
    
  }
  
  
  $.getEventList = function() {
    return Global_Events;
  }
  
  
  $.isEventDone = isEventDone;
  
  
  function AddTouchEvent(element) {
    
    let doubleclick, drag, drop, longpress, moving, slidedown, slideleft, slideup, slideright, tap, zoomin, zoomout;
    
    let start_x, start_y, current_x, current_y, current_x2, current_y2, end_x, end_y, start_x2, start_y2, end_x2, end_y2;
    
    let is_vertical, is_horizontal;
    let coordinates, has_moved;
    
    let time_onstart, time_onend;
    
    let doubleclick_durations = [];
    let tap_durations = [];
    
    let x_movements = [],
      y_movements = [];
    
    let delta_x = 0,
      delta_y = 0;
    let zoomin_delta = 0,
      zoomout_delta = 0;
    
    let total_start_x = 0,
      total_start_y = 0,
      total_current_x = 0,
      total_current_y = 0,
      total_end_x = 0,
      total_end_y = 0;
    
    function touchstart(_callback = () => {}) {
      
      start_x = Math.abs(event.targetTouches[0].pageX);
      start_y = Math.abs(event.targetTouches[0].pageY);
      
      if (event.touches.length > 1) {
        start_x2 = Math.abs(event.touches[1].pageX);
        start_y2 = Math.abs(event.touches[1].pageY);
        
        total_start_x = Math.abs(start_x - start_x2);
        total_start_y = Math.abs(start_y - start_y2);
        
        if (total_start_x > total_start_y) {
          is_horizontal = true;
        }
        else if (total_start_y > total_start_x) {
          is_vertical = true;
        }
        
      }
      
      time_onstart = new Date().getTime();
      
      if (doubleclick_durations.length >= 1) {
        if (time_onstart - doubleclick_durations[0] < 200) {
          doubleclick_durations.push(time_onstart)
        }
        else {
          doubleclick_durations = []
        }
      }
      
      if (tap_durations.length >= 1) {
        if (time_onstart - tap_durations[0] < 200) {
          tap_durations.push(time_onstart)
        }
        else {
          tap_durations = []
        }
      }
      
      event.preventDefault();
      _callback();
      
    }
    
    function touchmove(_callback = () => {}) {
      
      const o_left = element.offsetLeft;
      const o_top = element.offsetTop;
      
      const event_touches_len = event.touches.length;

      x_movements.push(o_left);
      y_movements.push(o_top);
      
      current_x = Math.abs(event.targetTouches[0].pageX);
      current_y = Math.abs(event.targetTouches[0].pageY);
      
      if (event_touches_len > 1) {
        
        current_x2 = Math.abs(event.touches[1].pageX);
        current_y2 = Math.abs(event.touches[1].pageY);
        
        total_current_x = Math.abs(current_x - current_x2);
        total_current_y = Math.abs(current_y - current_y2);
        
        
        if (is_horizontal) {
          log('horizontal')
          if (total_current_x > total_start_x) {
            zoomin = true;
            zoomin_delta = Math.abs(current_x - start_x) + Math.abs(current_x2 - start_x2)
           
          }
          else if (total_start_x > total_current_x) {
            zoomout = true;
            zoomout_delta = Math.abs(start_x - current_x) + Math.abs(start_x2 - current_x2)
            
          }
        }
        
        if (is_vertical) {
          log('vertical')
          if (total_current_y > total_start_y) {
            zoomin = true;
            zoomin_delta = Math.abs(current_y - start_y) + Math.abs(current_y2 - start_y2)
            
          }
          else if (total_start_y > total_current_y) {
            zoomout = true;
            zoomout_delta = Math.abs(start_y - current_y) + Math.abs(start_y2 - current_y2)
            
          }
        }
      }
      
      x_movements.length >= 10 ? moving = true : moving = false;
          
      if (event_touches_len > 1) {
        moving = false;
      }
      
      if (moving || zoomin || zoomout) {
        has_moved = true;
      }
      
      // needed for adjusting html element position while dragging 
      coordinates = [Math.round(current_x), Math.round(current_y)];
      
      event.preventDefault();
      
      _callback([moving, zoomin, zoomout], coordinates, is_vertical, [zoomin_delta, zoomout_delta], has_moved, 'touchmove');
      
    }
    
    function touchend(_callback = () => {}) {
      
      let touches_len = event.touches.length;
      
      delta_x = current_x && current_x - start_x;
      delta_y = current_y && current_y - start_y;
      
      time_onend = +new Date().getTime();
      
      doubleclick_durations.push(time_onend);
      tap_durations.push(time_onend)
      
      if (!touches_len) {
        
        if (!has_moved) {
          
          if (time_onend - time_onstart >= 400) {
            longpress = true;
          }
          else {
            
            if (doubleclick_durations[1] - doubleclick_durations[0] < 200) {
              doubleclick = true;
              doubleclick_durations = []
            }
            
            if (delta_y >= 25 && delta_x <= 50 && !(delta_x <= -50)) {
              slidedown = true;
            }
            else if (delta_x <= -25 && delta_y >= -50 && !(delta_y >= 50)) {
              slideleft = true;
            }
            else if (delta_x >= 25 && delta_y >= -50 && !(delta_y >= 50)) {
              slideright = true;
            }
            else if (delta_y <= -25 && delta_x <= 50 && !(delta_x <= -50)) {
              slideup = true;
            }
            
          }
          
          if (longpress || (doubleclick || slidedown || slideleft || slideright || slideup)) {
            tap = false;
          } else {
            tap = true;
          }
          
          
        }
        else {
          drop = true;
          time_onstart_and_onend = [];
        }
        
      }
      
      if (!moving) drop = false;
      
      if (!drop) {
        coordinates = [start_x, start_y, current_x, current_y].map(x => { return Math.round(x) });
      }
      
      if (delta_x >= 1 || delta_y >= 1) {
        doubleclick = false
        tap = false
      }
      
      
      if (tap) {
        // here we use setTimeout with 200 delay to avoid triggering tap while doubleclick = true or tap_durations[1] - tap_durations[0] < 200
        
        setTimeout(() => {
          if (tap_durations.length >= 2) {
            if (tap_durations[1] - tap_durations[0] < 200) {
              tap = false
            }
            else {
              tap = true
            }
            
            tap_durations = []
          }
          else {
            if (doubleclick) {
              tap = false
            }
            else {
              tap = true
            }
          }
          
          _callback([false, false, false, false, false, false, false, tap], coordinates, is_vertical, null, has_moved, 'touchend');
          
          //since its's inside setTimeout we can't call event.type inside the _callback so we just pass the type 'touchend'
          
        }, 200)
      }
      else {
        _callback([doubleclick, drop, longpress, slidedown, slideleft, slideright, slideup, tap], coordinates, is_vertical, null, has_moved, 'touchend');
      }
      
      start_x = 0;
      start_y = 0;
      current_x = 0;
      current_y = 0;
      
      doubleclick = false;
      drop = false;
      longpress = false;
      moving = false;
      slidedown = false;
      slideleft = false;
      slideright = false;
      slideup = false;
      tap = false;
      zoomin = false;
      zoomout = false;
      
      if (x_movements >= 10) {
        doubleclick_durations = [];
        tap_durations = [];
      }
      
      if (!touches_len) has_moved = false;
      
      x_movements = [];
      y_movements = [];
      
      is_horizontal = false;
      is_vertical = false;
      
      event.preventDefault()
      
    }
    
    const init_handler = {
      touchstart,
      touchmove,
      touchend
    };
    
    function final_handler(type, callback, removal_config = {}) {
      
      AddEvent()
        .add({
          element,
          type: type,
          callback: () => {
            init_handler[type](callback)
          }
        })
        .exec(removal_config);
      
    }
    
    return {
      onStart(fn, cfg) {
        final_handler('touchstart', fn, cfg);
        return this
      },
      onMove(fn, cfg) {
        final_handler('touchmove', fn, cfg);
        return this
      },
      onEnd(fn, cfg) {
        final_handler('touchend', fn, cfg)
        return this
      }
    }
    
  }
  
  
  function ondrag(node, coordinates, state, config = {}) {
    
    const {
      callback = isFunction(config) ? config : (() => {}),
        free = [-1000, 10000, -1000, 10000]
    } = config;
    
    const [top, bottom, left, right] = free;
    
    // drag.free, if this property is given, then the event target can be drag only at the coordinates greater than the given value for top and left and less than value for bottom and right
    
    // divided it by 2 so it's in the center while dragging
    const x_coordinate = coordinates[0] - (node.clientWidth / 2),
      y_coordinate = coordinates[1] - (node.clientHeight / 2);
    
    
    if (state) {
      if (x_coordinate >= left && x_coordinate <= right) {
        if (!node.style.getPropertyValue('marginLeft')) {
          node.style.left = x_coordinate + 'px';
        } else {
          node.style.marginLeft = x_coordinate + 'px';
        }
      }
      
      if (y_coordinate >= top && y_coordinate <= bottom) {
        
        if (!node.style.getPropertyValue('marginTop')) {
          node.style.top = y_coordinate + 'px';
        } else {
          node.style.marginTop = y_coordinate + 'px';
        }
      }
      
      callback({ elem: node, type: 'drag' });
      
    }
  }
  
  
  function onzoom(node, state, zoomin, zoomout, is_vertical, deltas) {
    
    _element = node;
    
    const [zoomin_state = () => { return false }, zoomout_state = () => { return false }] = state;
    
    const cmp = getComputedStyle(node)
    
    const height = parseInt(cmp.height);
    const width = parseInt(cmp.width);
    
    let scale = cmp.transform
    
    scale = scale.match(/([\d]\.[\d]+)/)
    scale = scale ? parseFloat(scale[0]) : 0
    
    // if disable = true, then it will not apply the scaling effect 
    if (zoomin_state) {
      const {
        callback = isFunction(zoomin) ? zoomin : () => {},
          disable = false,
          max = 4,
      } = zoomin;
      
      if (!disable) {
        let delta = deltas[0]
        delta = is_vertical ? delta / height : delta / width
        const scale_res = 1 + delta
        
        if (scale_res < max) {
          node.style.transform = `scale(${scale_res})`
        }
      }
      
      callback({elem: node, type: 'zoomin'});
    }
    
    else if (zoomout_state) {
      const {
        callback = isFunction(zoomout) ? zoomout : () => {},
          disable = false,
          max = 1,
      } = zoomout;
      
      if (!disable) {
        let delta = deltas[1]
        delta = is_vertical ? delta / height : delta / width
        scale = scale || 1
        
        const scale_res = scale - delta
        
        if (scale_res > max) {
          node.style.transform = `scale(${scale - delta})`
        }
      }
      
      callback({elem: node, type: 'zoomout'});
    }
  }
  
  
  
  const repeat_config = new Map();
  
  
  function touchEventHandler(element, type_and_callback, removal_config = {}) {
    
    let { condition, callback, delay, repeat, remove } = removal_config;
    
    let evt;
    let pos;
    let type, event_type;
    let event_config;
    let touch_event_list = [];
    let final_obj = {};
    let id = type_and_callback.id;
    
    if (isNode(remove)) {
      
      const _remove = remove_event.get(remove);
      
      const _condition = _remove?.condition;
      const _callback = _remove?.callback ?? callback;
      const _delay = _remove?.delay ?? delay;
      const _repeat = _remove?.repeat ?? repeat;
      
      AddTouchEvent(element)
        .onStart(() => {}, { _condition, remove })
        .onMove(modified_callback, { _condition, remove })
        .onEnd(modified_callback, { _condition, _callback, _delay, _repeat, remove });
    }
    else {
      AddTouchEvent(element)
        .onStart()
        .onMove(modified_callback)
        .onEnd(modified_callback);
    }
    
    function modified_callback(event_list, coordinates, is_vertical, deltas, has_moved, event_type) {
      
      pos = event_list.indexOf(true);
      
      if (event_type === 'touchmove' && has_moved) {
        
        type = touch_event.onmove[pos];
        
        if (type in type_and_callback) {
          event_config = type_and_callback[type];
          
          if (type === 'drag') {
            handler(type, () => { ondrag(element, coordinates, true, event_config) });
          }
          if (type === 'zoomin') {
            handler(type, () => { onzoom(element, [true, false], event_config, null, is_vertical, deltas) });
          }
          if (type === 'zoomout') {
            handler(type, () => { onzoom(element, [false, true], null, event_config, is_vertical, deltas) });
          }
          
        }
      }
      
      if (event_type === 'touchend') {
        
        if (has_moved) addToFinishEvents(element, type);
        
        type = touch_event.onend[pos];
        
        if (type in type_and_callback) {
          handler(type, type_and_callback[type]);
          addToFinishEvents(element, type);
        }
        
      }
      
      chainEventHandler(element, event_type, type);
      
    }
    
    
    function handler(evt_type, evt_callback) {
      
      const _remove = remove_event.get(remove);
      
      let _condition, _delay, _callback, _repeat;
      
      if ((!touch_event.onmove.includes(remove) && !touch_event.onend.includes(remove)) && isString(remove)) {
        
        _condition = _remove.condition?.[evt_type] ?? _remove.condition?.other ?? _remove.condition;
        
        _callback = _remove.callback?.[evt_type] ?? _remove.callback?.other ?? _remove.callback;
        
        _delay = _remove.delay?.[evt_type] ?? _remove.delay?.other ?? _remove.delay;
        
        _repeat = _remove.repeat?.[evt_type] ?? _remove.repeat?.other ?? _remove.other;
        
      }
      else if (remove === evt_type) {
        _condition = _remove.condition;
        _callback = _remove.callback;
        _delay = _remove.delay;
        _repeat = _remove.repeat;
      }
      else {
        _condition = condition?.[evt_type];
        _callback = callback?.[evt_type];
        _delay = delay?.[evt_type];
        _repeat = repeat?.[evt_type];
      }
      
      if (_condition && _condition()) {
        
        if (_repeat === false) {
          if (!repeat_config.has(element)) {
            
            repeat_config.set(element, {});
            repeat_config.get(element)[evt_type] = 1;
            
          }
          else {
            
            if (repeat_config.get(element)?.[evt_type]) {
              _callback = () => {};
            }
            
          }
        }
        
        setTimeout(() => {
          stat = _callback({ elem: element, type: evt_type })
        }, _delay);
        
      }
      
      else {
        evt_callback({ elem: element, type: evt_type });
      }
      
    }
    
    
  }
  
  
  
  const chain_events = {}
  
  // sample format chain_events
  /* chain_events = {
       [id] : {
        elements = [div1, div2],
        types = [[click], [longpress]],
        callback = callback after executing those events on each elements
       },
       events : [[elements], [ids]] = 
         [[div1, div2], [click, longpress]]
     }
  * with this format, we can easily track elements cause just need to access first events to check for elements 
  * if div1 on elements[0] then id on ids[0]
  * then access the element through chain_events[ids[0]].elements[0]
  * then type at chain_events[[ids[0]].types[0]
  */
  // chainEvent just track if elements listed on it's data structure are executed in order then if it's done consecutively execute the callback else reset those state or counters through resetChainEvents
  
  // state and counters for tracking those events listed on chain_events data structure 
  
  let element_state = [];
  let type_state = [];
  let type_counter = 0;
  let sub_type_state = [];
  let sub_type_counter = 0;
  let element_counter = 0;
  
  function chainEvent(arg, config) {
    /* sample format
    arg = [
      {
        element : div1,
        type : click
      },
      {
        element: div2,
        type: longpress
      }
    ]
    
    config = {
      id : id1,
      callback : fn
    }
    */
    
    
    const elements = [],
      match_id = [],
      types = [];
    
    const { id, callback } = config;
    
    arg.forEach(obj => {
      for (const [key, val] of Object.entries(obj)) {
        
        if (key === 'element') {
          elements.push(val)
        }
        else {
          types.push(val)
        }
        
      }
    });
    
    
    elements.forEach(x => {
      match_id.push(id)
    });
    
    
    chain_events[id] = {
      elements,
      types,
      callback
    }
    
    
    if (!('events' in chain_events)) {
      chain_events.events = [
        [],
        []
      ];
    }
    
    chain_events.events[0].push(...elements);
    chain_events.events[1].push(...match_id);
    
    
  }
  
  
  function chainEventHandler(element, event_type, type) {
    
    type = type || event_type;
    
    
    if (event_type !== 'touchstart' && event_type !== 'touchmove') {
      
      
      const _chain = chain_events.events;
      
      
      if (_chain && _chain[0].includes(element)) {
        
        const id = _chain[1][_chain[0].indexOf(element)];
        const data = chain_events[id];
        
        const { elements, types, callback } = data;
        
        
        const elem_ = elements[element_counter];
        const types_ = types[type_counter];
        const sub_type = types_[sub_type_counter];
        
        
        if (element === elem_ && type === sub_type) {
          
          
          if (isEventDone(elem_, sub_type)) {
            sub_type_state.push(1)
            sub_type_counter++;
          }
          else {
            sub_type_state = [];
            sub_type_counter = 0;
          }
          
          
        }
        else {
          chainEventReset();
        }
        
        
        if (sub_type_state.length === types_.length) {
          element_state.push(1)
          element_counter++
          type_state.push(1)
          type_counter++
          sub_type_state = []
          sub_type_counter = 0
        }
        
        
        if (element_state.length === elements.length) {
          setTimeout(callback, 100);
          chainEventReset();
        }
        
      }
      else {
        chainEventReset();
      }
    }
  }
  
  
  function chainEventReset() {
    element_state = [];
    type_state = [];
    element_counter = 0;
    type_counter = 0;
    sub_type_counter = 0;
  }
  
  
  $.chainEvent = chainEvent;
  
  
})(Domator);


// anime.js


(function($) {
  
  // the foundation of this animation code was taken from javascript.info
  
  function animate(element, main_config) {
    
    let {
      css,
      config,
      callback
    } = main_config;
    
    const default_config = {
      delay: 10,
      duration: 400,
      easing: 'linear',
      repeat: 1,
      r_delay: 0, // delay after each animation use on apply_repeat
    }
    
    const default_callback = {
      before: voidfn,
      during: voidfn,
      after: voidfn
    }
    
    config = apply_default(config, default_config);
    callback = apply_default(callback, default_callback);
    
    let {
      delay,
      duration,
      easing,
      repeat,
      r_delay
    } = config;
    
    const {
      before,
      during,
      after
    } = callback;
    
    let time_fraction, progress, sub_progress, rep_progress;
    
    //fixed 10ms delay regardless of duration cause if we don't add delay for every animation it will not reach the exact end value of css property 
    const delay_on_repeat = 0.1 / (duration / 100);
    
    r_delay = r_delay / duration;
    r_delay = r_delay || delay_on_repeat;
    
    const max_progress = repeat;
    const adjustment = r_delay * (repeat - 1);
    
    
    function animateHandler() {
      const start = performance.now();
      before();
      
      function animate(time) {
        
        time_fraction = (time - start) / duration
        
        progress = apply_easing();
        sub_progress = progress;
        rep_progress = apply_repeat(sub_progress, progress);
        
        for (const [key, val] of Object.entries(css)) {
          apply_animation(get_css(val, key));
        }
        
        during();
        
        if (progress <= max_progress + adjustment) {
          requestAnimationFrame(animate);
        }
        else {
          cancelAnimationFrame(animate);
          after();
        }
        
        
      }
      
      requestAnimationFrame(animate);
    }
    
    
    setTimeout(animateHandler, delay);
    
    
    function apply_repeat(sub, prog, total = 1) {
      
      if (total === repeat) {
        return sub;
      }
      
      if (sub >= (1 + r_delay)) {
        sub = sub - (1 + r_delay);
        return apply_repeat(sub, prog, ++total);
      }
      
      return sub;
    }
    
    
    function apply_easing() {
      
      if (easing === 'linear') {
        progress = linear(time_fraction);
      } else if (easing === 'ease-in') {
        progress = easeIn(time_fraction);
      } else if (easing === 'ease-out') {
        progress = easeOut(time_fraction);
      } else if (easing === 'ease-in-out') {
        progress = easeInOut(time_fraction);
      }
      
      return progress;
    }
    
    
    function get_css(css, property) {
      let start_value = css[0],
        end_value = css[1];
      
      //property value to be filled during animation
      let value_to_be_filled;
      let unit;
      
      if (isString(start_value)) {
        unit = /[a-z]+/.exec(start_value);
        start_value = parseInt(/[\d]+/.exec(start_value));
        end_value = parseInt(/[\d]+/.exec(end_value));
      }
      
      value_to_be_filled = 1 - (start_value / end_value);
      unit = unit || 'px';
      
      return [property, start_value, end_value, value_to_be_filled, unit];
      
    }
    
    
    function apply_animation(css) {
      
      let [property, start_value, end_value, value_to_be_filled, unit] = css;
      
      css_progress = rep_progress <= 1 ? Math.floor(start_value + ((end_value * rep_progress) * value_to_be_filled)) : end_value;
      
      element.style[property] = css_progress + unit;
      
    }
    
  }
  
  $.animate = animate;
  
  
  //animate easings
  
  function linear(t) {
    return t;
  }
  
  function easeIn(t) {
    return t * t;
  }
  
  function easeOut(t) {
    return 1 - (1 - t) * (1 - t);
  }
  
  function easeInOut(t) {
    return t < 0.5 ?
      2 * t * t :
      1 - Math.pow(-2 * t + 2, 2) / 2;
  }
  
  
  //animate utils
  
  function voidfn() {}
  
  function falsefn() { return false; }
  
  function apply_default(main_obj, default_obj) {
    
    main_obj = main_obj ?? {};
    
    for (const [key, val] of Object.entries(default_obj)) {
      const main_val = main_obj[key]
      
      if (isObject(val)) {
        main_obj[key] = main_val ?? {};
        apply_default(main_obj[key], val);
      }
      else if (main_val === undefined) {
        main_obj[key] = val;
      }
      
    }
    
    return main_obj;
  }
  
  
})(Domator);