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
  
  
})(Domator)