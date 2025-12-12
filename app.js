/* ===================== Data ===================== */
const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('');

// Phase 2 (general letters)
const PHASE_SETS = {
  phase1: ['s','a','t','p'],
  phase4: ['ck','e','u','r'],
  phase5: ['h','b','f','l'],
  phase6: ['f','ff','s','ss','l','ll','v','vv']
};

// Week 2
const WEEK2_LETTERS = ['i','n','m','d'];
const WEEK2_WORDS   = ['sit','nap','man','dip','pat','sad','nip','mat'];

// Week 3
const WEEK3_LETTERS = ['g','o','c','k'];
const WEEK3_WORDS   = ['man','tap','dog','kit','cap','dig','kid','cog'];

// Week 4
const WEEK4_LETTERS = ['ck','e','u','r'];
const WEEK4_WORDS   = ['mum','duck','pet','pick','set','red','sock','run'];

// Week 5
const WEEK5_LETTERS = ['h','b','f','l'];
const WEEK5_WORDS   = ['hug','big','fat','luck','bed','muck','kid','rub'];

// Autumn 2 Week 1 
const A2W1_LETTERS = ['f','ff','s','ss','l','ll','v','vv'];
const A2W1_WORDS   = ['huff','off','puff','bell','hill','tell','mess','hiss','fuss','jug','jam','jet'];

// Autumn 2 Week 2
const A2W2_LETTERS = ['v','w','x','y'];
const A2W2_WORDS   = ['van','vet','wet','wig','fox','six','yes','yum'];

// Autumn 2 Week 3
const A2W3_LETTERS = ['z','qu','ch'];
const A2W3_WORDS   = ['zip','zap','buzz','fizz','quick','quit','chips','rich'];

// Autumn 2 Week 4
const A2W4_LETTERS = ['sh','th','ng','nk'];
const A2W4_WORDS   = ['shell','dish','this','moth','ring','thing','pink','sink'];

// Autumn 2 – Week 5
const A2W5_LETTERS = ['f','l','s','j','v','w','x','y','z','qu','ch','sh','ng','th','nk'];
const A2W5_WORDS   = ['zips','ships','chips','rings','pins','dogs','sings','ducks'];

// Spring 1 – Week 1
const S1W1_LETTERS = ['ai','ee','igh','oa'];
const S1W1_WORDS   = ['pain','see','sight','coat','hail','jeep','high','road'];

// Spring 1 – Week 2
const S1W2_LETTERS = ['oo-long','oo-short','ar','or'];
const S1W2_WORDS   = ['zoo','good','bark','pork','room','hook','yard','born'];

// Spring 1 – Week 3
const S1W3_LETTERS = ['ur','ow','oi','ear'];
const S1W3_WORDS   = ['surf','howl','oil','hear','turn','down','join','tear'];

// Spring 1 – Week 4
const S1W4_LETTERS = ['air','er'];
const S1W4_WORDS   = ['hair','boxer','letter','rubber','chair','summer','rubbish','coffee'];

// Spring 1 – Week 5
const S1W5_LETTERS = [
  'ai','ee','ur','ow','igh','oa','oi','ear',
  'oo-long','oo-short','air','er','ar','or'
];
const S1W5_WORDS = [
  'laptop','popcorn','market','raincoat',
  'sunset','starfish','ticket','melon'
];



/* ===================== Utils ===================== */
let audio;
let currentBlend = null;   // 🔸 controller for cancelling ongoing blends

// Phonics clusters that should be treated as a single sound
const PHONICS_CLUSTERS = [
  'ck','ff','ss','ll','vv',  // double consonants
  'sh','ch','th','ng','nk', // digraphs
  'qu','zz',                // other common clusters

  // vowel digraphs / trigraphs (Phase 5)
  'ai','ee','igh','oa','oo','ur','ow','oi','ear','air','er','ar','or'
];

// Display helper (keeps special sound keys like "oo-long" while showing "oo")
function displayKey(key){
  if (key === 'oo-long' || key === 'oo-short') return 'oo';
  return key;
}
function displayGrapheme(key){
  if (key === 'oo-long' || key === 'oo-short') return 'oo';
  return key;
}

// Split a word into phonics parts (e.g. "duck" -> ["d","u","ck"])
function splitForPhonics(word){
  const parts = [];
  let i = 0;

  while (i < word.length){
    let matched = false;

    for (const cluster of PHONICS_CLUSTERS){
      if (word.startsWith(cluster, i)){
        parts.push(cluster);
        i += cluster.length;
        matched = true;
        break;
      }
    }

    if (!matched){
      parts.push(word[i]);
      i++;
    }
  }

  return parts;
}



const qs  = (s) => document.querySelector(s);

function show(name){
  const screens = [
    'home','letters','week2','week3','week4','week5',
    'a2w1','weekA2W2','weekA2W3','weekA2W4','weekA2W5',
    'spring1w1','spring1w2','spring1w3','spring1w4','spring1w5'
  ];

  screens.forEach(id => {
    const el = qs('#' + id);
    if (!el) return; // ✅ prevent crash
    el.style.display = (id === name) ? 'block' : 'none';
  });

  if (name === 'home') {
    const home = qs('#home');
    if (home) home.style.display = 'flex';
  }
}


function shuffle(a){
  // randomisation removed: keep original order
  return a;
}

function playSoundFor(key){
  if (audio && !audio.paused) audio.pause();
  audio = new Audio(`sounds/${key}.mp3`);
  audio.currentTime = 0;
  audio.play().catch(()=>{});
}

// 🔸 Blend helper: play sounds for each phonics part (no final word),
// and cancel any previous blend still in progress
function playBlend(word){
  // cancel previous blend if any
  if (currentBlend && currentBlend.audio) {
    currentBlend.cancelled = true;
    currentBlend.audio.pause();
    currentBlend.audio.currentTime = 0;
  }

  const controller = { cancelled: false, audio: null };
  currentBlend = controller;

  // Use phonics-aware splitting, e.g.
  // "duck" -> ["d","u","ck"], "huff" -> ["h","u","ff"], "bell" -> ["b","e","ll"]
  const parts = splitForPhonics(word);
  let i = 0;

  const step = () => {
    if (controller.cancelled) return;

    if (i < parts.length){
      const soundKey = parts[i];           // e.g. "ck", "ff", "s"
      const a = new Audio(`sounds/${soundKey}.mp3`);
      controller.audio = a;
      a.play().catch(()=>{});
      a.onended = () => {
        if (controller.cancelled) return;
        i++;
        step();
      };
    } else {
      // ✅ finished all parts – do NOT play the full word
      controller.audio = null;
    }
  };

  step();
}



/* ===================== General letter practice ===================== */
let CURRENT_SET=[], idx=0;
const bigLetter  = qs('#bigLetter');
const letterArea = qs('#letterArea');

function startPractice(letters){
  CURRENT_SET = letters.slice();
  idx = 0;
  show('letters');
  renderLetter();
  setTimeout(()=>letterArea.focus(),50);
}
function renderLetter(){ bigLetter.textContent = displayKey(CURRENT_SET[idx]); }
function nextLetter(){ idx=(idx+1)%CURRENT_SET.length; renderLetter(); playSoundFor(CURRENT_SET[idx]); }
function prevLetter(){ idx=(idx-1+CURRENT_SET.length)%CURRENT_SET.length; renderLetter(); playSoundFor(CURRENT_SET[idx]); }

qs('#prevBtn').addEventListener('click', prevLetter);
qs('#nextBtn').addEventListener('click', nextLetter);
letterArea.addEventListener('click', ()=>{ playSoundFor(CURRENT_SET[idx]); nextLetter(); });

