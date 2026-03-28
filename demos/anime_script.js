(function($) {
  
  // Simple demo for animation 
  
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
      r_delay: 500 // delay after each animation when repeat is > 1
    },
     callback: {
      before: () => { log('before') },
      during: () => {log('during')},
      after: () => { log('after') }
    },
  }
  )
  
  
  
})(Domator);