// ------------------ LETTER SETS ------------------
const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('');

// Phase 2 sets for general letter practice
const PHASE_SETS = {
  phase1: ['s','a','t','p'],            // Autumn 1 – Week 1
  phase3: ['g','o','c','k'],            // Autumn 1 – Week 3
  phase4: ['ck','e','u','r'],           // Autumn 1 – Week 4
  phase5: ['h','b','f','l'],            // Autumn 1 – Week 5
  phase6: ['f','ff','s','ss','l','ll','v','vv'] // Autumn 2 – Week 1
};

// Week 2 specifics
const WEEK2_LETTERS = ['i','n','m','d'];
const WEEK2_WORDS   = ['sit','nap','man','dip','pat','sad','nip','mat'];

let CURRENT_SET = [];   // active set (for general letter practice screen)
let idx = 0;
let audio;

// DOM
const screens = {
  home:     document.getElementById('home'),
  letters:  document.getElementById('letters'),
  week2:    document.getElementById('week2')
};

// ----- GENERAL LETTER PRACTICE (A–Z, W1, W3, W4, W5, W6) -----
const bigLetter  = document.getElementById('bigLetter');
const letterArea = document.getElementById('letterArea');

// ----- WEEK 2 LETTER PRACTICE (separate elements) -----
const bigLetterW2  = document.getElementById('bigLetterW2');
const letterAreaW2 = document.getElementById('letterAreaW2');

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function show(name) {
  screens.home.style.display    = name === 'home'    ? 'flex'  : 'none';
  screens.letters.style.display = name === 'letters' ? 'block' : 'none';
  screens.week2.style.display   = name === 'week2'   ? 'block' : 'none';
}

/* ------------ General letters screen logic ------------ */
function startPractice(lettersArray) {
  CURRENT_SET = shuffle(lettersArray.slice());
  idx = 0;
  show('letters');
  render();
  setTimeout(() => letterArea.focus(), 50);
}

function render() {
  const letter = CURRENT_SET[idx].toUpperCase();
  bigLetter.textContent = letter;
}

function playSoundFor(letter) {
  if (audio && !audio.paused) audio.pause();
  audio = new Audio(`sounds/${letter}.mp3`);
  audio.currentTime = 0;
  audio.play().catch(() => console.warn(`Missing sound for ${letter}.mp3`));
}

function playSoundCurrent() {
  playSoundFor(CURRENT_SET[idx]);
}

function next() {
  idx++;
  if (idx >= CURRENT_SET.length) {
    CURRENT_SET = shuffle(CURRENT_SET.slice());
    idx = 0;
  }
  render();
  playSoundCurrent();
}

function prev() {
  idx = (idx - 1 + CURRENT_SET.length) % CURRENT_SET.length;
  render();
  playSoundCurrent();
}

/* ------------ Week 2 letters pane logic ------------ */
let w2Set = shuffle(WEEK2_LETTERS.slice());
let w2Idx = 0;

function renderW2() {
  bigLetterW2.textContent = w2Set[w2Idx].toUpperCase();
}

function nextW2() {
  w2Idx++;
  if (w2Idx >= w2Set.length) {
    w2Set = shuffle(w2Set.slice());
    w2Idx = 0;
  }
  renderW2();
  playSoundFor(w2Set[w2Idx]);
}

function prevW2() {
  w2Idx = (w2Idx - 1 + w2Set.length) % w2Set.length;
  renderW2();
  playSoundFor(w2Set[w2Idx]);
}

/* ------------ Blending (Week 2 words) ------------ */
function playBlend(word) {
  const letters = word.split('');
  let i = 0;
  function playNext() {
    if (i < letters.length) {
      const a = new Audio(`sounds/${letters[i]}.mp3`);
      a.play().catch(()=>{});
      a.onended = () => { i++; playNext(); };
    } else {
      // Optional: play full word if you add sounds/word.mp3 later
      const w = new Audio(`sounds/${word}.mp3`);
      w.play().catch(()=>{});
    }
  }
  playNext();
}

function attachBlendButtons() {
  document.querySelectorAll('#paneBlendW2 .blend-btn').forEach(btn => {
    btn.addEventListener('click', () => playBlend(btn.dataset.word));
  });
}