let touchStartX=0;
letterArea.addEventListener('touchstart',e=>{touchStartX=e.changedTouches[0].clientX;},{passive:true});
letterArea.addEventListener('touchend',e=>{
  const dx=e.changedTouches[0].clientX-touchStartX;
  if(Math.abs(dx)>40){ dx<0?nextLetter():prevLetter(); } else { playSoundFor(CURRENT_SET[idx]); nextLetter(); }
},{passive:true});


/* ===== Week 2: letters + single-word blending ===== */
let w2Letters = WEEK2_LETTERS.slice(), w2LIdx=0;
const bigLetterW2  = qs('#bigLetterW2');
const letterAreaW2 = qs('#letterAreaW2');
function renderW2Letter(){ bigLetterW2.textContent = displayKey(w2Letters[w2LIdx]); }
function nextW2Letter(){ w2LIdx=(w2LIdx+1)%w2Letters.length; renderW2Letter(); playSoundFor(w2Letters[w2LIdx]); }
function prevW2Letter(){ w2LIdx=(w2LIdx-1+w2Letters.length)%w2Letters.length; renderW2Letter(); playSoundFor(w2Letters[w2LIdx]); }
qs('#prevBtnW2').addEventListener('click', prevW2Letter);
qs('#nextBtnW2').addEventListener('click', nextW2Letter);
letterAreaW2.addEventListener('click', ()=>{ playSoundFor(w2Letters[w2LIdx]); nextW2Letter(); });

let w2TouchStart=0;
letterAreaW2.addEventListener('touchstart',e=>{w2TouchStart=e.changedTouches[0].clientX;},{passive:true});
letterAreaW2.addEventListener('touchend',e=>{
  const dx=e.changedTouches[0].clientX-w2TouchStart;
  if(Math.abs(dx)>40){ dx<0?nextW2Letter():prevW2Letter(); } else { playSoundFor(w2Letters[w2LIdx]); nextW2Letter(); }
},{passive:true});

let w2Words = WEEK2_WORDS.slice(), w2WIdx=0;
const bigWordW2   = qs('#bigWordW2');
const blendAreaW2 = qs('#blendSeqAreaW2');
function renderW2Word(){ bigWordW2.textContent = w2Words[w2WIdx]; }
function playCurrentW2(){ playBlend(w2Words[w2WIdx]); }
function nextW2Word(){ w2WIdx=(w2WIdx+1)%w2Words.length; renderW2Word(); playCurrentW2(); }
function prevW2Word(){ w2WIdx=(w2WIdx-1+w2Words.length)%w2Words.length; renderW2Word(); playCurrentW2(); }

qs('#prevWordBtnW2').addEventListener('click', prevW2Word);
qs('#nextWordBtnW2').addEventListener('click', nextW2Word);

// Tap on word = replay once
blendAreaW2.addEventListener('click', ()=>{ playCurrentW2(); });

