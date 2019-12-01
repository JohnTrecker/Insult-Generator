'use strict';

const insults = {
  "adjective": [
    "atomic", "steamy", "rusty", "witless", "lumpy", "shitty", "moist", "chunky", "lousy", "bulbous", "trashy", "dumbass", "nerdy", "dotarded", "crusty", "brainless"
  ],
  "noun_one": [
    "knob", "bum", "turd", "prick", "bulge", "ass", "wang", "shit", "rod", "chode", "fuck", "weiner", "jizz", "panty", "cock", "dong"
  ],
  "noun_two": [
    "vacuum", "general", "gremlin", "pixie", "spasm", "fiend", "fungus", "tunnel", "corporal", "demon", "raider", "buccanneer", "tyrant", "juggler", "magician", "fiddle"
  ]
}

class Insult {
  constructor() {
    this.adjectives = insults['adjective'];
    this.firstNoun = insults['noun_one'];
    this.secondNoun = insults['noun_two'];

    this.panelWidth = 120;
    this.SLOTS_PER_REEL = 16
    this.REEL_RADIUS = Math.round((this.panelWidth / 2) / Math.tan(Math.PI / this.SLOTS_PER_REEL));
  }

  createSlots(ring, options) {
    let slotAngle = 360 / this.SLOTS_PER_REEL;
    let randomInt = this.getRandom();

    for (var i = 0; i < this.SLOTS_PER_REEL; i++) {
      let slot = document.createElement('div');

      slot.className = 'slot';

      let transform = `rotateX(${(slotAngle * i)}deg) translateZ(${this.REEL_RADIUS}px)`;

      slot.style.transform = transform;

      let insultingWord = options[((randomInt + i) % 16)]
      let content = $(slot).append(`<p>${insultingWord}</p>`);
      ring.append(slot);
    }
  }

  getRandom() {
    return Math.floor(Math.random() * (this.SLOTS_PER_REEL));
  }

  spin(timer) {
    for (var i = 1; i < 4; i++) {
      let oldRandomInt = -1;
      /*
      check if old random int from the previous iteration is not the same as the current iteration;
      if this happens then the reel will not spin at all
      */
      let oldClass = $('#ring' + i).attr('class');
      if (oldClass.length > 4) {
        oldRandomInt = parseInt(oldClass.slice(10));
      }
      let randomInt = this.getRandom();
      while (oldRandomInt == randomInt) {
        randomInt = this.getRandom();
      }

      $('#ring' + i)
        .css('animation', 'back-spin 1s, spin-' + randomInt + ' ' + (timer + i * 0.5) + 's')
        .attr('class', 'ring spin-' + randomInt);
    }
  }
}


$(document).ready(function () {
  const I = new Insult()

  // initiate slots
  I.createSlots($('#ring1'), I.adjectives);
  I.createSlots($('#ring2'), I.firstNoun);
  I.createSlots($('#ring3'), I.secondNoun);

  // hook start button
  $('.go').on('click', function () {
    let timer = 2;
    I.spin(timer);
  })

  // hook xray checkbox
  $('#xray').on('click', function () {
    let tilt = 'tiltout';

    if ($(this).is(':checked')) {
      tilt = 'tiltin';
      $('.slot').addClass('backface-on');
      $('#rotate').css('animation', tilt + ' 2s 1');

      setTimeout(function () {
        $('#rotate').toggleClass('tilted');
      }, 2000);
    } else {
      tilt = 'tiltout';
      $('#rotate').css({ 'animation': tilt + ' 2s 1' });

      setTimeout(function () {
        $('#rotate').toggleClass('tilted');
        $('.slot').removeClass('backface-on');
      }, 1900);
    }
  })
});
