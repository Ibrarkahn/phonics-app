// ------------------ LETTER SETS ------------------
const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('');

// Phase 2 sets used for general letter practice (Week 1 still letters; Week 2 has special page)
const PHASE_SETS = {
  phase1: ['s','a','t','p'],            // Autumn 1 – Week 1
  phase4: ['ck','e','u','r'],           // still available under general practice if needed
  phase5: ['h','b','f','l'],
  phase6: ['f','ff','s','ss','l','ll','v','vv'] // Autumn 2 – Week 1 (letters list; we’ll also do blending)
};

// Week 2 specifics
const WEEK2_LETTERS = ['i','n','m','d'];
const WEEK2_WORDS   = ['sit','nap','man','dip','pat','sad','nip','mat'];

// NEW: Sequential blending lists
const BLEND_W3  = ['man','tap','dog','kit','cap','dig','kid','cog'];
const BLEND_W4  = ['mum','duck','pet','pick','set','red','sock','run'];
const BLEND_W5  = ['hug','big','fat','luck','bed','muck','kid','rub'];
const BLEND_A2W1= ['huff','off','puff','bell','hill','tell','mess','hiss','fuss','jug','jam','jet'];

let CURRENT_SET = [];   // active set for general letter practice screen
let idx = 0;

let audio;              // shared audio handle

// DOM (screens)
const screens = {
  home:     document.getElementById('home'),
  letters:  document.getElementById('letters'),
  week2:    document.getElementById('week2'),
  blendSeq: document.getElementById('blendSeq')
};

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
  screens.week2.style.display    = name === 'week2'    ? 'block' : 'none';
  screens.blendSeq.style.display = name === 'blendSeq' ? 'block' : 'none';
}

/* ------------ General letters screen logic ------------ */
const bigLetter  = document.getElementById('bigLetter');
const letterArea = document.getElementById('letterArea');

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

function playSoundCurrent() { playSoundFor(CURRENT_SET[idx]); }

function next() {
  idx++;
  if (idx >= CURRENT_SET.length) {
    CURRENT_SET = shuffle(CURRENT_SET.slice());
    idx = 0;
  }
  render(); playSoundCurrent();
}

function prev() {
  idx = (idx - 1 + CURRENT_SET.length) % CURRENT_SET.length;
  render(); playSoundCurrent();
}

/* ------------ Week 2 combined page (letters) ------------ */
const bigLetterW2  = document.getElementById('bigLetterW2');
const letterAreaW2 = document.getElementById('letterAreaW2');

let w2Set = shuffle(WEEK2_LETTERS.slice());
let w2Idx = 0;

function renderW2() { bigLetterW2.textContent = w2Set[w2Idx].toUpperCase(); }
function nextW2()   { w2Idx++; if (w2Idx>=w2Set.length){ w2Set=shuffle(w2Set.slice()); w2Idx=0; } renderW2(); playSoundFor(w2Set[w2Idx]); }
function prevW2()   { w2Idx = (w2Idx-1+w2Set.length)%w2Set.length; renderW2(); playSoundFor(w2Set[w2Idx]); }

/* ------------ Week 2 blending (grid) ------------ */
function playBlend(word) {
  const letters = word.split('');
  let i = 0;
  function playNext() {
    if (i < letters.length) {
      const a = new Audio(`sounds/${letters[i]}.mp3`);
      a.play().catch(()=>{});
      a.onended = () => { i++; playNext(); };
    } else {
      const w = new Audio(`sounds/${word}.mp3`);
      w.play().catch(()=>{});
    }
  }
  playNext();
}

function attachBlendButtonsWeek2() {
  document.querySelectorAll('#paneBlendW2 .blend-btn').forEach(btn => {
    btn.addEventListener('click', () => playBlend(btn.dataset.word));
  });
}

/* ------------ Sequential blending screen (Weeks 3/4/5/A2W1) ------------ */
const blendSeqTitle = document.getElementById('blendSeqTitle');
const blendSeqArea  = document.getElementById('blendSeqArea');
const bigWord       = document.getElementById('bigWord');

let CURRENT_WORDS = [];
let wIdx = 0;