function activateWeek2Tab(which){
  const tabL=qs('#tabLettersW2'), tabB=qs('#tabBlendW2');
  const paneL=qs('#paneLettersW2'), paneB=qs('#paneBlendW2');
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
qs('#tabLettersW2').addEventListener('click', ()=>activateWeek2Tab('letters'));
qs('#tabBlendW2').addEventListener('click',   ()=>activateWeek2Tab('blend'));


/* ===== Week 3: letters + single-word blending ===== */
let w3Letters = WEEK3_LETTERS.slice(), w3LIdx=0;
const bigLetterW3  = qs('#bigLetterW3');
const letterAreaW3 = qs('#letterAreaW3');
function renderW3Letter(){ bigLetterW3.textContent = displayKey(w3Letters[w3LIdx]); }
function nextW3Letter(){ w3LIdx=(w3LIdx+1)%w3Letters.length; renderW3Letter(); playSoundFor(w3Letters[w3LIdx]); }
function prevW3Letter(){ w3LIdx=(w3LIdx-1+w3Letters.length)%w3Letters.length; renderW3Letter(); playSoundFor(w3Letters[w3LIdx]); }

qs('#prevBtnW3').addEventListener('click', prevW3Letter);
qs('#nextBtnW3').addEventListener('click', nextW3Letter);
letterAreaW3.addEventListener('click', ()=>{ playSoundFor(w3Letters[w3LIdx]); nextW3Letter(); });

let w3TouchStart=0;
letterAreaW3.addEventListener('touchstart',e=>{w3TouchStart=e.changedTouches[0].clientX;},{passive:true});
letterAreaW3.addEventListener('touchend',e=>{
  const dx=e.changedTouches[0].clientX-w3TouchStart;
  if(Math.abs(dx)>40){ dx<0?nextW3Letter():prevW3Letter(); } else { playSoundFor(w3Letters[w3LIdx]); nextW3Letter(); }
},{passive:true});

let w3Words = WEEK3_WORDS.slice(), w3WIdx=0;
const bigWordW3   = qs('#bigWordW3');
const blendAreaW3 = qs('#blendSeqAreaW3');
function renderW3Word(){ bigWordW3.textContent = w3Words[w3WIdx]; }
function playCurrentW3(){ playBlend(w3Words[w3WIdx]); }
function nextW3Word(){ w3WIdx=(w3WIdx+1)%w3Words.length; renderW3Word(); playCurrentW3(); }
function prevW3Word(){ w3WIdx=(w3WIdx-1+w3Words.length)%w3Words.length; renderW3Word(); playCurrentW3(); }

qs('#prevWordBtnW3').addEventListener('click', prevW3Word);
qs('#nextWordBtnW3').addEventListener('click', nextW3Word);

// Tap = replay current word
blendAreaW3.addEventListener('click', ()=>{ playCurrentW3(); });

function activateWeek3Tab(which){
  const tabL=qs('#tabLettersW3'), tabB=qs('#tabBlendW3');
  const paneL=qs('#paneLettersW3'), paneB=qs('#paneBlendW3');
  if(which==='letters'){
    tabL.classList.add('active'); tabB.classList.remove('active');
    paneL.classList.add('active'); paneB.classList.remove('active');
    renderW3Letter(); setTimeout(()=>letterAreaW3.focus(),50);
  }else{
    tabB.classList.add('active'); tabL.classList.remove('active');
    paneB.classList.add('active'); paneL.classList.remove('active');
    renderW3Word(); setTimeout(()=>blendAreaW3.focus(),50);
  }
}
qs('#tabLettersW3').addEventListener('click', ()=>activateWeek3Tab('letters'));
qs('#tabBlendW3').addEventListener('click',   ()=>activateWeek3Tab('blend'));


/* ===== Week 4: letters + single-word blending ===== */
let w4Letters = WEEK4_LETTERS.slice(), w4LIdx=0;
const bigLetterW4  = qs('#bigLetterW4');
const letterAreaW4 = qs('#letterAreaW4');
function renderW4Letter(){ bigLetterW4.textContent = displayKey(w4Letters[w4LIdx]); }
function nextW4Letter(){ w4LIdx=(w4LIdx+1)%w4Letters.length; renderW4Letter(); playSoundFor(w4Letters[w4LIdx]); }
function prevW4Letter(){ w4LIdx=(w4LIdx-1+w4Letters.length)%w4Letters.length; renderW4Letter(); playSoundFor(w4Letters[w4LIdx]); }

qs('#prevBtnW4').addEventListener('click', prevW4Letter);
qs('#nextBtnW4').addEventListener('click', nextW4Letter);
letterAreaW4.addEventListener('click', ()=>{ playSoundFor(w4Letters[w4LIdx]); nextW4Letter(); });

let w4TouchStart=0;
letterAreaW4.addEventListener('touchstart',e=>{w4TouchStart=e.changedTouches[0].clientX;},{passive:true});
letterAreaW4.addEventListener('touchend',e=>{
  const dx=e.changedTouches[0].clientX-w4TouchStart;
  if(Math.abs(dx)>40){ dx<0?nextW4Letter():prevW4Letter(); } else { playSoundFor(w4Letters[w4LIdx]); nextW4Letter(); }
},{passive:true});

let w4Words = WEEK4_WORDS.slice(), w4WIdx=0;
const bigWordW4   = qs('#bigWordW4');
const blendAreaW4 = qs('#blendSeqAreaW4');
function renderW4Word(){ bigWordW4.textContent = w4Words[w4WIdx]; }
function playCurrentW4(){ playBlend(w4Words[w4WIdx]); }
function nextW4Word(){ w4WIdx=(w4WIdx+1)%w4Words.length; renderW4Word(); playCurrentW4(); }
function prevW4Word(){ w4WIdx=(w4WIdx-1+w4Words.length)%w4Words.length; renderW4Word(); playCurrentW4(); }

qs('#prevWordBtnW4').addEventListener('click', prevW4Word);
qs('#nextWordBtnW4').addEventListener('click', nextW4Word);

// Tap = replay word
blendAreaW4.addEventListener('click', ()=>{ playCurrentW4(); });

function activateWeek4Tab(which){
  const tabL=qs('#tabLettersW4'), tabB=qs('#tabBlendW4');
  const paneL=qs('#paneLettersW4'), paneB=qs('#paneBlendW4');
  if(which==='letters'){
    tabL.classList.add('active'); tabB.classList.remove('active');
    paneL.classList.add('active'); paneB.classList.remove('active');
    renderW4Letter(); setTimeout(()=>letterAreaW4.focus(),50);
  }else{
    tabB.classList.add('active'); tabL.classList.remove('active');
    paneB.classList.add('active'); paneL.classList.remove('active');
    renderW4Word(); setTimeout(()=>blendAreaW4.focus(),50);
  }
}
qs('#tabLettersW4').addEventListener('click', ()=>activateWeek4Tab('letters'));
qs('#tabBlendW4').addEventListener('click',   ()=>activateWeek4Tab('blend'));


/* ===== Week 5: letters + single-word blending ===== */
let w5Letters = WEEK5_LETTERS.slice(), w5LIdx=0;
const bigLetterW5  = qs('#bigLetterW5');
const letterAreaW5 = qs('#letterAreaW5');
function renderW5Letter(){ bigLetterW5.textContent = displayKey(w5Letters[w5LIdx]); }
function nextW5Letter(){ w5LIdx=(w5LIdx+1)%w5Letters.length; renderW5Letter(); playSoundFor(w5Letters[w5LIdx]); }
function prevW5Letter(){ w5LIdx=(w5LIdx-1+w5Letters.length)%w5Letters.length; renderW5Letter(); playSoundFor(w5Letters[w5LIdx]); }

qs('#prevBtnW5').addEventListener('click', prevW5Letter);
qs('#nextBtnW5').addEventListener('click', nextW5Letter);
letterAreaW5.addEventListener('click', ()=>{ playSoundFor(w5Letters[w5LIdx]); nextW5Letter(); });

let w5TouchStart=0;
letterAreaW5.addEventListener('touchstart',e=>{w5TouchStart=e.changedTouches[0].clientX;},{passive:true});
letterAreaW5.addEventListener('touchend',e=>{
  const dx=e.changedTouches[0].clientX-w5TouchStart;
  if(Math.abs(dx)>40){ dx<0?nextW5Letter():prevW5Letter(); } else { playSoundFor(w5Letters[w5LIdx]); nextW5Letter(); }
},{passive:true});

let w5Words = WEEK5_WORDS.slice(), w5WIdx=0;
const bigWordW5   = qs('#bigWordW5');
const blendAreaW5 = qs('#blendSeqAreaW5');
function renderW5Word(){ bigWordW5.textContent = w5Words[w5WIdx]; }
function playCurrentW5(){ playBlend(w5Words[w5WIdx]); }
function nextW5Word(){ w5WIdx=(w5WIdx+1)%w5Words.length; renderW5Word(); playCurrentW5(); }
function prevW5Word(){ w5WIdx=(w5WIdx-1+w5Words.length)%w5Words.length; renderW5Word(); playCurrentW5(); }

qs('#prevWordBtnW5').addEventListener('click', prevW5Word);
qs('#nextWordBtnW5').addEventListener('click', nextW5Word);

// Tap = replay word
blendAreaW5.addEventListener('click', ()=>{ playCurrentW5(); });

function activateWeek5Tab(which){
  const tabL=qs('#tabLettersW5'), tabB=qs('#tabBlendW5');
  const paneL=qs('#paneLettersW5'), paneB=qs('#paneBlendW5');
  if(which==='letters'){
    tabL.classList.add('active'); tabB.classList.remove('active');
    paneL.classList.add('active'); paneB.classList.remove('active');
    renderW5Letter(); setTimeout(()=>letterAreaW5.focus(),50);
  }else{
    tabB.classList.add('active'); tabL.classList.remove('active');
    paneB.classList.add('active'); paneL.classList.remove('active');
    renderW5Word(); setTimeout(()=>blendAreaW5.focus(),50);
  }
}
qs('#tabLettersW5').addEventListener('click', ()=>activateWeek5Tab('letters'));
qs('#tabBlendW5').addEventListener('click',   ()=>activateWeek5Tab('blend'));


/* ===== Autumn 2 – Week 1: letters + single-word blending ===== */
// Letters pane
let a2Letters = A2W1_LETTERS.slice(), a2LIdx = 0;
const bigLetterA2  = qs('#bigLetterA2');
const letterAreaA2 = qs('#letterAreaA2');

function renderA2Letter(){ bigLetterA2.textContent = displayKey(a2Letters[a2LIdx]); }
function nextA2Letter(){ a2LIdx=(a2LIdx+1)%a2Letters.length; renderA2Letter(); playSoundFor(a2Letters[a2LIdx]); }
function prevA2Letter(){ a2LIdx=(a2LIdx-1+a2Letters.length)%a2Letters.length; renderA2Letter(); playSoundFor(a2Letters[a2LIdx]); }

qs('#prevBtnA2').addEventListener('click', prevA2Letter);
qs('#nextBtnA2').addEventListener('click', nextA2Letter);
letterAreaA2.addEventListener('click', ()=>{ playSoundFor(a2Letters[a2LIdx]); nextA2Letter(); });

let a2TouchStart = 0;
letterAreaA2.addEventListener('touchstart', e => { a2TouchStart = e.changedTouches[0].clientX; }, {passive:true});
letterAreaA2.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - a2TouchStart;
  if (Math.abs(dx) > 40) { dx < 0 ? nextA2Letter() : prevA2Letter(); }
  else { playSoundFor(a2Letters[a2LIdx]); nextA2Letter(); }
}, {passive:true});

// Blending words (single-word view)
let a2Words = A2W1_WORDS.slice(), a2WIdx = 0;
const bigWordA2   = qs('#bigWordA2');
const blendAreaA2 = qs('#blendSeqAreaA2');

function renderA2Word(){ bigWordA2.textContent = a2Words[a2WIdx]; }
function playCurrentA2(){ playBlend(a2Words[a2WIdx]); }
function nextA2Word(){ a2WIdx=(a2WIdx+1)%a2Words.length; renderA2Word(); playCurrentA2(); }
function prevA2Word(){ a2WIdx=(a2WIdx-1+a2Words.length)%a2Words.length; renderA2Word(); playCurrentA2(); }

qs('#prevWordBtnA2').addEventListener('click', prevA2Word);
qs('#nextWordBtnA2').addEventListener('click', nextA2Word);

// Tap = replay word
blendAreaA2.addEventListener('click', ()=>{ playCurrentA2(); });

