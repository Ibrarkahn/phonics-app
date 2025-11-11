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

// Autumn 2 Week 1 (data only for now)
const A2W1_LETTERS = ['f','ff','s','ss','l','ll','v','vv'];
const A2W1_WORDS   = ['huff','off','puff','bell','hill','tell','mess','hiss','fuss','jug','jam','jet'];

/* ===================== Utils ===================== */
let audio;
const qs  = (s) => document.querySelector(s);

function show(name){
  qs('#home').style.display      = name==='home'   ? 'flex':'none';
  qs('#letters').style.display   = name==='letters'? 'block':'none';
  qs('#week2').style.display     = name==='week2'  ? 'block':'none';
  qs('#week3').style.display     = name==='week3'  ? 'block':'none';
  qs('#week4').style.display     = name==='week4'  ? 'block':'none';
  qs('#week5').style.display     = name==='week5'  ? 'block':'none';
  qs('#a2w1').style.display      = name==='a2w1'   ? 'block':'none'; 
}
function shuffle(a){
  for (let i=a.length-1;i>0;i--) { const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; }
  return a;
}
function playSoundFor(key){
  if (audio && !audio.paused) audio.pause();
  audio = new Audio(`sounds/${key}.mp3`);
  audio.currentTime = 0;
  audio.play().catch(()=>{});
}

/* ===================== General letter practice ===================== */
let CURRENT_SET=[], idx=0;
const bigLetter  = qs('#bigLetter');
const letterArea = qs('#letterArea');

function startPractice(letters){
  CURRENT_SET = shuffle(letters.slice());
  idx = 0;
  show('letters');
  renderLetter();
  setTimeout(()=>letterArea.focus(),50);
}
function renderLetter(){ bigLetter.textContent = CURRENT_SET[idx]; }
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

/* ===== Week 2: letters + single-word blending (UNCHANGED) ===== */
let w2Letters = shuffle(WEEK2_LETTERS.slice()), w2LIdx=0;
const bigLetterW2  = qs('#bigLetterW2');
const letterAreaW2 = qs('#letterAreaW2');
function renderW2Letter(){ bigLetterW2.textContent = w2Letters[w2LIdx]; }
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

let w2Words = shuffle(WEEK2_WORDS.slice()), w2WIdx=0;
const bigWordW2   = qs('#bigWordW2');
const blendAreaW2 = qs('#blendSeqAreaW2');
function renderW2Word(){ bigWordW2.textContent = w2Words[w2WIdx]; }
function playBlend(word){
  const parts = word.split('');
  let i=0;
  const step=()=>{
    if(i<parts.length){
      const a=new Audio(`sounds/${parts[i]}.mp3`); a.play().catch(()=>{}); a.onended=()=>{i++; step();};
    }else{
      new Audio(`sounds/${word}.mp3`).play().catch(()=>{});
    }
  };
  step();
}
function playCurrentW2(){ playBlend(w2Words[w2WIdx]); }
function nextW2Word(){ w2WIdx=(w2WIdx+1)%w2Words.length; renderW2Word(); playCurrentW2(); }
function prevW2Word(){ w2WIdx=(w2WIdx-1+w2Words.length)%w2Words.length; renderW2Word(); playCurrentW2(); }
qs('#prevWordBtnW2').addEventListener('click', prevW2Word);
qs('#nextWordBtnW2').addEventListener('click', nextW2Word);
blendAreaW2.addEventListener('click', ()=>{ playCurrentW2(); nextW2Word(); });
let w2WordTouch=0;
blendAreaW2.addEventListener('touchstart',e=>{w2WordTouch=e.changedTouches[0].clientX;},{passive:true});
blendAreaW2.addEventListener('touchend',e=>{
  const dx=e.changedTouches[0].clientX-w2WordTouch;
  if(Math.abs(dx)>40){ dx<0?nextW2Word():prevW2Word(); } else { playCurrentW2(); nextW2Word(); }
},{passive:true});

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

