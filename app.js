// ------------------ VARIABLES ------------------
const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('');
let LETTERS = [];
let idx = 0;
let audio;

const screens = {
  home: document.getElementById('home'),
  letters: document.getElementById('letters')
};
const bigLetter = document.getElementById('bigLetter');
const letterArea = document.getElementById('letterArea');

// ------------------ FUNCTIONS ------------------

// Fisher–Yates shuffle
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Reset round with fresh random order
function resetRound() {
  LETTERS = shuffle(ALPHABET.slice());
  idx = 0;
}

function render() {
  const letter = LETTERS[idx].toUpperCase();
  bigLetter.textContent = letter;
}

function playSound() {
  const letter = LETTERS[idx];
  if (audio && !audio.paused) audio.pause();
  audio = new Audio(`sounds/${letter}.mp3`);
  audio.currentTime = 0;
  audio.play().catch(() => console.warn(`Missing sound for ${letter}.mp3`));
}

function next() {
  idx++;
  if (idx >= LETTERS.length) resetRound();
  render();
  playSound();
}

function prev() {
  idx = (idx - 1 + LETTERS.length) % LETTERS.length;
  render();
  playSound();
}

// ------------------ NAVIGATION ------------------

const show = (name) => {
  screens.home.style.display = name === 'home' ? 'flex' : 'none';
  screens.letters.style.display = name === 'letters' ? 'block' : 'none';
  if (name === 'letters') {
    resetRound();
    render();
    setTimeout(() => letterArea.focus(), 50);
  }
};

document.getElementById('btn-single').addEventListener('click', () => show('letters'));
document.getElementById('btn-practise').addEventListener('click', () => show('letters'));
document.getElementById('btn-two').addEventListener('click', () => alert('Blending feature coming soon 😊'));
document.getElementById('back').addEventListener('click', () => show('home'));
document.getElementById('prevBtn').addEventListener('click', prev);
document.getElementById('nextBtn').addEventListener('click', next);

// ------------------ EVENTS ------------------

// Tap or key press
letterArea.addEventListener('click', playSound);
letterArea.addEventListener('keydown', (e) => {
  if (e.key === ' ' || e.key === 'Enter') playSound();
  if (e.key === 'ArrowRight') next();
  if (e.key === 'ArrowLeft') prev();
});

// Swipe detection
let touchStartX = 0;
letterArea.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].clientX;
}, { passive: true });

letterArea.addEventListener('touchend', (e) => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) > 40) {
    if (dx < 0) next();
    else prev();
  } else {
    playSound();
  }
}, { passive: true });

// ------------------ INIT ------------------
show('home');