// Tabs for A2W1
function activateA2Tab(which){
  const tabL = qs('#tabLettersA2'), tabB = qs('#tabBlendA2');
  const paneL= qs('#paneLettersA2'), paneB= qs('#paneBlendA2');
  if (which === 'letters'){
    tabL.classList.add('active'); tabB.classList.remove('active');
    paneL.classList.add('active'); paneB.classList.remove('active');
    renderA2Letter(); setTimeout(()=>letterAreaA2.focus(),50);
  } else {
    tabB.classList.add('active'); tabL.classList.remove('active');
    paneB.classList.add('active'); paneL.classList.remove('active');
    renderA2Word(); setTimeout(()=>blendAreaA2.focus(),50);
  }
}
qs('#tabLettersA2').addEventListener('click', ()=>activateA2Tab('letters'));
qs('#tabBlendA2').addEventListener('click',   ()=>activateA2Tab('blend'));


/* ===== Autumn 2 – Week 2 ===== */
let a2w2Letters = A2W2_LETTERS.slice(), a2w2LIdx=0;
const bigLetterA2W2  = qs('#bigLetterA2W2');
const letterAreaA2W2 = qs('#letterAreaA2W2');
function renderA2W2Letter(){ bigLetterA2W2.textContent = displayKey(a2w2Letters[a2w2LIdx]); }
function nextA2W2Letter(){ a2w2LIdx=(a2w2LIdx+1)%a2w2Letters.length; renderA2W2Letter(); playSoundFor(a2w2Letters[a2w2LIdx]); }
function prevA2W2Letter(){ a2w2LIdx=(a2w2LIdx-1+a2w2Letters.length)%a2w2Letters.length; renderA2W2Letter(); playSoundFor(a2w2Letters[a2w2LIdx]); }

qs('#prevBtnA2W2').addEventListener('click', prevA2W2Letter);
qs('#nextBtnA2W2').addEventListener('click', nextA2W2Letter);
letterAreaA2W2.addEventListener('click', ()=>{ playSoundFor(a2w2Letters[a2w2LIdx]); nextA2W2Letter(); });

let a2w2Touch=0;
letterAreaA2W2.addEventListener('touchstart', e => { a2w2Touch = e.changedTouches[0].clientX; }, {passive:true});
letterAreaA2W2.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - a2w2Touch;
  if (Math.abs(dx) > 40) { dx < 0 ? nextA2W2Letter() : prevA2W2Letter(); }
  else { playSoundFor(a2w2Letters[a2w2LIdx]); nextA2W2Letter(); }
}, {passive:true});

let a2w2Words = A2W2_WORDS.slice(), a2w2WIdx=0;
const bigWordA2W2   = qs('#bigWordA2W2');
const blendAreaA2W2 = qs('#blendSeqAreaA2W2');
function renderA2W2Word(){ bigWordA2W2.textContent = a2w2Words[a2w2WIdx]; }
function playCurrentA2W2(){ playBlend(a2w2Words[a2w2WIdx]); }
function nextA2W2Word(){ a2w2WIdx=(a2w2WIdx+1)%a2w2Words.length; renderA2W2Word(); playCurrentA2W2(); }
function prevA2W2Word(){ a2w2WIdx=(a2w2WIdx-1+a2w2Words.length)%a2w2Words.length; renderA2W2Word(); playCurrentA2W2(); }

qs('#prevWordBtnA2W2').addEventListener('click', prevA2W2Word);
qs('#nextWordBtnA2W2').addEventListener('click', nextA2W2Word);

// Tap = replay
blendAreaA2W2.addEventListener('click', ()=>{ playCurrentA2W2(); });

function activateWeekA2W2Tab(which){
  const tabL=qs('#tabLettersA2W2'), tabB=qs('#tabBlendA2W2');
  const paneL=qs('#paneLettersA2W2'), paneB=qs('#paneBlendA2W2');
  if (which==='letters'){
    tabL.classList.add('active'); tabB.classList.remove('active');
    paneL.classList.add('active'); paneB.classList.remove('active');
    renderA2W2Letter(); setTimeout(()=>letterAreaA2W2.focus(),50);
  } else {
    tabB.classList.add('active'); tabL.classList.remove('active');
    paneB.classList.add('active'); paneL.classList.remove('active');
    renderA2W2Word(); setTimeout(()=>blendAreaA2W2.focus(),50);
  }
}
qs('#tabLettersA2W2').addEventListener('click', ()=>activateWeekA2W2Tab('letters'));
qs('#tabBlendA2W2').addEventListener('click',   ()=>activateWeekA2W2Tab('blend'));


/* ===== Autumn 2 – Week 3 ===== */
let a2w3Letters = A2W3_LETTERS.slice(), a2w3LIdx=0;
const bigLetterA2W3  = qs('#bigLetterA2W3');
const letterAreaA2W3 = qs('#letterAreaA2W3');
function renderA2W3Letter(){ bigLetterA2W3.textContent = displayKey(a2w3Letters[a2w3LIdx]); }
function nextA2W3Letter(){ a2w3LIdx=(a2w3LIdx+1)%a2w3Letters.length; renderA2W3Letter(); playSoundFor(a2w3Letters[a2w3LIdx]); }
function prevA2W3Letter(){ a2w3LIdx=(a2w3LIdx-1+a2w3Letters.length)%a2w3Letters.length; renderA2W3Letter(); playSoundFor(a2w3Letters[a2w3LIdx]); }

qs('#prevBtnA2W3').addEventListener('click', prevA2W3Letter);
qs('#nextBtnA2W3').addEventListener('click', nextA2W3Letter);
letterAreaA2W3.addEventListener('click', ()=>{ playSoundFor(a2w3Letters[a2w3LIdx]); nextA2W3Letter(); });

let a2w3Touch=0;
letterAreaA2W3.addEventListener('touchstart', e => { a2w3Touch = e.changedTouches[0].clientX; }, {passive:true});
letterAreaA2W3.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - a2w3Touch;
  if (Math.abs(dx) > 40) { dx < 0 ? nextA2W3Letter() : prevA2W3Letter(); }
  else { playSoundFor(a2w3Letters[a2w3LIdx]); nextA2W3Letter(); }
}, {passive:true});

let a2w3Words = A2W3_WORDS.slice(), a2w3WIdx=0;
const bigWordA2W3   = qs('#bigWordA2W3');
const blendAreaA2W3 = qs('#blendSeqAreaA2W3');
function renderA2W3Word(){ bigWordA2W3.textContent = a2w3Words[a2w3WIdx]; }
function playCurrentA2W3(){ playBlend(a2w3Words[a2w3WIdx]); }
function nextA2W3Word(){ a2w3WIdx=(a2w3WIdx+1)%a2w3Words.length; renderA2W3Word(); playCurrentA2W3(); }
function prevA2W3Word(){ a2w3WIdx=(a2w3WIdx-1+a2w3Words.length)%a2w3Words.length; renderA2W3Word(); playCurrentA2W3(); }

qs('#prevWordBtnA2W3').addEventListener('click', prevA2W3Word);
qs('#nextWordBtnA2W3').addEventListener('click', nextA2W3Word);

// Tap = replay
blendAreaA2W3.addEventListener('click', ()=>{ playCurrentA2W3(); });

function activateWeekA2W3Tab(which){
  const tabL=qs('#tabLettersA2W3'), tabB=qs('#tabBlendA2W3');
  const paneL=qs('#paneLettersA2W3'), paneB=qs('#paneBlendA2W3');
  if (which==='letters'){
    tabL.classList.add('active'); tabB.classList.remove('active');
    paneL.classList.add('active'); paneB.classList.remove('active');
    renderA2W3Letter(); setTimeout(()=>letterAreaA2W3.focus(),50);
  } else {
    tabB.classList.add('active'); tabL.classList.remove('active');
    paneB.classList.add('active'); paneL.classList.remove('active');
    renderA2W3Word(); setTimeout(()=>blendAreaA2W3.focus(),50);
  }
}
qs('#tabLettersA2W3').addEventListener('click', ()=>activateWeekA2W3Tab('letters'));
qs('#tabBlendA2W3').addEventListener('click',   ()=>activateWeekA2W3Tab('blend'));


