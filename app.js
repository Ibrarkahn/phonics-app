// Show A–Z in order
const LETTERS = [
  'a','b','c','d','e','f','g','h','i','j','k','l','m',
  'n','o','p','q','r','s','t','u','v','w','x','y','z'
];

const screens = {
  home: document.getElementById('home'),
  letters: document.getElementById('letters')
};
const bigLetter = document.getElementById('bigLetter');
const letterArea = document.getElementById('letterArea');

let idx = 0;
let audio;

// --- navigation ---
const show = (name) => {
  screens.home.style.display = name === 'home' ? 'flex' : 'none';
  screens.letters.style.display = name === 'letters' ? 'block' : 'none';
  if (name === 'letters') {
    render();
    // Focus so space/enter will also play sound
    setTimeout(()=> letterArea.focus(), 50);
  }
};

document.getElementById('btn-single').addEventListener('click', () => show('letters'));
document.getElementById('btn-practise').addEventListener('click', () => show('letters'));
document.getElementById('btn-two').addEventListener('click', () => alert('Two-letter blending coming soon 😊'));
document.getElementById('back').addEventListener('click', () => show('home'));

// --- core ---
function render() {
  const letter = LETTERS[idx].toUpperCase();
  bigLetter.textContent = letter;
}

function playSound() {
  const letter = LETTERS[idx];
  // Stop previous audio if still playing
  if (audio && !audio.paused) { audio.pause(); }
  audio = new Audio(`sounds/${letter}.mp3`);
  audio.currentTime = 0;
  audio.play().catch(() => {
    // If file missing, fail gracefully
    console.warn(`Missing sound for ${letter}.mp3`);
  });
}

// tap/click plays sound
letterArea.addEventListener('click', playSound);
letterArea.addEventListener('keydown', (e) => {
  if (e.key === ' ' || e.key === 'Enter') { playSound(); }
  if (e.key === 'ArrowRight') { next(); }
  if (e.key === 'ArrowLeft') { prev(); }
});

// swipe handling (touch)
let touchStartX = 0;
letterArea.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].clientX;
},{passive:true});

letterArea.addEventListener('touchend', (e) => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) > 40) {
    if (dx < 0) next();
    else prev();
  } else {
    playSound();
  }
},{passive:true});

function next() {
  idx = (idx + 1) % LETTERS.length;
  render(); playSound();
}
function prev() {
  idx = (idx - 1 + LETTERS.length) % LETTERS.length;
  render(); playSound();
}

// start on home
show('home');