/* ===== Week 3: letters + single-word blending (UNCHANGED) ===== */
let w3Letters = shuffle(WEEK3_LETTERS.slice()), w3LIdx=0;
const bigLetterW3  = qs('#bigLetterW3');
const letterAreaW3 = qs('#letterAreaW3');
function renderW3Letter(){ bigLetterW3.textContent = w3Letters[w3LIdx]; }
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

let w3Words = shuffle(WEEK3_WORDS.slice()), w3WIdx=0;
const bigWordW3   = qs('#bigWordW3');
const blendAreaW3 = qs('#blendSeqAreaW3');
function renderW3Word(){ bigWordW3.textContent = w3Words[w3WIdx]; }
function playCurrentW3(){ playBlend(w3Words[w3WIdx]); }
function nextW3Word(){ w3WIdx=(w3WIdx+1)%w3Words.length; renderW3Word(); playCurrentW3(); }
function prevW3Word(){ w3WIdx=(w3WIdx-1+w3Words.length)%w3Words.length; renderW3Word(); playCurrentW3(); }
qs('#prevWordBtnW3').addEventListener('click', prevW3Word);
qs('#nextWordBtnW3').addEventListener('click', nextW3Word);
blendAreaW3.addEventListener('click', ()=>{ playCurrentW3(); nextW3Word(); });
let w3WordTouch=0;
blendAreaW3.addEventListener('touchstart',e=>{w3WordTouch=e.changedTouches[0].clientX;},{passive:true});
blendAreaW3.addEventListener('touchend',e=>{
  const dx=e.changedTouches[0].clientX-w3WordTouch;
  if(Math.abs(dx)>40){ dx<0?nextW3Word():prevW3Word(); } else { playCurrentW3(); nextW3Word(); }
},{passive:true});

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

/* ===== Week 4: letters + single-word blending (FIXED) ===== */
let w4Letters = shuffle(WEEK4_LETTERS.slice()), w4LIdx=0;
const bigLetterW4  = qs('#bigLetterW4');
const letterAreaW4 = qs('#letterAreaW4');
function renderW4Letter(){ bigLetterW4.textContent = w4Letters[w4LIdx]; }
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

let w4Words = shuffle(WEEK4_WORDS.slice()), w4WIdx=0;
const bigWordW4   = qs('#bigWordW4');
const blendAreaW4 = qs('#blendSeqAreaW4');
function renderW4Word(){ bigWordW4.textContent = w4Words[w4WIdx]; }
function playCurrentW4(){ playBlend(w4Words[w4WIdx]); }
function nextW4Word(){ w4WIdx=(w4WIdx+1)%w4Words.length; renderW4Word(); playCurrentW4(); }
function prevW4Word(){ w4WIdx=(w4WIdx-1+w4Words.length)%w4Words.length; renderW4Word(); playCurrentW4(); }
qs('#prevWordBtnW4').addEventListener('click', prevW4Word);
qs('#nextWordBtnW4').addEventListener('click', nextW4Word);
blendAreaW4.addEventListener('click', ()=>{ playCurrentW4(); nextW4Word(); });
let w4WordTouch=0;
blendAreaW4.addEventListener('touchstart',e=>{w4WordTouch=e.changedTouches[0].clientX;},{passive:true});
blendAreaW4.addEventListener('touchend',e=>{
  const dx=e.changedTouches[0].clientX-w4WordTouch;
  if(Math.abs(dx)>40){ dx<0?nextW4Word():prevW4Word(); } else { playCurrentW4(); nextW4Word(); }
},{passive:true});

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

/* ===== Week 5: letters + single-word blending (FIXED) ===== */
let w5Letters = shuffle(WEEK5_LETTERS.slice()), w5LIdx=0;
const bigLetterW5  = qs('#bigLetterW5');
const letterAreaW5 = qs('#letterAreaW5');
function renderW5Letter(){ bigLetterW5.textContent = w5Letters[w5LIdx]; }
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