/* ===== Autumn 2 – Week 4 ===== */
let a2w4Letters = A2W4_LETTERS.slice(), a2w4LIdx=0;
const bigLetterA2W4  = qs('#bigLetterA2W4');
const letterAreaA2W4 = qs('#letterAreaA2W4');
function renderA2W4Letter(){ bigLetterA2W4.textContent = displayKey(a2w4Letters[a2w4LIdx]); }
function nextA2W4Letter(){ a2w4LIdx=(a2w4LIdx+1)%a2w4Letters.length; renderA2W4Letter(); playSoundFor(a2w4Letters[a2w4LIdx]); }
function prevA2W4Letter(){ a2w4LIdx=(a2w4LIdx-1+a2w4Letters.length)%a2w4Letters.length; renderA2W4Letter(); playSoundFor(a2w4Letters[a2w4LIdx]); }

qs('#prevBtnA2W4').addEventListener('click', prevA2W4Letter);
qs('#nextBtnA2W4').addEventListener('click', nextA2W4Letter);
letterAreaA2W4.addEventListener('click', ()=>{ playSoundFor(a2w4Letters[a2w4LIdx]); nextA2W4Letter(); });

let a2w4Touch=0;
letterAreaA2W4.addEventListener('touchstart', e => { a2w4Touch = e.changedTouches[0].clientX; }, {passive:true});
letterAreaA2W4.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - a2w4Touch;
  if (Math.abs(dx) > 40) { dx < 0 ? nextA2W4Letter() : prevA2W4Letter(); }
  else { playSoundFor(a2w4Letters[a2w4LIdx]); nextA2W4Letter(); }
}, {passive:true});

let a2w4Words = A2W4_WORDS.slice(), a2w4WIdx=0;
const bigWordA2W4   = qs('#bigWordA2W4');
const blendAreaA2W4 = qs('#blendSeqAreaA2W4');
function renderA2W4Word(){ bigWordA2W4.textContent = a2w4Words[a2w4WIdx]; }
function playCurrentA2W4(){ playBlend(a2w4Words[a2w4WIdx]); }
function nextA2W4Word(){ a2w4WIdx=(a2w4WIdx+1)%a2w4Words.length; renderA2W4Word(); playCurrentA2W4(); }
function prevA2W4Word(){ a2w4WIdx=(a2w4WIdx-1+a2w4Words.length)%a2w4Words.length; renderA2W4Word(); playCurrentA2W4(); }

qs('#prevWordBtnA2W4').addEventListener('click', prevA2W4Word);
qs('#nextWordBtnA2W4').addEventListener('click', nextA2W4Word);

// Tap = replay
blendAreaA2W4.addEventListener('click', ()=>{ playCurrentA2W4(); });

function activateWeekA2W4Tab(which){
  const tabL=qs('#tabLettersA2W4'), tabB=qs('#tabBlendA2W4');
  const paneL=qs('#paneLettersA2W4'), paneB=qs('#paneBlendA2W4');
  if (which==='letters'){
    tabL.classList.add('active'); tabB.classList.remove('active');
    paneL.classList.add('active'); paneB.classList.remove('active');
    renderA2W4Letter(); setTimeout(()=>letterAreaA2W4.focus(),50);
  } else {
    tabB.classList.add('active'); tabL.classList.remove('active');
    paneB.classList.add('active'); paneL.classList.remove('active');
    renderA2W4Word(); setTimeout(()=>blendAreaA2W4.focus(),50);
  }
}
qs('#tabLettersA2W4').addEventListener('click', ()=>activateWeekA2W4Tab('letters'));
qs('#tabBlendA2W4').addEventListener('click',   ()=>activateWeekA2W4Tab('blend'));


/* ===== Autumn 2 – Week 5 ===== */
// Letters pane
let a2w5Letters = A2W5_LETTERS.slice(), a2w5LIdx = 0;
const bigLetterA2W5  = qs('#bigLetterA2W5');
const letterAreaA2W5 = qs('#letterAreaA2W5');

function renderA2W5Letter(){ bigLetterA2W5.textContent = displayKey(a2w5Letters[a2w5LIdx]); }
function nextA2W5Letter(){ a2w5LIdx = (a2w5LIdx+1) % a2w5Letters.length; renderA2W5Letter(); playSoundFor(a2w5Letters[a2w5LIdx]); }
function prevA2W5Letter(){ a2w5LIdx = (a2w5LIdx-1+a2w5Letters.length) % a2w5Letters.length; renderA2W5Letter(); playSoundFor(a2w5Letters[a2w5LIdx]); }

qs('#prevBtnA2W5').addEventListener('click', prevA2W5Letter);
qs('#nextBtnA2W5').addEventListener('click', nextA2W5Letter);
letterAreaA2W5.addEventListener('click', ()=>{ playSoundFor(a2w5Letters[a2w5LIdx]); nextA2W5Letter(); });

let a2w5Touch=0;
letterAreaA2W5.addEventListener('touchstart', e => { a2w5Touch = e.changedTouches[0].clientX; }, {passive:true});
letterAreaA2W5.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - a2w5Touch;
  if (Math.abs(dx) > 40) { dx < 0 ? nextA2W5Letter() : prevA2W5Letter(); }
  else { playSoundFor(a2w5Letters[a2w5LIdx]); nextA2W5Letter(); }
}, {passive:true});

// Blending words pane (single-word)
let a2w5Words = A2W5_WORDS.slice(), a2w5WIdx = 0;
const bigWordA2W5   = qs('#bigWordA2W5');
const blendAreaA2W5 = qs('#blendSeqAreaA2W5');

function renderA2W5Word(){ bigWordA2W5.textContent = a2w5Words[a2w5WIdx]; }
function playCurrentA2W5(){ playBlend(a2w5Words[a2w5WIdx]); }
function nextA2W5Word(){ a2w5WIdx = (a2w5WIdx+1) % a2w5Words.length; renderA2W5Word(); playCurrentA2W5(); }
function prevA2W5Word(){ a2w5WIdx = (a2w5WIdx-1+a2w5Words.length) % a2w5Words.length; renderA2W5Word(); playCurrentA2W5(); }

qs('#prevWordBtnA2W5').addEventListener('click', prevA2W5Word);
qs('#nextWordBtnA2W5').addEventListener('click', nextA2W5Word);

// Tap = replay
blendAreaA2W5.addEventListener('click', ()=>{ playCurrentA2W5(); });

// Tabs
function activateWeekA2W5Tab(which){
  const tabL = qs('#tabLettersA2W5'), tabB = qs('#tabBlendA2W5');
  const paneL= qs('#paneLettersA2W5'), paneB= qs('#paneBlendA2W5');
  if (which === 'letters'){
    tabL.classList.add('active'); tabB.classList.remove('active');
    paneL.classList.add('active'); paneB.classList.remove('active');
    renderA2W5Letter(); setTimeout(()=>letterAreaA2W5.focus(),50);
  } else {
    tabB.classList.add('active'); tabL.classList.remove('active');
    paneB.classList.add('active'); paneL.classList.remove('active');
    renderA2W5Word(); setTimeout(()=>blendAreaA2W5.focus(),50);
  }
}
qs('#tabLettersA2W5').addEventListener('click', ()=>activateWeekA2W5Tab('letters'));
qs('#tabBlendA2W5').addEventListener('click',   ()=>activateWeekA2W5Tab('blend'));

/* ===== Spring 1 – Week 1 ===== */
let s1w1Letters = S1W1_LETTERS.slice(), s1w1LIdx = 0;
const bigLetterS1W1  = qs('#bigLetterS1W1');
const letterAreaS1W1 = qs('#letterAreaS1W1');

