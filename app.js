// ------------------ LETTER SETS ------------------
const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('');

// Phase 2 letter sets (for letter practice)
const PHASE_SETS = {
  phase1: ['s','a','t','p'],            // Autumn 1 – Week 1
  // Week 2 uses blending instead of letter-only practice (see below)
  phase3: ['g','o','c','k'],            // Autumn 1 – Week 3
  phase4: ['ck','e','u','r'],           // Autumn 1 – Week 4
  phase5: ['h','b','f','l'],            // Autumn 1 – Week 5
  phase6: ['f','ff','s','ss','l','ll','v','vv'] // Autumn 2 – Week 1
};

// Blending words for Autumn 1 – Week 2
const BLEND_WORDS = ['sit','nap','man','dip','pat','sad','nip','mat'];

let CURRENT_SET = [];   // active set for letter practice
let idx = 0;
let audio;

// DOM
const screens = {
  home:     document.getElementById('home'),
  letters:  document.getElementById('letters'),
  blending: document.getElementById('blending')
};
const bigLetter  = document.getElementById('bigLetter');
const letterArea = document.getElementById('letterArea');

// ------------------ HELPERS ------------------
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function show(name) {
  screens.home.style.display     = name === 'home'     ? 'flex'  : 'none';
  screens.letters.style.display  = name === 'letters'  ? 'block' : 'none';
  screens.blending.style.display = name === 'blending' ? 'block' : 'none';
}

// ------------------ LETTER PRACTICE ------------------
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

function playSound() {
  const letter = CURRENT_SET[idx];
  if (audio && !audio.paused) audio.pause();
  audio = new Audio(`sounds/${letter}.mp3`);
  audio.currentTime = 0;
  audio.play().catch(() => console.warn(`Missing sound for ${letter}.mp3`));
}

function next() {
  idx++;
  if (idx >= CURRENT_SET.length) {
    CURRENT_SET = shuffle(CURRENT_SET.slice());
    idx = 0;
  }
  render();
  playSound();
}

function prev() {
  idx = (idx - 1 + CURRENT_SET.length) % CURRENT_SET.length;
  render();
  playSound();
}

// ------------------ BLENDING ------------------
function playBlend(word) {
  const letters = word.split(''); // CVC words -> simple split
  let i = 0;

  function playNext() {
    if (i < letters.length) {
      const a = new Audio(`sounds/${letters[i]}.mp3`);
      a.play().catch(()=>{});  // play each phoneme
      a.onended = () => { i++; playNext(); };
    } else {
      // Optional: play whole word if you add it later (e.g., sounds/sit.mp3)
      const w = new Audio(`sounds/${word}.mp3`);
      w.play().catch(()=>{});  // ignore if not present
    }
  }
  playNext();
}

function attachBlendButtons() {
  const btns = document.querySelectorAll('.blend-btn');
  btns.forEach(btn => {
    btn.addEventListener('click', () => playBlend(btn.dataset.word));
  });
}

// ------------------ NAV LISTENERS ------------------
// Home buttons
document.getElementById('btn-practise').addEventListener('click', () => startPractice(ALPHABET));
document.getElementById('btn-phase-1').addEventListener('click', () => startPractice(PHASE_SETS.phase1));
// Week 2 -> open blending
document.getElementById('btn-phase-2').addEventListener('click', () => { show('blending'); });
// Others continue letter practice
document.getElementById('btn-phase-3').addEventListener('click', () => startPractice(PHASE_SETS.phase3));
document.getElementById('btn-phase-4').addEventListener('click', () => startPractice(PHASE_SETS.phase4));
document.getElementById('btn-phase-5').addEventListener('click', () => startPractice(PHASE_SETS.phase5));
document.getElementById('btn-phase-6').addEventListener('click', () => startPractice(PHASE_SETS.phase6));

// Back buttons
document.getElementById('backLetters').addEventListener('click', () => show('home'));
document.getElementById('backBlend').addEventListener('click', () => show('home'));

// Letter-screen controls
document.getElementById('prevBtn').addEventListener('click', prev);
document.getElementById('nextBtn').addEventListener('click', next);

// Letter area interactions
letterArea.addEventListener('click', () => { playSound(); next(); });
letterArea.addEventListener('keydown', (e) => {
  if (e.key === ' ' || e.key === 'Enter') { playSound(); next(); }
  if (e.key === 'ArrowRight') next();
  if (e.key === 'ArrowLeft') prev();
});

// Swipe for letters
let touchStartX = 0;
letterArea.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].clientX; }, { passive:true });
letterArea.addEventListener('touchend',   (e) => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) > 40) { if (dx < 0) next(); else prev(); }
  else { playSound(); next(); }
}, { passive:true });

// ------------------ INIT ------------------
show('home');
attachBlendButtons();
