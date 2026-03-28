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