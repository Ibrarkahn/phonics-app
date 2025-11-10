// ------------------ LETTER/WORD DATA ------------------
const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('');

// Phase 2 (general letters)
const PHASE_SETS = {
  phase1: ['s','a','t','p'],
  phase4: ['ck','e','u','r'],
  phase5: ['h','b','f','l'],
  phase6: ['f','ff','s','ss','l','ll','v','vv']
};

// Week 2 content
const WEEK2_LETTERS = ['i','n','m','d'];
const WEEK2_WORDS   = ['sit','nap','man','dip','pat','sad','nip','mat'];

// Sequential blending for other weeks
const BLEND_W3   = ['man','tap','dog','kit','cap','dig','kid','cog'];
const BLEND_W4   = ['mum','duck','pet','pick','set','red','sock','run'];
const BLEND_W5   = ['hug','big','fat','luck','bed','muck','kid','rub'];
const BLEND_A2W1 = ['huff','off','puff','bell','hill','tell','mess','hiss','fuss','jug','jam','jet'];

// ------------------ GLOBAL STATE ------------------
let audio;

// Screens
const screens = {
  home:     document.getElementById('home'),
  letters:  document.getElementById('letters'),
  week2:    document.getElementById('week2'),
  blendSeq: document.getElementById('blendSeq'),
};

