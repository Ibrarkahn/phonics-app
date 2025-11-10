// ------------------ SETS ------------------
const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('');
const PHASE_SETS = {
  phase1: ['s','a','t','p'],
  phase2: ['i','n','m','d'],
  phase3: ['g','o','c','k']
};

let CURRENT_SET = [];   // active set while practising
let idx = 0;
let audio;

// DOM
const screens = {
  home: document.getElementById('home'),
  letters: document.getElementById('letters')
};
const bigLetter = document.getElementById('bigLetter');
const letterArea = document.getElementById('letterArea');

// ------------------ HELPERS ------------------
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function startPractice(lettersArray) {
  // copy + shuffle so original sets stay intact
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
    // finished the set — reshuffle and start again
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

// ------------------ NAV ------------------
const show = (name) => {
  screens.home.style.display = name === 'home' ? 'flex' : 'none';
  screens.letters.style.display = name === 'letters' ? 'block' : 'none';
};

document.getElementById('back').addEventListener('click', () => show('home'));

// Main-page buttons
document.getElementById('btn-practise').addEventListener('click', () => startPractice(ALPHABET));
document.getElementById('btn-phase-1').addEventListener('click', () => startPractice(PHASE_SETS.phase1));
document.getElementById('btn-phase-2').addEventListener('click', () => startPractice(PHASE_SETS.phase2));
document.getElementById('btn-phase-3').addEventListener('click', () => startPractice(PHASE_SETS.phase3));

// Letter-screen controls
document.getElementById('prevBtn').addEventListener('click', prev);
document.getElementById('nextBtn').addEventListener('click', next);

// ------------------ EVENTS ------------------
// Tap → play + next
letterArea.addEventListener('click', () => { playSound(); next(); });

// Keyboard
letterArea.addEventListener('keydown', (e) => {
  if (e.key === ' ' || e.key === 'Enter') { playSound(); next(); }
  if (e.key === 'ArrowRight') next();
  if (e.key === 'ArrowLeft') prev();
});

// Swipe
let touchStartX = 0;
letterArea.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].clientX;
}, { passive: true });

letterArea.addEventListener('touchend', (e) => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) > 40) {
    if (dx < 0) next(); else prev();
  } else {
    playSound(); next();
  }
}, { passive: true });

// ------------------ INIT ------------------
show('home');
