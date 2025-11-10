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

// Sequential blending lists (Weeks 4/5 + A2W1)
const BLEND_W4   = ['mum','duck','pet','pick','set','red','sock','run'];
const BLEND_W5   = ['hug','big','fat','luck','bed','muck','kid','rub'];
const BLEND_A2W1 = ['huff','off','puff','bell','hill','tell','mess','hiss','fuss','jug','jam','jet'];

/* ===================== Utils ===================== */
let audio;
const qs  = (s) => document.querySelector(s);

function show(name){
  qs('#home').style.display      = name==='home'     ? 'flex':'none';
  qs('#letters').style.display   = name==='letters'  ? 'block':'none';
  qs('#week2').style.display     = name==='week2'    ? 'block':'none';
  qs('#week3').style.display     = name==='week3'    ? 'block':'none';
  qs('#blendSeq').style.display  = name==='blendSeq' ? 'block':'none';
}
function shuffle(a){
  for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; }
  return a;
}
function playSoundFor(key){
  if(audio && !audio.paused) audio.pause();
  audio = new Audio(`sounds/${key}.mp3`);
  audio.currentTime = 0;
  audio.play().catch(()=>{ /* missing file ok */ });
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
function renderLetter(){ bigLetter.textContent = CURRENT_SET[idx].toUpperCase(); }
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

/* ===================== Week 2: letters + single-word blending ===================== */
// letters pane
let w2Letters = shuffle(WEEK2_LETTERS.slice()), w2LIdx=0;
const bigLetterW2  = qs('#bigLetterW2');
const letterAreaW2 = qs('#letterAreaW2');
function renderW2Letter(){ bigLetterW2.textContent = w2Letters[w2LIdx].toUpperCase(); }
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

// blending pane (single word)
let w2Words = shuffle(WEEK2_WORDS.slice()), w2WIdx=0;
const bigWordW2   = qs('#bigWordW2');
const blendAreaW2 = qs('#blendSeqAreaW2');
function renderW2Word(){ bigWordW2.textContent = w2Words[w2WIdx]; }
function playBlend(word){
  const parts = word.split('');
  let i=0;
  const step=()=>{
    if(i<parts.length){
      const a=new Audio(`sounds/${parts[i]}.mp3`);
      a.play().catch(()=>{});
      a.onended=()=>{i++; step();};
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

// tab toggle week2
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

/* ===================== Week 3: letters + single-word blending ===================== */
// letters pane
let w3Letters = shuffle(WEEK3_LETTERS.slice()), w3LIdx=0;
const bigLetterW3  = qs('#bigLetterW3');
const letterAreaW3 = qs('#letterAreaW3');
function renderW3Letter(){ bigLetterW3.textContent = w3Letters[w3LIdx].toUpperCase(); }
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

// blending pane (single word)
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

// tab toggle week3
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

/* ===================== Sequential blending for Weeks 4/5 + A2W1 ===================== */
const blendSeqTitle = qs('#blendSeqTitle');
const bigWord       = qs('#bigWord');
const blendSeqArea  = qs('#blendSeqArea');
let CURRENT_WORDS=[], wIdx=0;

function startBlending(words, title){
  CURRENT_WORDS = words.slice();
  wIdx = 0;
  bigWord.textContent = CURRENT_WORDS[wIdx];
  blendSeqTitle.textContent = title || 'Blending Practice';
  show('blendSeq');
  setTimeout(()=>blendSeqArea.focus(),50);
}
function playCurrentWord(){ playBlend(CURRENT_WORDS[wIdx]); }
function nextWord(){ wIdx=(wIdx+1)%CURRENT_WORDS.length; bigWord.textContent=CURRENT_WORDS[wIdx]; playCurrentWord(); }
function prevWord(){ wIdx=(wIdx-1+CURRENT_WORDS.length)%CURRENT_WORDS.length; bigWord.textContent=CURRENT_WORDS[wIdx]; playCurrentWord(); }
qs('#prevWordBtn').addEventListener('click', prevWord);
qs('#nextWordBtn').addEventListener('click', nextWord);
blendSeqArea.addEventListener('click', ()=>{ playCurrentWord(); nextWord(); });
let wordTouchStart=0;
blendSeqArea.addEventListener('touchstart',e=>{wordTouchStart=e.changedTouches[0].clientX;},{passive:true});
blendSeqArea.addEventListener('touchend',e=>{
  const dx=e.changedTouches[0].clientX-wordTouchStart;
  if(Math.abs(dx)>40){ dx<0?nextWord():prevWord(); } else { playCurrentWord(); nextWord(); }
},{passive:true});

/* ===================== Navigation: home buttons & back ===================== */
qs('#btn-practise').addEventListener('click', ()=>startPractice(ALPHABET));
qs('#btn-phase-1').addEventListener('click', ()=>startPractice(PHASE_SETS.phase1));
qs('#btn-phase-2').addEventListener('click', ()=>{ show('week2'); activateWeek2Tab('letters'); });
qs('#btn-phase-3').addEventListener('click', ()=>{ show('week3'); activateWeek3Tab('letters'); });
qs('#btn-phase-4').addEventListener('click', ()=>startBlending(BLEND_W4,  'Autumn 1 – Week 4'));
qs('#btn-phase-5').addEventListener('click', ()=>startBlending(BLEND_W5,  'Autumn 1 – Week 5'));
qs('#btn-phase-6').addEventListener('click', ()=>startBlending(BLEND_A2W1,'Autumn 2 – Week 1'));

qs('#backLetters').addEventListener('click', ()=>show('home'));
qs('#backWeek2').addEventListener('click',   ()=>show('home'));
qs('#backWeek3').addEventListener('click',   ()=>show('home'));
qs('#backBlendSeq').addEventListener('click',()=>show('home'));

/* ===================== Init ===================== */
show('home');