function startBlending(words, titleText) {
  CURRENT_WORDS = shuffle(words.slice());
  wIdx = 0;
  bigWord.textContent = CURRENT_WORDS[wIdx];
  blendSeqTitle.textContent = titleText || 'Blending Practice';
  show('blendSeq');
  setTimeout(()=>blendSeqArea.focus(), 50);
}

function playCurrentWordBlend() { playBlend(CURRENT_WORDS[wIdx]); }

function nextWord() {
  wIdx++;
  if (wIdx >= CURRENT_WORDS.length) {
    CURRENT_WORDS = shuffle(CURRENT_WORDS.slice());
    wIdx = 0;
  }
  bigWord.textContent = CURRENT_WORDS[wIdx];
  playCurrentWordBlend();
}

function prevWord() {
  wIdx = (wIdx - 1 + CURRENT_WORDS.length) % CURRENT_WORDS.length;
  bigWord.textContent = CURRENT_WORDS[wIdx];
  playCurrentWordBlend();
}

/* ------------ Listeners ------------ */
// Home
document.getElementById('btn-practise').addEventListener('click', () => startPractice(ALPHABET));
document.getElementById('btn-phase-1').addEventListener('click', () => startPractice(PHASE_SETS.phase1));
document.getElementById('btn-phase-2').addEventListener('click', () => { show('week2'); activateWeek2Tab('letters'); renderW2(); });
document.getElementById('btn-phase-3').addEventListener('click', () => startBlending(BLEND_W3, 'Autumn 1 – Week 3'));
document.getElementById('btn-phase-4').addEventListener('click', () => startBlending(BLEND_W4, 'Autumn 1 – Week 4'));
document.getElementById('btn-phase-5').addEventListener('click', () => startBlending(BLEND_W5, 'Autumn 1 – Week 5'));
document.getElementById('btn-phase-6').addEventListener('click', () => startBlending(BLEND_A2W1, 'Autumn 2 – Week 1'));

// Back
document.getElementById('backLetters').addEventListener('click', () => show('home'));
document.getElementById('backWeek2').addEventListener('click', () => show('home'));
document.getElementById('backBlendSeq').addEventListener('click', () => show('home'));

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
function activateWeek2Tab(which) {
  const tabLetters = document.getElementById('tabLettersW2');
  const tabBlend   = document.getElementById('tabBlendW2');
  const paneLetters= document.getElementById('paneLettersW2');
  const paneBlend  = document.getElementById('paneBlendW2');
  if (which === 'letters') {
    tabLetters.classList.add('active'); tabBlend.classList.remove('active');
    paneLetters.classList.add('active'); paneBlend.classList.remove('active');
    setTimeout(()=>letterAreaW2.focus(), 50);
  } else {
    tabBlend.classList.add('active'); tabLetters.classList.remove('active');
    paneBlend.classList.add('active'); paneLetters.classList.remove('active');
  }
}
document.getElementById('tabLettersW2').addEventListener('click', ()=> activateWeek2Tab('letters'));
document.getElementById('tabBlendW2').addEventListener('click',   ()=> activateWeek2Tab('blend'));

// Week 2 blending buttons (grid)
attachBlendButtonsWeek2();

// Sequential blending controls
document.getElementById('prevWordBtn').addEventListener('click', prevWord);
document.getElementById('nextWordBtn').addEventListener('click', nextWord);
blendSeqArea.addEventListener('click', () => { playCurrentWordBlend(); nextWord(); });
let wordTouchStartX = 0;
blendSeqArea.addEventListener('touchstart', (e)=>{ wordTouchStartX = e.changedTouches[0].clientX; }, {passive:true});
blendSeqArea.addEventListener('touchend',   (e)=>{
  const dx = e.changedTouches[0].clientX - wordTouchStartX;
  if (Math.abs(dx) > 40) { if (dx < 0) nextWord(); else prevWord(); }
  else { playCurrentWordBlend(); nextWord(); }
},{passive:true});
blendSeqArea.addEventListener('keydown', (e)=>{
  if (e.key === ' ' || e.key === 'Enter') { playCurrentWordBlend(); nextWord(); }
  if (e.key === 'ArrowRight') nextWord();
  if (e.key === 'ArrowLeft')  prevWord();
});

// Init
show('home');