function renderS1W1Letter(){ bigLetterS1W1.textContent = displayKey(s1w1Letters[s1w1LIdx]); }
function nextS1W1Letter(){ s1w1LIdx=(s1w1LIdx+1)%s1w1Letters.length; renderS1W1Letter(); playSoundFor(s1w1Letters[s1w1LIdx]); }
function prevS1W1Letter(){ s1w1LIdx=(s1w1LIdx-1+s1w1Letters.length)%s1w1Letters.length; renderS1W1Letter(); playSoundFor(s1w1Letters[s1w1LIdx]); }

qs('#prevBtnS1W1').addEventListener('click', prevS1W1Letter);
qs('#nextBtnS1W1').addEventListener('click', nextS1W1Letter);
letterAreaS1W1.addEventListener('click', ()=>{ playSoundFor(s1w1Letters[s1w1LIdx]); nextS1W1Letter(); });

let s1w1Touch=0;
letterAreaS1W1.addEventListener('touchstart', e=>{ s1w1Touch=e.changedTouches[0].clientX; }, {passive:true});
letterAreaS1W1.addEventListener('touchend', e=>{
  const dx=e.changedTouches[0].clientX - s1w1Touch;
  if(Math.abs(dx)>40){ dx<0 ? nextS1W1Letter() : prevS1W1Letter(); }
  else { playSoundFor(s1w1Letters[s1w1LIdx]); nextS1W1Letter(); }
},{passive:true});

// Words
let s1w1Words = S1W1_WORDS.slice(), s1w1WIdx = 0;
const bigWordS1W1   = qs('#bigWordS1W1');
const blendAreaS1W1 = qs('#blendSeqAreaS1W1');

function renderS1W1Word(){ bigWordS1W1.textContent = s1w1Words[s1w1WIdx]; }
function playCurrentS1W1(){ playBlend(s1w1Words[s1w1WIdx]); }
function nextS1W1Word(){ s1w1WIdx=(s1w1WIdx+1)%s1w1Words.length; renderS1W1Word(); playCurrentS1W1(); }
function prevS1W1Word(){ s1w1WIdx=(s1w1WIdx-1+s1w1Words.length)%s1w1Words.length; renderS1W1Word(); playCurrentS1W1(); }

qs('#prevWordBtnS1W1').addEventListener('click', prevS1W1Word);
qs('#nextWordBtnS1W1').addEventListener('click', nextS1W1Word);
blendAreaS1W1.addEventListener('click', ()=>{ playCurrentS1W1(); nextS1W1Word(); });

let s1w1WordTouch=0;
blendAreaS1W1.addEventListener('touchstart', e=>{ s1w1WordTouch=e.changedTouches[0].clientX; }, {passive:true});
blendAreaS1W1.addEventListener('touchend', e=>{
  const dx=e.changedTouches[0].clientX - s1w1WordTouch;
  if(Math.abs(dx)>40){ dx<0 ? nextS1W1Word() : prevS1W1Word(); }
  else { playCurrentS1W1(); nextS1W1Word(); }
},{passive:true});

// Tabs
function activateS1W1Tab(which){
  const tabL=qs('#tabLettersS1W1'), tabB=qs('#tabBlendS1W1');
  const paneL=qs('#paneLettersS1W1'), paneB=qs('#paneBlendS1W1');
  if(which==='letters'){
    tabL.classList.add('active'); tabB.classList.remove('active');
    paneL.classList.add('active'); paneB.classList.remove('active');
    renderS1W1Letter(); setTimeout(()=>letterAreaS1W1.focus(),50);
  }else{
    tabB.classList.add('active'); tabL.classList.remove('active');
    paneB.classList.add('active'); paneL.classList.remove('active');
    renderS1W1Word(); setTimeout(()=>blendAreaS1W1.focus(),50);
  }
}
qs('#tabLettersS1W1').addEventListener('click', ()=>activateS1W1Tab('letters'));
qs('#tabBlendS1W1').addEventListener('click',   ()=>activateS1W1Tab('blend'));


/* ===== Spring 1 – Week 2 ===== */
let s1w2Letters = S1W2_LETTERS.slice(), s1w2LIdx = 0;
const bigLetterS1W2  = qs('#bigLetterS1W2');
const letterAreaS1W2 = qs('#letterAreaS1W2');
function renderS1W2Letter(){ bigLetterS1W2.textContent = displayKey(s1w2Letters[s1w2LIdx]); }
function nextS1W2Letter(){ s1w2LIdx=(s1w2LIdx+1)%s1w2Letters.length; renderS1W2Letter(); playSoundFor(s1w2Letters[s1w2LIdx]); }
function prevS1W2Letter(){ s1w2LIdx=(s1w2LIdx-1+s1w2Letters.length)%s1w2Letters.length; renderS1W2Letter(); playSoundFor(s1w2Letters[s1w2LIdx]); }
qs('#prevBtnS1W2').addEventListener('click', prevS1W2Letter);
qs('#nextBtnS1W2').addEventListener('click', nextS1W2Letter);
letterAreaS1W2.addEventListener('click', ()=>{ playSoundFor(s1w2Letters[s1w2LIdx]); nextS1W2Letter(); });
let s1w2Touch=0;
letterAreaS1W2.addEventListener('touchstart', e=>{ s1w2Touch=e.changedTouches[0].clientX; }, {passive:true});
letterAreaS1W2.addEventListener('touchend', e=>{
  const dx=e.changedTouches[0].clientX - s1w2Touch;
  if(Math.abs(dx)>40){ dx<0 ? nextS1W2Letter() : prevS1W2Letter(); }
  else { playSoundFor(s1w2Letters[s1w2LIdx]); nextS1W2Letter(); }
},{passive:true});

let s1w2Words = S1W2_WORDS.slice(), s1w2WIdx = 0;
const bigWordS1W2   = qs('#bigWordS1W2');
const blendAreaS1W2 = qs('#blendSeqAreaS1W2');
function renderS1W2Word(){ bigWordS1W2.textContent = s1w2Words[s1w2WIdx]; }
function playCurrentS1W2(){ playBlend(s1w2Words[s1w2WIdx]); }
function nextS1W2Word(){ s1w2WIdx=(s1w2WIdx+1)%s1w2Words.length; renderS1W2Word(); playCurrentS1W2(); }
function prevS1W2Word(){ s1w2WIdx=(s1w2WIdx-1+s1w2Words.length)%s1w2Words.length; renderS1W2Word(); playCurrentS1W2(); }
qs('#prevWordBtnS1W2').addEventListener('click', prevS1W2Word);
qs('#nextWordBtnS1W2').addEventListener('click', nextS1W2Word);
blendAreaS1W2.addEventListener('click', ()=>{ playCurrentS1W2(); });
let s1w2WordTouch=0;
blendAreaS1W2.addEventListener('touchstart', e=>{ s1w2WordTouch=e.changedTouches[0].clientX; }, {passive:true});
blendAreaS1W2.addEventListener('touchend', e=>{
  const dx=e.changedTouches[0].clientX - s1w2WordTouch;
  if(Math.abs(dx)>40){ dx<0 ? nextS1W2Word() : prevS1W2Word(); }
  else { playCurrentS1W2(); }
},{passive:true});

function activateS1W2Tab(which){
  const tabL=qs('#tabLettersS1W2'), tabB=qs('#tabBlendS1W2');
  const paneL=qs('#paneLettersS1W2'), paneB=qs('#paneBlendS1W2');
  if(which==='letters'){
    tabL.classList.add('active'); tabB.classList.remove('active');
    paneL.classList.add('active'); paneB.classList.remove('active');
    renderS1W2Letter(); setTimeout(()=>letterAreaS1W2.focus(),50);
  } else {
    tabB.classList.add('active'); tabL.classList.remove('active');
    paneB.classList.add('active'); paneL.classList.remove('active');
    renderS1W2Word(); setTimeout(()=>blendAreaS1W2.focus(),50);
  }
}
qs('#tabLettersS1W2').addEventListener('click', ()=>activateS1W2Tab('letters'));
qs('#tabBlendS1W2').addEventListener('click',   ()=>activateS1W2Tab('blend'));