/* ------------ Tab switching (Week 2) ------------ */
function activateWeek2Tab(which) {
  const tabLetters = document.getElementById('tabLettersW2');
  const tabBlend   = document.getElementById('tabBlendW2');
  const paneLetters= document.getElementById('paneLettersW2');
  const paneBlend  = document.getElementById('paneBlendW2');

  if (which === 'letters') {
    tabLetters.classList.add('active'); tabBlend.classList.remove('active');
    paneLetters.classList.add('active'); paneBlend.classList.remove('active');
    // Focus the letters pane for keyboard nav
    setTimeout(() => letterAreaW2.focus(), 50);
  } else {
    tabBlend.classList.add('active'); tabLetters.classList.remove('active');
    paneBlend.classList.add('active'); paneLetters.classList.remove('active');
  }
}

/* ------------ Listeners ------------ */
// Home buttons
document.getElementById('btn-practise').addEventListener('click', () => startPractice(ALPHABET));
document.getElementById('btn-phase-1').addEventListener('click', () => startPractice(PHASE_SETS.phase1));
document.getElementById('btn-phase-2').addEventListener('click', () => { show('week2'); activateWeek2Tab('letters'); renderW2(); });
document.getElementById('btn-phase-3').addEventListener('click', () => startPractice(PHASE_SETS.phase3));
document.getElementById('btn-phase-4').addEventListener('click', () => startPractice(PHASE_SETS.phase4));
document.getElementById('btn-phase-5').addEventListener('click', () => startPractice(PHASE_SETS.phase5));
document.getElementById('btn-phase-6').addEventListener('click', () => startPractice(PHASE_SETS.phase6));

// Back
document.getElementById('backLetters').addEventListener('click', () => show('home'));
document.getElementById('backWeek2').addEventListener('click', () => show('home'));

// General letters controls
document.getElementById('prevBtn').addEventListener('click', prev);
document.getElementById('nextBtn').addEventListener('click', next);

letterArea.addEventListener('click', () => { playSoundCurrent(); next(); });
letterArea.addEventListener('keydown', (e) => {
  if (e.key === ' ' || e.key === 'Enter') { playSoundCurrent(); next(); }
  if (e.key === 'ArrowRight') next();
  if (e.key === 'ArrowLeft')  prev();
});
let touchStartX = 0;
letterArea.addEventListener('touchstart', (e)=>{ touchStartX = e.changedTouches[0].clientX; }, {passive:true});
letterArea.addEventListener('touchend',   (e)=>{
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) > 40) { if (dx < 0) next(); else prev(); }
  else { playSoundCurrent(); next(); }
},{passive:true});

// Week 2 letters controls
document.getElementById('prevBtnW2').addEventListener('click', prevW2);
document.getElementById('nextBtnW2').addEventListener('click', nextW2);

letterAreaW2.addEventListener('click', () => { playSoundFor(w2Set[w2Idx]); nextW2(); });
letterAreaW2.addEventListener('keydown', (e) => {
  if (e.key === ' ' || e.key === 'Enter') { playSoundFor(w2Set[w2Idx]); nextW2(); }
  if (e.key === 'ArrowRight') nextW2();
  if (e.key === 'ArrowLeft')  prevW2();
});
let w2TouchStartX = 0;
letterAreaW2.addEventListener('touchstart', (e)=>{ w2TouchStartX = e.changedTouches[0].clientX; }, {passive:true});
letterAreaW2.addEventListener('touchend',   (e)=>{
  const dx = e.changedTouches[0].clientX - w2TouchStartX;
  if (Math.abs(dx) > 40) { if (dx < 0) nextW2(); else prevW2(); }
  else { playSoundFor(w2Set[w2Idx]); nextW2(); }
},{passive:true});

// Week 2 tabs
document.getElementById('tabLettersW2').addEventListener('click', ()=> activateWeek2Tab('letters'));
document.getElementById('tabBlendW2').addEventListener('click',   ()=> activateWeek2Tab('blend'));

// Blending buttons
attachBlendButtons();

// Init
show('home');
