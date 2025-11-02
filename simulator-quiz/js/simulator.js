const DELAY = 4000; 

let currentIndex = 0; 
let currentKey = '';

// data for selectors
const G_DATA = {
    "thumbsUp": {
        emoji: "👍",
        regions: {
            "middleEast": { name: "Middle East", key: "thumbsUp_ME" }
        }
    }
};

// data for comic strip frames
const SCNRS = {
    "thumbsUp_ME": { 
        states: [ 
            { 
                text: "Scene 1: Tourist takes a photo of the local.",
                b1: { img: "images/simulator/thumbsup/c1p1.webp", cap: "Nice shot!" },
                b2: { img: "images/simulator/thumbsup/c2p1.webp", cap: "Ready!" }, 
                b3: { img: "images/simulator/thumbsup/c3p1.webp", cap: "" } 
            },
            { 
                text: "Scene 2: Tourist flashes a Thumbs Up (👍) to say 'Perfect!'",
                b1: { img: "images/simulator/thumbsup/c1p2.webp", cap: "Perfect!" },
                b2: { img: "images/simulator/thumbsup/c2p2.webp", cap: "INSULTED!" }, 
                b3: { img: "images/simulator/thumbsup/c3p2.webp", cap: "NO!" } ,
                finalMessage: "<strong>Cultural Lesson:</strong> The Thumbs Up (👍) gesture is considered highly rude and vulgar in several Middle Eastern and West African countries, often equivalent to the middle finger in the West."
            },
        ]
    }
};

$(document).ready(function() {
    const $gSelect = $('#gesture-select');
    const $rSelect = $('#region-select');
    const $startBtn = $('#start-simulation-btn');
    const $restartBtn = $('#restart-btn');

    $gSelect.on('change', function() {
        const gesture = $(this).val();
        $rSelect.empty().append('<option value="" disabled selected>Choose a region...</option>').prop('disabled', true);
        $startBtn.prop('disabled', true);

        if (gesture && G_DATA[gesture]) {
            const regions = G_DATA[gesture].regions;
            $.each(regions, function(key, data) {
                if (data.key) {
                    $rSelect.append(
                        `<option value="${data.key}">${data.name}</option>`
                    );
                }
            });

            $rSelect.prop('disabled', false); 
        }
    });

    $rSelect.on('change', function() {
        const key = $(this).val();
        $startBtn.prop('disabled', !key);
    });

    $startBtn.on('click', function() {
        currentKey = $rSelect.val();
        startSimulation();
    });

    $restartBtn.on('click', function() {
        resetSimulation();
    });

});

function startSimulation() {
    $('#scenario-selector').hide();
    $('#simulator-container').fadeIn(600);
    currentIndex = 0;
    $('#restart-btn').hide(); 
    $('#final-message-box').hide().empty();
    updatePanel();
    autoAdvance();
}

function updatePanel() {
    const scenario = SCNRS[currentKey];
    const state = scenario.states[currentIndex];
    
    const $grid = $('#comic-panel-grid');
    const $imgs = $grid.find('img');
    $imgs.removeClass('show-animated'); 

    $('#img-1').attr('src', state.b1.img).attr('alt', state.b1.cap);
    $('#text-1').text(state.b1.cap);
    
    $('#img-2').attr('src', state.b2.img).attr('alt', state.b2.cap);
    $('#text-2').text(state.b2.cap);

    $('#img-3').attr('src', state.b3.img).attr('alt', state.b3.cap);
    $('#text-3').text(state.b3.cap);
    
    $grid.animate({ opacity: 1 }, 300, function() { 
        $imgs.addClass('show-animated');
    });
}

function autoAdvance() {
    const states = SCNRS[currentKey].states; 
    const $simContainer = $('#simulator-container');
    if (currentIndex === 0) {
        currentIndex = 1;
        setTimeout(function() {
            $simContainer.fadeOut(500, function() { 
                updatePanel(); 
                $simContainer.fadeIn(500, function() {
                    const finalMessage = states[1].finalMessage;
                    if (finalMessage) {
                         setTimeout(function() {
                             $('#final-message-box').html(finalMessage).fadeIn(500);
                         }, 700); 
                    }
                    autoAdvance();
                });
            });
        }, DELAY);
        return;
    }
    if (currentIndex === 1) {
        setTimeout(function() {
             $('#restart-btn').show();
        }, DELAY);
        return;
    }
}

function resetSimulation() {
    $('#simulator-container').hide();
    $('#scenario-selector').fadeIn(600);
    $('#gesture-select').val('');
    $('#region-select').empty().append('<option value="" disabled selected>Choose a region...</option>').prop('disabled', true);
    $('#start-simulation-btn').prop('disabled', true);
}


function showImagesSequential(step = 220) {
  const ids = ['#img-1', '#img-2', '#img-3'];
  ids.forEach(sel => {
    const el = document.querySelector(sel);
    if (!el) return;
    el.classList.remove('show-animated');
    el.style.animationDelay = '0s';
    void el.offsetWidth;
  });

  const waits = ids.map(sel => new Promise(res => {
    const img = document.querySelector(sel);
    if (!img) return res();
    if (img.complete) return res();
    img.addEventListener('load', res, { once: true });
    img.addEventListener('error', res, { once: true });
  }));

  Promise.all(waits).then(() => {
    ids.forEach((sel, i) => {
      const el = document.querySelector(sel);
      if (!el) return;
      el.style.animationDelay = (i * step) + 'ms';
    });
    ids.forEach(sel => {
      const el = document.querySelector(sel);
      if (el) el.classList.add('show-animated');
    });
  });
}

function updatePanel() {
  const scenario = SCNRS[currentKey];
  const state = scenario.states[currentIndex];
  $('#img-1').attr('src', state.b1.img).attr('alt', state.b1.cap);
  $('#text-1').text(state.b1.cap);

  $('#img-2').attr('src', state.b2.img).attr('alt', state.b2.cap);
  $('#text-2').text(state.b2.cap);

  $('#img-3').attr('src', state.b3.img).attr('alt', state.b3.cap);
  $('#text-3').text(state.b3.cap);

  const $grid = $('#comic-panel-grid');
  $grid.css('opacity', 1); 
  showImagesSequential(520);
}