/* ===== Spring 1 – Week 3 ===== */
let s1w3Letters = S1W3_LETTERS.slice(), s1w3LIdx = 0;
const bigLetterS1W3  = qs('#bigLetterS1W3');
const letterAreaS1W3 = qs('#letterAreaS1W3');
function renderS1W3Letter(){ bigLetterS1W3.textContent = displayKey(s1w3Letters[s1w3LIdx]); }
function nextS1W3Letter(){ s1w3LIdx=(s1w3LIdx+1)%s1w3Letters.length; renderS1W3Letter(); playSoundFor(s1w3Letters[s1w3LIdx]); }
function prevS1W3Letter(){ s1w3LIdx=(s1w3LIdx-1+s1w3Letters.length)%s1w3Letters.length; renderS1W3Letter(); playSoundFor(s1w3Letters[s1w3LIdx]); }
qs('#prevBtnS1W3').addEventListener('click', prevS1W3Letter);
qs('#nextBtnS1W3').addEventListener('click', nextS1W3Letter);
letterAreaS1W3.addEventListener('click', ()=>{ playSoundFor(s1w3Letters[s1w3LIdx]); nextS1W3Letter(); });
let s1w3Touch=0;
letterAreaS1W3.addEventListener('touchstart', e=>{ s1w3Touch=e.changedTouches[0].clientX; }, {passive:true});
letterAreaS1W3.addEventListener('touchend', e=>{
  const dx=e.changedTouches[0].clientX - s1w3Touch;
  if(Math.abs(dx)>40){ dx<0 ? nextS1W3Letter() : prevS1W3Letter(); }
  else { playSoundFor(s1w3Letters[s1w3LIdx]); nextS1W3Letter(); }
},{passive:true});

let s1w3Words = S1W3_WORDS.slice(), s1w3WIdx = 0;
const bigWordS1W3   = qs('#bigWordS1W3');
const blendAreaS1W3 = qs('#blendSeqAreaS1W3');
function renderS1W3Word(){ bigWordS1W3.textContent = s1w3Words[s1w3WIdx]; }
function playCurrentS1W3(){ playBlend(s1w3Words[s1w3WIdx]); }
function nextS1W3Word(){ s1w3WIdx=(s1w3WIdx+1)%s1w3Words.length; renderS1W3Word(); playCurrentS1W3(); }
function prevS1W3Word(){ s1w3WIdx=(s1w3WIdx-1+s1w3Words.length)%s1w3Words.length; renderS1W3Word(); playCurrentS1W3(); }
qs('#prevWordBtnS1W3').addEventListener('click', prevS1W3Word);
qs('#nextWordBtnS1W3').addEventListener('click', nextS1W3Word);
blendAreaS1W3.addEventListener('click', ()=>{ playCurrentS1W3(); });
let s1w3WordTouch=0;
blendAreaS1W3.addEventListener('touchstart', e=>{ s1w3WordTouch=e.changedTouches[0].clientX; }, {passive:true});
blendAreaS1W3.addEventListener('touchend', e=>{
  const dx=e.changedTouches[0].clientX - s1w3WordTouch;
  if(Math.abs(dx)>40){ dx<0 ? nextS1W3Word() : prevS1W3Word(); }
  else { playCurrentS1W3(); }
},{passive:true});

function activateS1W3Tab(which){
  const tabL=qs('#tabLettersS1W3'), tabB=qs('#tabBlendS1W3');
  const paneL=qs('#paneLettersS1W3'), paneB=qs('#paneBlendS1W3');
  if(which==='letters'){
    tabL.classList.add('active'); tabB.classList.remove('active');
    paneL.classList.add('active'); paneB.classList.remove('active');
    renderS1W3Letter(); setTimeout(()=>letterAreaS1W3.focus(),50);
  } else {
    tabB.classList.add('active'); tabL.classList.remove('active');
    paneB.classList.add('active'); paneL.classList.remove('active');
    renderS1W3Word(); setTimeout(()=>blendAreaS1W3.focus(),50);
  }
}
qs('#tabLettersS1W3').addEventListener('click', ()=>activateS1W3Tab('letters'));
qs('#tabBlendS1W3').addEventListener('click',   ()=>activateS1W3Tab('blend'));


/* ===== Spring 1 – Week 4 ===== */
let s1w4Letters = S1W4_LETTERS.slice(), s1w4LIdx = 0;
const bigLetterS1W4  = qs('#bigLetterS1W4');
const letterAreaS1W4 = qs('#letterAreaS1W4');
function renderS1W4Letter(){ bigLetterS1W4.textContent = displayKey(s1w4Letters[s1w4LIdx]); }
function nextS1W4Letter(){ s1w4LIdx=(s1w4LIdx+1)%s1w4Letters.length; renderS1W4Letter(); playSoundFor(s1w4Letters[s1w4LIdx]); }
function prevS1W4Letter(){ s1w4LIdx=(s1w4LIdx-1+s1w4Letters.length)%s1w4Letters.length; renderS1W4Letter(); playSoundFor(s1w4Letters[s1w4LIdx]); }
qs('#prevBtnS1W4').addEventListener('click', prevS1W4Letter);
qs('#nextBtnS1W4').addEventListener('click', nextS1W4Letter);
letterAreaS1W4.addEventListener('click', ()=>{ playSoundFor(s1w4Letters[s1w4LIdx]); nextS1W4Letter(); });
let s1w4Touch=0;
letterAreaS1W4.addEventListener('touchstart', e=>{ s1w4Touch=e.changedTouches[0].clientX; }, {passive:true});
letterAreaS1W4.addEventListener('touchend', e=>{
  const dx=e.changedTouches[0].clientX - s1w4Touch;
  if(Math.abs(dx)>40){ dx<0 ? nextS1W4Letter() : prevS1W4Letter(); }
  else { playSoundFor(s1w4Letters[s1w4LIdx]); nextS1W4Letter(); }
},{passive:true});

let s1w4Words = S1W4_WORDS.slice(), s1w4WIdx = 0;
const bigWordS1W4   = qs('#bigWordS1W4');
const blendAreaS1W4 = qs('#blendSeqAreaS1W4');
function renderS1W4Word(){ bigWordS1W4.textContent = s1w4Words[s1w4WIdx]; }
function playCurrentS1W4(){ playBlend(s1w4Words[s1w4WIdx]); }
function nextS1W4Word(){ s1w4WIdx=(s1w4WIdx+1)%s1w4Words.length; renderS1W4Word(); playCurrentS1W4(); }
function prevS1W4Word(){ s1w4WIdx=(s1w4WIdx-1+s1w4Words.length)%s1w4Words.length; renderS1W4Word(); playCurrentS1W4(); }
qs('#prevWordBtnS1W4').addEventListener('click', prevS1W4Word);
qs('#nextWordBtnS1W4').addEventListener('click', nextS1W4Word);
blendAreaS1W4.addEventListener('click', ()=>{ playCurrentS1W4(); });
let s1w4WordTouch=0;
blendAreaS1W4.addEventListener('touchstart', e=>{ s1w4WordTouch=e.changedTouches[0].clientX; }, {passive:true});
blendAreaS1W4.addEventListener('touchend', e=>{
  const dx=e.changedTouches[0].clientX - s1w4WordTouch;
  if(Math.abs(dx)>40){ dx<0 ? nextS1W4Word() : prevS1W4Word(); }
  else { playCurrentS1W4(); }
},{passive:true});

