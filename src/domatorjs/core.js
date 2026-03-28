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
    
    return this;
  }
  
  
  function filter(arg) {
    const elem = toArray($(_element));
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
    
    const unfiltered = [];
    let filtered;
    
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
    });
    
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
    arg.length ? with_(...arg) : 0;
    
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