let w5Words = shuffle(WEEK5_WORDS.slice()), w5WIdx=0;
const bigWordW5   = qs('#bigWordW5');
const blendAreaW5 = qs('#blendSeqAreaW5');
function renderW5Word(){ bigWordW5.textContent = w5Words[w5WIdx]; }
function playCurrentW5(){ playBlend(w5Words[w5WIdx]); }
function nextW5Word(){ w5WIdx=(w5WIdx+1)%w5Words.length; renderW5Word(); playCurrentW5(); }
function prevW5Word(){ w5WIdx=(w5WIdx-1+w5Words.length)%w5Words.length; renderW5Word(); playCurrentW5(); }
qs('#prevWordBtnW5').addEventListener('click', prevW5Word);
qs('#nextWordBtnW5').addEventListener('click', nextW5Word);
blendAreaW5.addEventListener('click', ()=>{ playCurrentW5(); nextW5Word(); });
let w5WordTouch=0;
blendAreaW5.addEventListener('touchstart',e=>{w5WordTouch=e.changedTouches[0].clientX;},{passive:true});
blendAreaW5.addEventListener('touchend',e=>{
  const dx=e.changedTouches[0].clientX-w5WordTouch;
  if(Math.abs(dx)>40){ dx<0?nextW5Word():prevW5Word(); } else { playCurrentW5(); nextW5Word(); }
},{passive:true});

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
let a2Letters = shuffle(A2W1_LETTERS.slice()), a2LIdx = 0;
const bigLetterA2  = qs('#bigLetterA2');
const letterAreaA2 = qs('#letterAreaA2');

function renderA2Letter(){ bigLetterA2.textContent = a2Letters[a2LIdx]; }
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
let a2Words = shuffle(A2W1_WORDS.slice()), a2WIdx = 0;
const bigWordA2   = qs('#bigWordA2');
const blendAreaA2 = qs('#blendSeqAreaA2');

function renderA2Word(){ bigWordA2.textContent = a2Words[a2WIdx]; }
function playCurrentA2(){ playBlend(a2Words[a2WIdx]); }
function nextA2Word(){ a2WIdx=(a2WIdx+1)%a2Words.length; renderA2Word(); playCurrentA2(); }
function prevA2Word(){ a2WIdx=(a2WIdx-1+a2Words.length)%a2Words.length; renderA2Word(); playCurrentA2(); }

qs('#prevWordBtnA2').addEventListener('click', prevA2Word);
qs('#nextWordBtnA2').addEventListener('click', nextA2Word);
blendAreaA2.addEventListener('click', ()=>{ playCurrentA2(); nextA2Word(); });

let a2WordTouch = 0;
blendAreaA2.addEventListener('touchstart', e => { a2WordTouch = e.changedTouches[0].clientX; }, {passive:true});
blendAreaA2.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - a2WordTouch;
  if (Math.abs(dx) > 40) { dx < 0 ? nextA2Word() : prevA2Word(); }
  else { playCurrentA2(); nextA2Word(); }
}, {passive:true});

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




/* ===================== Navigation: home buttons & back ===================== */
qs('#btn-practise').addEventListener('click', ()=>startPractice(ALPHABET));
qs('#btn-phase-1').addEventListener('click', ()=>startPractice(PHASE_SETS.phase1));
qs('#btn-phase-2').addEventListener('click', ()=>{ show('week2'); activateWeek2Tab('letters'); });
qs('#btn-phase-3').addEventListener('click', ()=>{ show('week3'); activateWeek3Tab('letters'); });
qs('#btn-phase-4').addEventListener('click', ()=>{ show('week4'); activateWeek4Tab('letters'); });
qs('#btn-phase-5').addEventListener('click', ()=>{ show('week5'); activateWeek5Tab('letters'); });
qs('#btn-phase-6').addEventListener('click', ()=>{ show('a2w1'); activateA2Tab('letters'); });


qs('#backLetters').addEventListener('click', ()=>show('home'));
qs('#backWeek2').addEventListener('click',   ()=>show('home'));
qs('#backWeek3').addEventListener('click',   ()=>show('home'));
qs('#backWeek4').addEventListener('click',   ()=>show('home'));
qs('#backWeek5').addEventListener('click',   ()=>show('home'));
qs('#backA2').addEventListener('click', ()=>show('home'));

/* ===================== Init ===================== */
show('home');