function show(name) {
  screens.home.style.display     = name === 'home'     ? 'flex'  : 'none';
  screens.letters.style.display  = name === 'letters'  ? 'block' : 'none';
  screens.week2.style.display    = name === 'week2'    ? 'block' : 'none';
  screens.blendSeq.style.display = name === 'blendSeq' ? 'block' : 'none';
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function playSoundFor(letterOrWord) {
  if (audio && !audio.paused) audio.pause();
  audio = new Audio(`sounds/${letterOrWord}.mp3`);
  audio.currentTime = 0;
  audio.play().catch(()=>{});
}

/* ======================================================
   GENERAL LETTER PRACTICE (A–Z, W1, W4, W5, A2W1 letters)
====================================================== */
const bigLetter  = document.getElementById('bigLetter');
const letterArea = document.getElementById('letterArea');
let CURRENT_SET = [], idx = 0;

function startPractice(lettersArray) {
  CURRENT_SET = shuffle(lettersArray.slice());
  idx = 0;
  show('letters');
  renderLetter();
  setTimeout(()=>letterArea.focus(), 50);
}
function renderLetter(){ bigLetter.textContent = CURRENT_SET[idx].toUpperCase(); }
function nextLetter(){ idx = (idx+1) % CURRENT_SET.length; renderLetter(); playSoundFor(CURRENT_SET[idx]); }
function prevLetter(){ idx = (idx-1+CURRENT_SET.length)%CURRENT_SET.length; renderLetter(); playSoundFor(CURRENT_SET[idx]); }

document.getElementById('prevBtn').addEventListener('click', prevLetter);
document.getElementById('nextBtn').addEventListener('click', nextLetter);
letterArea.addEventListener('click', ()=>{ playSoundFor(CURRENT_SET[idx]); nextLetter(); });
let touchStartX = 0;
letterArea.addEventListener('touchstart',(e)=>{touchStartX=e.changedTouches[0].clientX;},{passive:true});
letterArea.addEventListener('touchend',(e)=>{
  const dx=e.changedTouches[0].clientX-touchStartX;
  if(Math.abs(dx)>40){ dx<0?nextLetter():prevLetter(); } else { playSoundFor(CURRENT_SET[idx]); nextLetter(); }
},{passive:true});

/* ======================================================
   WEEK 2: LETTERS (own area) + SINGLE-WORD BLENDING
====================================================== */
// letters
const bigLetterW2  = document.getElementById('bigLetterW2');
const letterAreaW2 = document.getElementById('letterAreaW2');
let w2Letters = shuffle(WEEK2_LETTERS.slice()), w2LIdx = 0;

function renderW2Letter(){ bigLetterW2.textContent = w2Letters[w2LIdx].toUpperCase(); }
function nextW2Letter(){ w2LIdx=(w2LIdx+1)%w2Letters.length; renderW2Letter(); playSoundFor(w2Letters[w2LIdx]); }
function prevW2Letter(){ w2LIdx=(w2LIdx-1+w2Letters.length)%w2Letters.length; renderW2Letter(); playSoundFor(w2Letters[w2LIdx]); }

document.getElementById('prevBtnW2').addEventListener('click', prevW2Letter);
document.getElementById('nextBtnW2').addEventListener('click', nextW2Letter);
letterAreaW2.addEventListener('click', ()=>{ playSoundFor(w2Letters[w2LIdx]); nextW2Letter(); });
let w2TouchStartX=0;
letterAreaW2.addEventListener('touchstart',(e)=>{w2TouchStartX=e.changedTouches[0].clientX;},{passive:true});
letterAreaW2.addEventListener('touchend',(e)=>{
  const dx=e.changedTouches[0].clientX-w2TouchStartX;
  if(Math.abs(dx)>40){ dx<0?nextW2Letter():prevW2Letter(); } else { playSoundFor(w2Letters[w2LIdx]); nextW2Letter(); }
},{passive:true});

// blending (single word at a time)
const bigWordW2    = document.getElementById('bigWordW2');
const blendAreaW2  = document.getElementById('blendSeqAreaW2');
let w2Words = shuffle(WEEK2_WORDS.slice()), w2WIdx = 0;

function renderW2Word(){ bigWordW2.textContent = w2Words[w2WIdx]; }
function playBlend(word){
  const parts = word.split('');
  let i=0; const step=()=>{ if(i<parts.length){ const a=new Audio(`sounds/${parts[i]}.mp3`); a.play().catch(()=>{}); a.onended=()=>{i++;step();}; } else { new Audio(`sounds/${word}.mp3`).play().catch(()=>{}); } };
  step();
}
function playCurrentW2(){ playBlend(w2Words[w2WIdx]); }
function nextW2Word(){ w2WIdx=(w2WIdx+1)%w2Words.length; renderW2Word(); playCurrentW2(); }
function prevW2Word(){ w2WIdx=(w2WIdx-1+w2Words.length)%w2Words.length; renderW2Word(); playCurrentW2(); }

document.getElementById('prevWordBtnW2').addEventListener('click', prevW2Word);
document.getElementById('nextWordBtnW2').addEventListener('click', nextW2Word);
blendAreaW2.addEventListener('click', ()=>{ playCurrentW2(); nextW2Word(); });
let w2WordTouchStart=0;
blendAreaW2.addEventListener('touchstart',(e)=>{w2WordTouchStart=e.changedTouches[0].clientX;},{passive:true});
blendAreaW2.addEventListener('touchend',(e)=>{
  const dx=e.changedTouches[0].clientX-w2WordTouchStart;
  if(Math.abs(dx)>40){ dx<0?nextW2Word():prevW2Word(); } else { playCurrentW2(); nextW2Word(); }
},{passive:true});

/* Tabs show/hide + init */
function activateWeek2Tab(which){
  const tabL=document.getElementById('tabLettersW2');
  const tabB=document.getElementById('tabBlendW2');
  const paneL=document.getElementById('paneLettersW2');
  const paneB=document.getElementById('paneBlendW2');
  if(which==='letters'){
    tabL.classList.add('active'); tabB.classList.remove('active');
    paneL.classList.add('active'); paneB.classList.remove('active');
    renderW2Letter(); setTimeout(()=>letterAreaW2.focus(),50);
  }else{
    tabB.classList.add('active'); tabL.classList.remove('active');
    paneB.classList.add('active'); paneL.classList.remove('active');
    renderW2Word(); setTimeout(()=>blendAreaW2.focus(),50);
  }
}

document.getElementById('tabLettersW2').addEventListener('click', ()=>activateWeek2Tab('letters'));
document.getElementById('tabBlendW2').addEventListener('click',   ()=>activateWeek2Tab('blend'));

/* ======================================================
   SEQUENTIAL BLENDING FOR OTHER WEEKS
====================================================== */
const blendSeqTitle = document.getElementById('blendSeqTitle');
const blendSeqArea  = document.getElementById('blendSeqArea');
const bigWord       = document.getElementById('bigWord');
let CURRENT_WORDS=[], wIdx=0;

function startBlending(words, title){
  CURRENT_WORDS = shuffle(words.slice()); wIdx=0;
  bigWord.textContent = CURRENT_WORDS[wIdx];
  blendSeqTitle.textContent = title || 'Blending Practice';
  show('blendSeq'); setTimeout(()=>blendSeqArea.focus(),50);
}
function playCurrentWord(){ playBlend(CURRENT_WORDS[wIdx]); }
function nextWord(){ wIdx=(wIdx+1)%CURRENT_WORDS.length; bigWord.textContent=CURRENT_WORDS[wIdx]; playCurrentWord(); }
function prevWord(){ wIdx=(wIdx-1+CURRENT_WORDS.length)%CURRENT_WORDS.length; bigWord.textContent=CURRENT_WORDS[wIdx]; playCurrentWord(); }

document.getElementById('prevWordBtn').addEventListener('click', prevWord);
document.getElementById('nextWordBtn').addEventListener('click', nextWord);
blendSeqArea.addEventListener('click', ()=>{ playCurrentWord(); nextWord(); });
let wordTouchStart=0;
blendSeqArea.addEventListener('touchstart',(e)=>{wordTouchStart=e.changedTouches[0].clientX;},{passive:true});
blendSeqArea.addEventListener('touchend',(e)=>{
  const dx=e.changedTouches[0].clientX-wordTouchStart;
  if(Math.abs(dx)>40){ dx<0?nextWord():prevWord(); } else { playCurrentWord(); nextWord(); }
},{passive:true});

/* ======================================================
   NAV: HOME & WEEK BUTTONS
====================================================== */
document.getElementById('btn-practise').addEventListener('click', () => startPractice(ALPHABET));
document.getElementById('btn-phase-1').addEventListener('click', () => startPractice(PHASE_SETS.phase1));
document.getElementById('btn-phase-2').addEventListener('click', () => { show('week2'); activateWeek2Tab('letters'); });
document.getElementById('btn-phase-3').addEventListener('click', () => startBlending(BLEND_W3, 'Autumn 1 – Week 3'));
document.getElementById('btn-phase-4').addEventListener('click', () => startBlending(BLEND_W4, 'Autumn 1 – Week 4'));
document.getElementById('btn-phase-5').addEventListener('click', () => startBlending(BLEND_W5, 'Autumn 1 – Week 5'));
document.getElementById('btn-phase-6').addEventListener('click', () => startBlending(BLEND_A2W1, 'Autumn 2 – Week 1'));

document.getElementById('backLetters').addEventListener('click', ()=>show('home'));
document.getElementById('backWeek2').addEventListener('click',   ()=>show('home'));
document.getElementById('backBlendSeq').addEventListener('click',()=>show('home'));

// Init
show('home');