function activateS1W4Tab(which){
  const tabL=qs('#tabLettersS1W4'), tabB=qs('#tabBlendS1W4');
  const paneL=qs('#paneLettersS1W4'), paneB=qs('#paneBlendS1W4');
  if(which==='letters'){
    tabL.classList.add('active'); tabB.classList.remove('active');
    paneL.classList.add('active'); paneB.classList.remove('active');
    renderS1W4Letter(); setTimeout(()=>letterAreaS1W4.focus(),50);
  } else {
    tabB.classList.add('active'); tabL.classList.remove('active');
    paneB.classList.add('active'); paneL.classList.remove('active');
    renderS1W4Word(); setTimeout(()=>blendAreaS1W4.focus(),50);
  }
}
qs('#tabLettersS1W4').addEventListener('click', ()=>activateS1W4Tab('letters'));
qs('#tabBlendS1W4').addEventListener('click',   ()=>activateS1W4Tab('blend'));


/* ===== Spring 1 – Week 5 ===== */
let s1w5Letters = S1W5_LETTERS.slice(), s1w5LIdx = 0;
const bigLetterS1W5  = qs('#bigLetterS1W5');
const letterAreaS1W5 = qs('#letterAreaS1W5');
function renderS1W5Letter(){ bigLetterS1W5.textContent = displayKey(s1w5Letters[s1w5LIdx]); }
function nextS1W5Letter(){ s1w5LIdx=(s1w5LIdx+1)%s1w5Letters.length; renderS1W5Letter(); playSoundFor(s1w5Letters[s1w5LIdx]); }
function prevS1W5Letter(){ s1w5LIdx=(s1w5LIdx-1+s1w5Letters.length)%s1w5Letters.length; renderS1W5Letter(); playSoundFor(s1w5Letters[s1w5LIdx]); }
qs('#prevBtnS1W5').addEventListener('click', prevS1W5Letter);
qs('#nextBtnS1W5').addEventListener('click', nextS1W5Letter);
letterAreaS1W5.addEventListener('click', ()=>{ playSoundFor(s1w5Letters[s1w5LIdx]); nextS1W5Letter(); });
let s1w5Touch=0;
letterAreaS1W5.addEventListener('touchstart', e=>{ s1w5Touch=e.changedTouches[0].clientX; }, {passive:true});
letterAreaS1W5.addEventListener('touchend', e=>{
  const dx=e.changedTouches[0].clientX - s1w5Touch;
  if(Math.abs(dx)>40){ dx<0 ? nextS1W5Letter() : prevS1W5Letter(); }
  else { playSoundFor(s1w5Letters[s1w5LIdx]); nextS1W5Letter(); }
},{passive:true});

let s1w5Words = S1W5_WORDS.slice(), s1w5WIdx = 0;
const bigWordS1W5   = qs('#bigWordS1W5');
const blendAreaS1W5 = qs('#blendSeqAreaS1W5');
function renderS1W5Word(){ bigWordS1W5.textContent = s1w5Words[s1w5WIdx]; }
function playCurrentS1W5(){ playBlend(s1w5Words[s1w5WIdx]); }
function nextS1W5Word(){ s1w5WIdx=(s1w5WIdx+1)%s1w5Words.length; renderS1W5Word(); playCurrentS1W5(); }
function prevS1W5Word(){ s1w5WIdx=(s1w5WIdx-1+s1w5Words.length)%s1w5Words.length; renderS1W5Word(); playCurrentS1W5(); }
qs('#prevWordBtnS1W5').addEventListener('click', prevS1W5Word);
qs('#nextWordBtnS1W5').addEventListener('click', nextS1W5Word);
blendAreaS1W5.addEventListener('click', ()=>{ playCurrentS1W5(); });
let s1w5WordTouch=0;
blendAreaS1W5.addEventListener('touchstart', e=>{ s1w5WordTouch=e.changedTouches[0].clientX; }, {passive:true});
blendAreaS1W5.addEventListener('touchend', e=>{
  const dx=e.changedTouches[0].clientX - s1w5WordTouch;
  if(Math.abs(dx)>40){ dx<0 ? nextS1W5Word() : prevS1W5Word(); }
  else { playCurrentS1W5(); }
},{passive:true});

function activateS1W5Tab(which){
  const tabL=qs('#tabLettersS1W5'), tabB=qs('#tabBlendS1W5');
  const paneL=qs('#paneLettersS1W5'), paneB=qs('#paneBlendS1W5');
  if(which==='letters'){
    tabL.classList.add('active'); tabB.classList.remove('active');
    paneL.classList.add('active'); paneB.classList.remove('active');
    renderS1W5Letter(); setTimeout(()=>letterAreaS1W5.focus(),50);
  } else {
    tabB.classList.add('active'); tabL.classList.remove('active');
    paneB.classList.add('active'); paneL.classList.remove('active');
    renderS1W5Word(); setTimeout(()=>blendAreaS1W5.focus(),50);
  }
}
qs('#tabLettersS1W5').addEventListener('click', ()=>activateS1W5Tab('letters'));
qs('#tabBlendS1W5').addEventListener('click',   ()=>activateS1W5Tab('blend'));



/* ===================== Navigation: home buttons & back ===================== */
qs('#btn-practise').addEventListener('click', ()=>startPractice(ALPHABET));
qs('#btn-phase-1').addEventListener('click', ()=>startPractice(PHASE_SETS.phase1));
qs('#btn-phase-2').addEventListener('click', ()=>{ show('week2'); activateWeek2Tab('letters'); });
qs('#btn-phase-3').addEventListener('click', ()=>{ show('week3'); activateWeek3Tab('letters'); });
qs('#btn-phase-4').addEventListener('click', ()=>{ show('week4'); activateWeek4Tab('letters'); });
qs('#btn-phase-5').addEventListener('click', ()=>{ show('week5'); activateWeek5Tab('letters'); });
qs('#btn-phase-6').addEventListener('click', ()=>{ show('a2w1'); activateA2Tab('letters'); });
qs('#btn-phase-7').addEventListener('click', ()=>{ show('weekA2W2'); activateWeekA2W2Tab('letters'); });
qs('#btn-phase-8').addEventListener('click', ()=>{ show('weekA2W3'); activateWeekA2W3Tab('letters'); });
qs('#btn-phase-9').addEventListener('click', ()=>{ show('weekA2W4'); activateWeekA2W4Tab('letters'); });
qs('#btn-phase-10').addEventListener('click', ()=>{ show('weekA2W5'); activateWeekA2W5Tab('letters'); });
qs('#btn-s1w1').addEventListener('click', ()=>{ show('spring1w1'); activateS1W1Tab('letters'); });
qs('#btn-s1w2').addEventListener('click', ()=>{ show('spring1w2'); activateS1W2Tab('letters'); });
qs('#btn-s1w3').addEventListener('click', ()=>{ show('spring1w3'); activateS1W3Tab('letters'); });
qs('#btn-s1w4').addEventListener('click', ()=>{ show('spring1w4'); activateS1W4Tab('letters'); });
qs('#btn-s1w5').addEventListener('click', ()=>{ show('spring1w5'); activateS1W5Tab('letters'); });



qs('#backLetters').addEventListener('click', ()=>show('home'));
qs('#backWeek2').addEventListener('click',   ()=>show('home'));
qs('#backWeek3').addEventListener('click',   ()=>show('home'));
qs('#backWeek4').addEventListener('click',   ()=>show('home'));
qs('#backWeek5').addEventListener('click',   ()=>show('home'));
qs('#backA2').addEventListener('click',      ()=>show('home'));
qs('#backA2W2').addEventListener('click',    ()=>show('home'));
qs('#backA2W3').addEventListener('click',    ()=>show('home'));
qs('#backA2W4').addEventListener('click',    ()=>show('home'));
qs('#backA2W5').addEventListener('click',    ()=>show('home'));
qs('#backS1W1').addEventListener('click', ()=>show('home'));
qs('#backS1W2').addEventListener('click', ()=>show('home'));
qs('#backS1W3').addEventListener('click', ()=>show('home'));
qs('#backS1W4').addEventListener('click', ()=>show('home'));
qs('#backS1W5').addEventListener('click', ()=>show('home'));


/* ===================== Init ===================== */
show('home');








