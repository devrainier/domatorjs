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
  
  
})(Domator)