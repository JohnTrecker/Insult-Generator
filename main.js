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

class Insult{
  constructor() {
    this.adjectives = insults['adjective'];
    this.firstNoun = insults['noun_one'];
    this.secondNoun = insults['noun_two'];
  }

  generateInsult(){
    const i = this.random(0, this.adjectives.length - 1)
    const j = this.random(0, this.firstNoun.length - 1)
    const k = this.random(0, this.secondNoun.length - 1)

    const adj = this.adjectives[i]
    const noun = this.firstNoun[j]
    const anotherNoun = this.secondNoun[k]

    return `You\'re just a ${adj} ${noun} ${anotherNoun}`
  }

  random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}

const freshInsult = new Insult()
const insult = freshInsult.generateInsult()

const panelWidth = 120

const SLOTS_PER_REEL = 16;
const radius = Math.round( ( panelWidth / 2) / Math.tan( Math.PI / SLOTS_PER_REEL ) );
// current settings give a value of 187, rounded to 190
const REEL_RADIUS = radius;

function createSlots(ring, options) {

  var slotAngle = 360 / SLOTS_PER_REEL;

  var seed = getSeed();

  for (var i = 0; i < SLOTS_PER_REEL; i++) {
    var slot = document.createElement('div');

    slot.className = 'slot';

    // compute and assign the transform for this slot
    var transform = 'rotateX(' + (slotAngle * i) + 'deg) translateZ(' + REEL_RADIUS + 'px)';

    slot.style.transform = transform;

    // setup the number to show inside the slots
    // the position is randomized to

    var insultingWord = options[((seed + i) % 16)]
    var content = $(slot).append(`<p>${insultingWord}</p>`);

    // add the poster to the row
    ring.append(slot);
  }
}

function getSeed() {
  // generate random number smaller than 16 then floor it to settle between 0 and 15 inclusive
  return Math.floor(Math.random() * (SLOTS_PER_REEL));
}

function spin(timer) {
  //var txt = 'seeds: ';
  for (var i = 1; i < 4; i++) {
    var oldSeed = -1;
		/*
		checking that the old seed from the previous iteration is not the same as the current iteration;
		if this happens then the reel will not spin at all
		*/
    var oldClass = $('#ring' + i).attr('class');
    if (oldClass.length > 4) {
      oldSeed = parseInt(oldClass.slice(10));
      console.log(oldSeed);
    }
    var seed = getSeed();
    while (oldSeed == seed) {
      seed = getSeed();
    }

    $('#ring' + i)
      .css('animation', 'back-spin 1s, spin-' + seed + ' ' + (timer + i * 0.5) + 's')
      .attr('class', 'ring spin-' + seed);
  }

  console.log('=====');
}

$(document).ready(function () {

  // initiate slots
  createSlots($('#ring1'), insults['adjective']);
  createSlots($('#ring2'), insults['noun_one']);
  createSlots($('#ring3'), insults['noun_two']);

  // hook start button
  $('.go').on('click', function () {
    var timer = 2;
    spin(timer);
  })

  // hook xray checkbox
  $('#xray').on('click', function () {
    //var isChecked = $('#xray:checked');
    var tilt = 'tiltout';

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

  // hook perspective
  // $('#perspective').on('click', function () {
  //   $('#stage').toggleClass('perspective-on perspective-off');
  // })
});