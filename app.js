/* ===================== Data ===================== */
const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('');

// Phase 2 (general letters)
const PHASE_SETS = {
  phase1: ['s','a','t','p'],
  phase4: ['ck','e','u','r'],
  phase5: ['h','b','f','l'],
  phase6: ['f','ff','s','ss','l','ll','v','vv'],
};

// Autumn 1
const WEEK2_LETTERS = ['i','n','m','d'];// ===== Progress (localStorage) =====
const STORAGE_KEY = "phonics_progress_v1";
function getProgress(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return { completed: [], unlockAll: false, parentMode: false };
    const obj = JSON.parse(raw);
    return {
      completed: Array.isArray(obj.completed) ? obj.completed : [],
      unlockAll: !!obj.unlockAll,
      parentMode: !!obj.parentMode
    };
  }catch(e){
    return { completed: [], unlockAll: false, parentMode: false };
  }
}
function setProgress(p){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}
function isCompleted(key){
  if(!key) return false;
  return getProgress().completed.includes(key);
}
function markCompleted(key){
  if(!key) return;
  const p = getProgress();
  if(!p.completed.includes(key)){
    p.completed.push(key);
    setProgress(p);
  }
}

// Week ordering (for locks/unlocks on the Home screen)
const WEEK_ORDER = [
  'L1W1','L1W2','L1W3','L1W4','L1W5',
  'L2W1','L2W2','L2W3','L2W4','L2W5',
  'L3W1','L3W2','L3W3','L3W4','L3W5',
  'L4W1','L4W2','L4W3','L4W4',
  'L5W1','L5W2','L5W3','L5W4',
  'L6W1','L6W2','L6W3','L6W4','L6W5',
];

const WEEK_BUTTONS = {
  L1W1: '#btn-phase-1',
  L1W2: '#btn-phase-2',
  L1W3: '#btn-phase-3',
  L1W4: '#btn-phase-4',
  L1W5: '#btn-phase-5',

  L2W1: '#btn-phase-6',
  L2W2: '#btn-phase-7',
  L2W3: '#btn-phase-8',
  L2W4: '#btn-phase-9',
  L2W5: '#btn-phase-10',

  L3W1: '#btn-s1w1',
  L3W2: '#btn-s1w2',
  L3W3: '#btn-s1w3',
  L3W4: '#btn-s1w4',
  L3W5: '#btn-s1w5',

  L4W1: '#btn-s2w1',
  L4W2: '#btn-s2w2',
  L4W3: '#btn-s2w3',
  L4W4: '#btn-s2w4',

  L5W1: '#btn-su1w1',
  L5W2: '#btn-su1w2',
  L5W3: '#btn-su1w3',
  L5W4: '#btn-su1w4',

  L6W1: '#btn-su2w1',
  L6W2: '#btn-su2w2',
  L6W3: '#btn-su2w3',
  L6W4: '#btn-su2w4',
  L6W5: '#btn-su2w5',
};

function updateHomeLocks(){
  const p = getProgress();

  const completed = new Set(p.completed || []);
  const unlockAll = !!p.unlockAll;

  // Determine the "next" week to unlock (sequential)
  let firstIncompleteIdx = WEEK_ORDER.findIndex(k => !completed.has(k));
  if (firstIncompleteIdx === -1) firstIncompleteIdx = WEEK_ORDER.length - 1;

  const unlocked = new Set();
  if (unlockAll){
    WEEK_ORDER.forEach(k => unlocked.add(k));
  }else{
    WEEK_ORDER.forEach((k, i) => {
      if (i <= firstIncompleteIdx) unlocked.add(k);
      if (completed.has(k)) unlocked.add(k); // always keep completed unlocked
    });
  }

  for (const key of WEEK_ORDER){
    const sel = WEEK_BUTTONS[key];
    const btn = sel ? document.querySelector(sel) : null;
    if (!btn) continue;

    if (completed.has(key)){
      btn.dataset.status = 'done';
      btn.disabled = false;
      btn.setAttribute('aria-disabled', 'false');
    }else if (unlocked.has(key)){
      btn.dataset.status = 'open';
      btn.disabled = false;
      btn.setAttribute('aria-disabled', 'false');
    }else{
      btn.dataset.status = 'locked';
      btn.disabled = true;
      btn.setAttribute('aria-disabled', 'true');
    }
  }
}

const WEEK2_WORDS   = ['sit','nap','man','dip','pat','sad','nip','mat'];

const WEEK3_LETTERS = ['g','o','c','k'];
const WEEK3_WORDS   = ['man','tap','dog','kit','cap','dig','kid','cog'];

const WEEK4_LETTERS = ['ck','e','u','r'];
const WEEK4_WORDS   = ['mum','duck','pet','pick','set','red','sock','run'];

const WEEK5_LETTERS = ['h','b','f','l'];
const WEEK5_WORDS   = ['hug','big','fat','luck','bed','muck','kid','rub'];

// Autumn 2
const A2W1_LETTERS = ['f','ff','s','ss','l','ll','v','vv'];
const A2W1_WORDS   = ['huff','off','puff','bell','hill','tell','mess','hiss','fuss','jug','jam','jet'];

const A2W2_LETTERS = ['v','w','x','y'];
const A2W2_WORDS   = ['van','vet','wet','wig','fox','six','yes','yum'];

const A2W3_LETTERS = ['z','qu','ch'];
const A2W3_WORDS   = ['zip','zap','buzz','fizz','quick','quit','chips','rich'];

const A2W4_LETTERS = ['sh','th','ng','nk'];
const A2W4_WORDS   = ['shell','dish','this','moth','ring','thing','pink','sink'];

const A2W5_LETTERS = ['f','l','s','j','v','w','x','y','z','qu','ch','sh','ng','th','nk'];
const A2W5_WORDS   = ['zips','ships','chips','rings','pins','dogs','sings','ducks'];

// Spring 1
const S1W1_LETTERS = ['ai','ee','igh','oa'];
const S1W1_WORDS   = ['pain','see','sight','coat','hail','jeep','high','road'];

// Use distinct sound keys for long/short oo (so your sound files can be different)
const S1W2_LETTERS = ['oo-long','oo-short','ar','or'];
const S1W2_WORDS   = ['zoo','good','bark','pork','room','hook','yard','born'];

const S1W3_LETTERS = ['ur','ow','oi','ear'];
const S1W3_WORDS   = ['surf','howl','oil','hear','turn','down','join','tear'];

const S1W4_LETTERS = ['air','er'];
const S1W4_WORDS   = ['hair','boxer','letter','rubber','chair','summer','rubbish','coffee'];

const S1W5_LETTERS = ['ai','ee','ur','ow','igh','oa','oi','ear','oo-long','oo-short','air','er','ar','or'];
const S1W5_WORDS   = ['laptop','popcorn','market','raincoat','sunset','starfish','ticket','melon'];

// ===== Added Spring 2 / Summer 1 / Summer 2 =====
const S2W1_LETTERS = ['ai','ee','igh','oa','oo-long','ar','or','ur','oo-short','ow','oi','ear'];

const S2W1_WORDS   = ['tail','deep','fight','load','food','hard','born','surf','foot','town','boil','hear'];

const S2W2_LETTERS = ['air', 'er', 'dd', 'mm', 'tt', 'bb', 'rr', 'gg', 'pp', 'ff'];

const S2W2_WORDS = ['bigger', 'chair', 'fair', 'rubber', 'shimmer', 'butter', 'supper', 'chatter', 'muffin', 'mutter', 'buzzer', 'cannot', 'laptop', 'seven', 'fantastic', 'comic'];

const S2W3_LETTERS = ['ai', 'ee', 'ur', 'ow', 'igh', 'oa', 'oi', 'ear', 'oo-long', 'oo-short', 'air', 'er', 'ar', 'or'];

const S2W3_WORDS = ['sharp', 'shark', 'sheep', 'cheep', 'queen', 'tooth', 'short', 'thinker', 'powder', 'church', 'corner', 'farmer', 'torch', 'chain', 'shower', 'march'];

const S2W4_LETTERS = ['ai', 'ee', 'ur', 'ow', 'igh', 'oa', 'oi', 'ear', 'oo-long', 'oo-short', 'air', 'er', 'ar', 'or'];

const S2W4_WORDS = ['lightning', 'mammoth', 'earring', 'poison', 'queens', 'chains', 'chairs', 'cars', 'boots', 'surfs', 'cooks', 'cheeps', 'torches', 'boxes', 'fizzes', 'fishes'];

const SU1W1_LETTERS = ['s', 'a', 't', 'i', 'n', 'm', 'd', 'g', 'o', 'c', 'k', 'ck', 'e', 'u', 'r', 'h', 'b', 'f', 'l', 'ff', 'll', 'ss', 'j', 'v', 'w', 'x', 'y', 'z', 'zz', 'qu', 'ch', 'sh', 'th', 'ng', 'nk', 'ai', 'ee', 'igh', 'oa', 'oo-long', 'oo-short', 'ar', 'or', 'ur', 'ow', 'oi', 'ear', 'air', 'er'];

const SU1W1_WORDS = ['hand', 'jump', 'lift', 'soft', 'tent', 'wind', 'hump', 'nest', 'lost', 'thump', 'belt', 'pond'];

const SU1W2_LETTERS = ['s', 'a', 't', 'i', 'n', 'm', 'd', 'g', 'o', 'c', 'k', 'ck', 'e', 'u', 'r', 'h', 'b', 'f', 'l', 'ff', 'll', 'ss', 'j', 'v', 'w', 'x', 'y', 'z', 'zz', 'qu', 'ch', 'sh', 'th', 'ng', 'nk', 'ai', 'ee', 'igh', 'oa', 'oo-long', 'oo-short', 'ar', 'or', 'ur', 'ow', 'oi', 'ear', 'air', 'er'];

const SU1W2_WORDS = ['thank', 'champ', 'bench', 'shift', 'cost', 'shrink', 'crack', 'smell', 'dress', 'bring', 'truck', 'milk'];

const SU1W3_LETTERS = ['s', 'a', 't', 'i', 'n', 'm', 'd', 'g', 'o', 'c', 'k', 'ck', 'e', 'u', 'r', 'h', 'b', 'f', 'l', 'ff', 'll', 'ss', 'j', 'v', 'w', 'x', 'y', 'z', 'zz', 'qu', 'ch', 'sh', 'th', 'ng', 'nk', 'ai', 'ee', 'igh', 'oa', 'oo-long', 'oo-short', 'ar', 'or', 'ur', 'ow', 'oi', 'ear', 'air', 'er'];

const SU1W3_WORDS = ['farming', 'forest', 'blanket', 'children', 'freshness', 'present', 'windmill', 'lunchbox', 'shampoo', 'wooden', 'finger', 'printer'];

const SU1W4_LETTERS = ['s', 'a', 't', 'i', 'n', 'm', 'd', 'g', 'o', 'c', 'k', 'ck', 'e', 'u', 'r', 'h', 'b', 'f', 'l', 'ff', 'll', 'ss', 'j', 'v', 'w', 'x', 'y', 'z', 'zz', 'qu', 'ch', 'sh', 'th', 'ng', 'nk', 'ai', 'ee', 'igh', 'oa', 'oo-long', 'oo-short', 'ar', 'or', 'ur', 'ow', 'oi', 'ear', 'air', 'er'];

const SU1W4_WORDS = ['bumping', 'snapping', 'jumping', 'swimming', 'helped', 'cracked', 'grunted', 'printed', 'melted', 'plumpest', 'freshest', 'softest'];

const SU2W1_LETTERS = ['s', 'a', 't', 'i', 'n', 'm', 'd', 'g', 'o', 'c', 'k', 'ck', 'e', 'u', 'r', 'h', 'b', 'f', 'l', 'ff', 'll', 'ss', 'j', 'v', 'w', 'x', 'y', 'z', 'zz', 'qu', 'ch', 'sh', 'th', 'ng', 'nk', 'ai', 'ee', 'igh', 'oa', 'oo-long', 'oo-short', 'ar', 'or', 'ur', 'ow', 'oi', 'ear', 'air', 'er'];

const SU2W1_WORDS = ['bleed', 'growl', 'bright', 'sport', 'steep', 'train', 'flight', 'green', 'spoon', 'storm', 'speech', 'smart'];

const SU2W2_LETTERS = ['s', 'a', 't', 'i', 'n', 'm', 'd', 'g', 'o', 'c', 'k', 'ck', 'e', 'u', 'r', 'h', 'b', 'f', 'l', 'ff', 'll', 'ss', 'j', 'v', 'w', 'x', 'y', 'z', 'zz', 'qu', 'ch', 'sh', 'th', 'ng', 'nk', 'ai', 'ee', 'igh', 'oa', 'oo-long', 'oo-short', 'ar', 'or', 'ur', 'ow', 'oi', 'ear', 'air', 'er'];

const SU2W2_WORDS = ['street', 'screen', 'stair', 'strong', 'three', 'scoop', 'free', 'clear', 'slight', 'smear', 'spoil', 'clown'];

const SU2W3_LETTERS = ['s', 'a', 't', 'i', 'n', 'm', 'd', 'g', 'o', 'c', 'k', 'ck', 'e', 'u', 'r', 'h', 'b', 'f', 'l', 'ff', 'll', 'ss', 'j', 'v', 'w', 'x', 'y', 'z', 'zz', 'qu', 'ch', 'sh', 'th', 'ng', 'nk', 'ai', 'ee', 'igh', 'oa', 'oo-long', 'oo-short', 'ar', 'or', 'ur', 'ow', 'oi', 'ear', 'air', 'er'];

const SU2W3_WORDS = ['sports', 'floats', 'crowds', 'spears', 'dresses', 'splashes', 'speeches', 'balloon', 'appear', 'portrait', 'scrunches', 'spoons'];

const SU2W4_LETTERS = ['s', 'a', 't', 'i', 'n', 'm', 'd', 'g', 'o', 'c', 'k', 'ck', 'e', 'u', 'r', 'h', 'b', 'f', 'l', 'ff', 'll', 'ss', 'j', 'v', 'w', 'x', 'y', 'z', 'zz', 'qu', 'ch', 'sh', 'th', 'ng', 'nk', 'ai', 'ee', 'igh', 'oa', 'oo-long', 'oo-short', 'ar', 'or', 'ur', 'ow', 'oi', 'ear', 'air', 'er'];

const SU2W4_WORDS = ['cloaked', 'scooped', 'sleeping', 'creeping', 'crowned', 'started', 'toasted', 'smeared', 'floated', 'printed', 'painting', 'blinked'];

const SU2W5_LETTERS = ['s', 'a', 't', 'i', 'n', 'm', 'd', 'g', 'o', 'c', 'k', 'ck', 'e', 'u', 'r', 'h', 'b', 'f', 'l', 'ff', 'll', 'ss', 'j', 'v', 'w', 'x', 'y', 'z', 'zz', 'qu', 'ch', 'sh', 'th', 'ng', 'nk', 'ai', 'ee', 'igh', 'oa', 'oo-long', 'oo-short', 'ar', 'or', 'ur', 'ow', 'oi', 'ear', 'air', 'er'];

const SU2W5_WORDS = ['greenest', 'smartest', 'brighter', 'brightest', 'painter', 'boaster', 'brownest', 'trainer', 'swiftest', 'freshest', 'helper', 'hunter'];


/* ===================== Utils ===================== */
let audio;
let currentBlend = null; // controller to cancel ongoing blends

// 🔊 Stretchy vs bouncy consonants (phonics rule)
const STRETCHY_CONSONANTS = ['m','n','s','f','l','v','z','r'];

function isHeldConsonant(key){
  // mm → m, ss → s, etc.
  const base = key.replace(/(.)\1/, '$1');
  return STRETCHY_CONSONANTS.includes(base);
}



const qs = (s) => document.querySelector(s);

function safeOn(target, event, handler, options){
  const el = (typeof target === 'string') ? qs(target) : target;
  if (!el) return;
  el.addEventListener(event, handler, options);
}


function showToast(msg){
  const el = document.getElementById("toast");
  if(!el) return;
  el.textContent = msg;
  el.classList.remove("hidden");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => el.classList.add("hidden"), 1800);
}


function show(name){
 const screens = [
  'home','letters','settings','celebrate',
  'term-autumn','term-spring','term-summer',
  'week2','week3','week4','week5',
  'a2w1','weekA2W2','weekA2W3','weekA2W4','weekA2W5',
  'spring1w1','spring1w2','spring1w3','spring1w4','spring1w5',
  'spring2w1','spring2w2','spring2w3','spring2w4',
  'summer1w1','summer1w2','summer1w3','summer1w4',
  'summer2w1','summer2w2','summer2w3','summer2w4','summer2w5'
];


  for (const id of screens){
    const el = qs('#' + id);
    if (!el) continue;

    if (id === 'home') {
      el.style.display = (name === 'home') ? 'flex' : 'none';
    } else if (id === 'letters') {
      el.style.display = (name === 'letters') ? 'block' : 'none';
    } else {
      el.style.display = (name === id) ? 'block' : 'none';
    }
  }

  qs('#spring2w1').style.display = name==='spring2w1' ? 'block':'none';
  qs('#spring2w2').style.display = name==='spring2w2' ? 'block':'none';
  qs('#spring2w3').style.display = name==='spring2w3' ? 'block':'none';
  qs('#spring2w4').style.display = name==='spring2w4' ? 'block':'none';

  qs('#summer1w1').style.display = name==='summer1w1' ? 'block':'none';
  qs('#summer1w2').style.display = name==='summer1w2' ? 'block':'none';
  qs('#summer1w3').style.display = name==='summer1w3' ? 'block':'none';
  qs('#summer1w4').style.display = name==='summer1w4' ? 'block':'none';

  qs('#summer2w1').style.display = name==='summer2w1' ? 'block':'none';
  qs('#summer2w2').style.display = name==='summer2w2' ? 'block':'none';
  qs('#summer2w3').style.display = name==='summer2w3' ? 'block':'none';
  qs('#summer2w4').style.display = name==='summer2w4' ? 'block':'none';
  qs('#summer2w5').style.display = name==='summer2w5' ? 'block':'none';


  if (name === 'home') updateHomeLocks();
}

// Double consonants should reuse the single-letter sound (held longer)
const HELD_CONSONANTS = {
  ff: 'f',
  ll: 'l',
  ss: 's',
  vv: 'v',
  bb: 'b',
  dd: 'd',
  gg: 'g',
  mm: 'm',
  nn: 'n',
  pp: 'p',
  rr: 'r',
  tt: 't',
  zz: 'z',
};

// How long to “hold” a double consonant (tweak if you want)

function baseSoundKey(key){
  return HELD_CONSONANTS[key] || key;
}

function playSoundFor(key){
  if (!key) return;

  if (audio && !audio.paused) audio.pause();

  const baseKey = baseSoundKey(key);
  audio = new Audio(`sounds/${baseKey}.mp3`);
  audio.currentTime = 0;
  audio.play().catch(()=>{});
}


// Phonics clusters that should be treated as a single sound
const PHONICS_CLUSTERS = [
  // double consonants
  'bb','dd','ff','gg','ll','mm','nn','pp','rr','ss','tt','vv','zz',

  // consonant digraphs
  'ck','sh','ch','th','ng','nk',

  // other
  'qu',

  // vowel digraphs / trigraphs (needed for Spring 1 etc.)
  'ai','ee','igh','oa',
  'oo',
  'oo-long','oo-short',
  'ar','or','ur',
  'ow','oi',
  'ear','air','er',
];


function splitForPhonics(word){
  const parts = [];
  let i = 0;
  while (i < word.length){
    let matched = false;

    // longest match first
    const clusters = PHONICS_CLUSTERS.slice().sort((a,b)=>b.length-a.length);
    for (const cluster of clusters){
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

// Play sound for each phonics part (NO final full-word sound)
function playBlend(word){
  if (!word) return;

  // cancel previous blend
  if (currentBlend && currentBlend.audio){
    currentBlend.cancelled = true;
    try { currentBlend.audio.pause(); } catch {}
  }

  const controller = { cancelled:false, audio:null };
  currentBlend = controller;

  const parts = splitForPhonics(word);
  let i = 0;

  const step = () => {
    if (controller.cancelled) return;
    if (i >= parts.length){
      controller.audio = null;
      return;
    }

   const rawKey = parts[i];

// ✅ Resolve "oo" to the correct sound file
let resolvedKey = rawKey;
if (rawKey === 'oo') {
  const OO_SHORT_WORDS = new Set([
    'good', 'book', 'look', 'cook', 'hook', 'foot', 'wood'
  ]);
  resolvedKey = OO_SHORT_WORDS.has(word.toLowerCase()) ? 'oo-short' : 'oo-long';
}

const baseKey = baseSoundKey(resolvedKey);

const a = new Audio(`sounds/${baseKey}.mp3`);
controller.audio = a;

a.play().catch(()=>{});

a.onended = () => {
  if (controller.cancelled) return;

  // 👇 HOLD the sound instead of replaying it
  const holdDelay = isHeldConsonant(rawKey) ? 180 : 0; // tweak 120–250ms
  setTimeout(() => {
    i++;
    step();
  }, holdDelay);
};

  };

  step();
}

// ===== For Long and short oo =====
function getDisplayLabel(key){
  // Show kid-friendly text for special keys
  if (key === 'oo-long' || key === 'oo-short') return 'oo';
  return key;
}

function getDurationCount(key){
  // How many dots to show (0 = show nothing)
  if (key === 'oo-short') return 1;
  if (key === 'oo-long')  return 3;
  return 0;
}

function ensureDotsEl(prefix, bigLetterEl){
  // Try to find existing dots container
  let el = document.querySelector(`#durationDots${prefix}`);
  if (el) return el;

  // If not present, create it right under the big letter
  el = document.createElement('div');
  el.id = `durationDots${prefix}`;
  el.className = 'duration-dots';

  if (bigLetterEl && bigLetterEl.parentNode){
    bigLetterEl.parentNode.insertBefore(el, bigLetterEl.nextSibling);
  }
  return el;
}

function renderDots(dotsEl, count){
  if (!dotsEl) return;
  if (!count){
    dotsEl.innerHTML = '';
    return;
  }
  dotsEl.innerHTML = '';
  for (let i=0; i<count; i++){
    const d = document.createElement('span');
    d.className = 'dot on';
    dotsEl.appendChild(d);
  }
}





// ===== Overlay + Celebration helpers =====
let ACTIVE_WEEK_KEY = null;

function setOverlay(open, title, msg, primaryText, secondaryText, onPrimary, onSecondary){
  const overlay = document.querySelector('#softOverlay');
  if(!overlay) return;

  const t = document.querySelector('#overlayTitle');
  const m = document.querySelector('#overlayMsg');
  const p = document.querySelector('#overlayPrimary');
  const s = document.querySelector('#overlaySecondary');

  if (t) t.textContent = title || "Great job!";
  if (m) m.textContent = msg || "Ready to try blending words?";
  if (p) p.textContent = primaryText || "Start blending";
  if (s) s.textContent = secondaryText || "Not now";

  // reset handlers safely
  if (p){
    p.onclick = null;
    p.onclick = () => {
      setOverlay(false);
      onPrimary && onPrimary();
    };
  }
  if (s){
    s.onclick = null;
    s.onclick = () => {
      setOverlay(false);
      onSecondary && onSecondary();
    };
  }

  overlay.classList.toggle('hidden', !open);
  overlay.setAttribute('aria-hidden', open ? 'false' : 'true');
}

function showCelebration({ title, practised, extra, weekKey }){
  ACTIVE_WEEK_KEY = weekKey || null;

  const titleEl = document.querySelector('#celebrateTitle');
  const listEl  = document.querySelector('#celebrateList');
  const extraEl = document.querySelector('#celebrateExtra');

  if (titleEl) titleEl.textContent = title || "Week complete!";
  if (extraEl) extraEl.textContent = extra || "";

  if (listEl){
    listEl.innerHTML = '';
    const arr = Array.isArray(practised) ? practised : [];
    arr.forEach((item, i) => {
      const chip = document.createElement('div');
      chip.className = 'practised-chip';
      chip.style.animationDelay = `${i * 70}ms`;
      chip.textContent = item;
      listEl.appendChild(chip);
    });
  }

// ✅ Hide Next button if this is the last week
const nextBtn = document.querySelector('#celebrateNext');

if (nextBtn){
  const idx = weekKey ? WEEK_ORDER.indexOf(weekKey) : -1;
  const hasNext = (idx >= 0 && idx < WEEK_ORDER.length - 1);

  nextBtn.classList.toggle('hidden', !hasNext);
  nextBtn.style.setProperty('display', hasNext ? 'inline-flex' : 'none', 'important');
  nextBtn.setAttribute('aria-hidden', hasNext ? 'false' : 'true');

  console.log('Celebrate:', { weekKey, idx, hasNext });
}

  
  show('celebrate');
}

// Navigate to next week using your existing HOME buttons
function goToWeekByKey(key){
  const sel = WEEK_BUTTONS[key];
  if(!sel) return false;
  const btn = document.querySelector(sel);
  if(!btn || btn.disabled) return false;
  btn.click();
  return true;
}


/* ===================== General letter practice ===================== */
let PRACTICE_KEY = null;
let PRACTICE_SEEN_LAST = false;
let CURRENT_SET = [];
let idx = 0;

function startPractice(letters, progressKey = null){
  CURRENT_SET = (letters || []).slice(); // ✅ copy
  idx = 0;

  PRACTICE_KEY = progressKey;            // ✅ track week key or null
  PRACTICE_SEEN_LAST = false;

  show('letters');
  renderLetter();
  setTimeout(()=>qs('#letterArea')?.focus(), 50);
}

function setBigLetterDisplay(el, key){
  if (!el) return;

  const label = getDisplayLabel(key);

  // For double letters like tt, mm, ss: render as two spans with a gap
  if (key && key.length === 2 && key[0] === key[1]){
    el.classList.add('split-double');
    el.innerHTML = `<span>${label[0]}</span><span>${label[1]}</span>`;
    return;
  }

  // Normal single letters / digraphs
  el.classList.remove('split-double');
  el.textContent = label;
}


function renderLetter(){
  const big = qs('#bigLetter');

  if (!CURRENT_SET.length){
    if (big) big.textContent = '';
    return;
  }

  if (big) big.textContent = CURRENT_SET[idx] ?? '';

  // ✅ Week completion logic (only when progressKey is provided)
  if (PRACTICE_KEY && !PRACTICE_SEEN_LAST && idx === CURRENT_SET.length - 1){
    PRACTICE_SEEN_LAST = true;
    markCompleted(PRACTICE_KEY);
    showToast("⭐ Week completed!");
    try{
      if (window.confetti) window.confetti({ particleCount: 120, spread: 70, origin: { y: 0.7 } });
    }catch(e){}
    updateHomeLocks();

    showCelebration({
      title: "Week complete!",
      practised: CURRENT_SET,
      extra: "",
      weekKey: PRACTICE_KEY
    });
  }
}

function nextLetter(){
  if (!CURRENT_SET.length) return;
  idx = (idx + 1) % CURRENT_SET.length;
  renderLetter();
  playSoundFor(CURRENT_SET[idx]);
}

function prevLetter(){
  if (!CURRENT_SET.length) return;
  idx = (idx - 1 + CURRENT_SET.length) % CURRENT_SET.length;
  renderLetter();
  playSoundFor(CURRENT_SET[idx]);
}

// ✅ Tap to play ONLY (no auto-advance)
safeOn('#letterArea', 'click', () => {
  if (!CURRENT_SET.length) return;
  playSoundFor(CURRENT_SET[idx]);
});

// buttons
safeOn('#prevBtn', 'click', prevLetter);
safeOn('#nextBtn', 'click', nextLetter);

// swipe
let touchStartX = 0;
safeOn('#letterArea', 'touchstart', e => {
  touchStartX = e.changedTouches[0].clientX;
}, { passive: true });

safeOn('#letterArea', 'touchend', e => {
  if (!CURRENT_SET.length) return;

  const dx = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) > 40) dx < 0 ? nextLetter() : prevLetter();
  else playSoundFor(CURRENT_SET[idx]);
}, { passive: true });


/* ===================== Generic Week Setup ===================== */
function setupWeek({
  screenId,
  headerTitleId, // optional
  letters,
  words,
  prefix,
  weekKey = null,
}){
  const letterArea = qs(`#letterArea${prefix}`);
  const bigLetter  = qs(`#bigLetter${prefix}`);
  const prevBtn    = qs(`#prevBtn${prefix}`);
  const nextBtn    = qs(`#nextBtn${prefix}`);

  const blendArea  = qs(`#blendSeqArea${prefix}`);
  const bigWord    = qs(`#bigWord${prefix}`);
  const prevWord   = qs(`#prevWordBtn${prefix}`);
  const nextWord   = qs(`#nextWordBtn${prefix}`);
// Completion tracking (mark week done when last letter + last word have been seen at least once)
  let promptedBlend = false;
  let seenLastLetter = false;
  let seenLastWord = false;
  let didComplete = !!(weekKey && isCompleted(weekKey));


    function maybeComplete(){
    if (!weekKey || didComplete) return;

    const needsWords = Array.isArray(words) && words.length > 0;
    const completeNow = needsWords ? (seenLastLetter && seenLastWord) : seenLastLetter;

    if (completeNow){
      didComplete = true;
      markCompleted(weekKey);
      showToast("⭐ Week completed!");
      try{ if (window.confetti) window.confetti({ particleCount: 140, spread: 75, origin: { y: 0.7 } }); }catch(e){}
      updateHomeLocks();

      // ✅ Celebration screen
      const letterList = (letters || []).slice();
      const wordList = (words || []).slice();
      const extraMsg = needsWords ? `Blending words complete ✅` : "";

      showCelebration({
        title: "Week complete!",
        practised: letterList,
        extra: extraMsg,
        weekKey
      });
    }
  }



  const tabLetters = qs(`#tabLetters${prefix}`);
  const tabBlend   = qs(`#tabBlend${prefix}`);
  const paneLetters= qs(`#paneLetters${prefix}`);
  const paneBlend  = qs(`#paneBlend${prefix}`);

  if (headerTitleId){
    const h = qs(headerTitleId);
    if (h) h.textContent = h.textContent; // no-op, placeholder
  }

  // state
  let lIdx = 0;
  let wIdx = 0;

  function renderLetter(){
  const key = letters[lIdx] ?? '';
  const label = getDisplayLabel(key);

  if (bigLetter){
  // Fix "tt" (and any double letter) showing too close by inserting a thin space
  if (key.length === 2 && key[0] === key[1]){
    bigLetter.textContent = `${label[0]}\u2009${label[1]}`; // thin space
  } else {
    bigLetter.textContent = label;
  }
}


  // ✅ show dots for oo-short / oo-long (and nothing for others)
  const dotsEl = ensureDotsEl(prefix, bigLetter);
  renderDots(dotsEl, getDurationCount(key));

  if (letters.length && lIdx === letters.length - 1){
    seenLastLetter = true;

    const hasWords = Array.isArray(words) && words.length > 0;

    // 🔹 If this week has blending words, prompt once
   if (hasWords && !didComplete && !promptedBlend){
  promptedBlend = true;

  setOverlay(
    true,
    "Great job!",
    "Ready to try blending words?",
    "Start blending",
    "Not now",
    () => activate('blend'),
    () => {} // stay on letters
  );
}


    // ❗ Do NOT complete yet if blending words exist
    if (!hasWords){
      maybeComplete();
    }
  }
}

  function renderWord(){
    if (bigWord) bigWord.textContent = words[wIdx] ?? '';
    if (words.length && wIdx === words.length - 1){
      seenLastWord = true;
      maybeComplete();
    }
  }



  function nextL(){ lIdx = (lIdx + 1) % letters.length; renderLetter(); playSoundFor(letters[lIdx]); }
  function prevL(){ lIdx = (lIdx - 1 + letters.length) % letters.length; renderLetter(); playSoundFor(letters[lIdx]); }

  // ✅ Tap letters = play ONLY
  if (letterArea){
    letterArea.addEventListener('click', ()=> playSoundFor(letters[lIdx]));
    let sx=0;
    letterArea.addEventListener('touchstart',e=>{sx=e.changedTouches[0].clientX;},{passive:true});
    letterArea.addEventListener('touchend',e=>{
      const dx=e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 40) dx < 0 ? nextL() : prevL();
      else playSoundFor(letters[lIdx]);
    },{passive:true});
  }

  if (prevBtn) prevBtn.addEventListener('click', prevL);
  if (nextBtn) nextBtn.addEventListener('click', nextL);

  function nextW(){ wIdx = (wIdx + 1) % words.length; renderWord(); playBlend(words[wIdx]); }
  function prevW(){ wIdx = (wIdx - 1 + words.length) % words.length; renderWord(); playBlend(words[wIdx]); }

  // Tap word = replay ONLY
  if (blendArea){
    blendArea.addEventListener('click', ()=> playBlend(words[wIdx]));
    let sx=0;
    blendArea.addEventListener('touchstart',e=>{sx=e.changedTouches[0].clientX;},{passive:true});
    blendArea.addEventListener('touchend',e=>{
      const dx=e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 40) dx < 0 ? nextW() : prevW();
      else playBlend(words[wIdx]);
    },{passive:true});
  }

  if (prevWord) prevWord.addEventListener('click', prevW);
  if (nextWord) nextWord.addEventListener('click', nextW);

  function activate(which){
    if (!tabLetters || !tabBlend || !paneLetters || !paneBlend) return;

    if (which === 'letters'){
      tabLetters.classList.add('active');
      tabBlend.classList.remove('active');
      paneLetters.classList.add('active');
      paneBlend.classList.remove('active');
      renderLetter();
      setTimeout(()=>letterArea?.focus(),50);
    } else {
      tabBlend.classList.add('active');
      tabLetters.classList.remove('active');
      paneBlend.classList.add('active');
      paneLetters.classList.remove('active');
      renderWord();
      setTimeout(()=>blendArea?.focus(),50);
    }
  }

  if (tabLetters) tabLetters.addEventListener('click', ()=>activate('letters'));
  if (tabBlend)   tabBlend.addEventListener('click',   ()=>activate('blend'));

 // expose init
return {
  initLetters(){
    lIdx = 0;
    wIdx = 0;

    // ✅ reset per-entry prompt state
    promptedBlend = false;
    seenLastLetter = false;
    seenLastWord = false;

    // ✅ lock prompt forever if week already completed
    didComplete = !!(weekKey && isCompleted(weekKey));

    activate('letters');
  },

  initBlend(){
    lIdx = 0;
    wIdx = 0;
    activate('blend');
  },
};
}


/* ===================== Boot (after DOM loaded) ===================== */
document.addEventListener('DOMContentLoaded', () => {
  /* ========= 1) Create ALL week controllers first ========= */

  // Level 1 (Autumn 1)
  const week2 = setupWeek({ screenId:'week2',  weekKey:'L1W2', letters: WEEK2_LETTERS, words: WEEK2_WORDS, prefix:'W2' });
  const week3 = setupWeek({ screenId:'week3',  weekKey:'L1W3', letters: WEEK3_LETTERS, words: WEEK3_WORDS, prefix:'W3' });
  const week4 = setupWeek({ screenId:'week4',  weekKey:'L1W4', letters: WEEK4_LETTERS, words: WEEK4_WORDS, prefix:'W4' });
  const week5 = setupWeek({ screenId:'week5',  weekKey:'L1W5', letters: WEEK5_LETTERS, words: WEEK5_WORDS, prefix:'W5' });

  // Level 2 (Autumn 2)
  const a2w1 = setupWeek({ screenId:'a2w1',      weekKey:'L2W1', letters: A2W1_LETTERS, words: A2W1_WORDS, prefix:'A2' });
  const a2w2 = setupWeek({ screenId:'weekA2W2',  weekKey:'L2W2', letters: A2W2_LETTERS, words: A2W2_WORDS, prefix:'A2W2' });
  const a2w3 = setupWeek({ screenId:'weekA2W3',  weekKey:'L2W3', letters: A2W3_LETTERS, words: A2W3_WORDS, prefix:'A2W3' });
  const a2w4 = setupWeek({ screenId:'weekA2W4',  weekKey:'L2W4', letters: A2W4_LETTERS, words: A2W4_WORDS, prefix:'A2W4' });
  const a2w5 = setupWeek({ screenId:'weekA2W5',  weekKey:'L2W5', letters: A2W5_LETTERS, words: A2W5_WORDS, prefix:'A2W5' });

  // Level 3 (Spring 1)
  const s1w1 = setupWeek({ screenId:'spring1w1', weekKey:'L3W1', letters: S1W1_LETTERS, words: S1W1_WORDS, prefix:'S1W1' });
  const s1w2 = setupWeek({ screenId:'spring1w2', weekKey:'L3W2', letters: S1W2_LETTERS, words: S1W2_WORDS, prefix:'S1W2' });
  const s1w3 = setupWeek({ screenId:'spring1w3', weekKey:'L3W3', letters: S1W3_LETTERS, words: S1W3_WORDS, prefix:'S1W3' });
  const s1w4 = setupWeek({ screenId:'spring1w4', weekKey:'L3W4', letters: S1W4_LETTERS, words: S1W4_WORDS, prefix:'S1W4' });
  const s1w5 = setupWeek({ screenId:'spring1w5', weekKey:'L3W5', letters: S1W5_LETTERS, words: S1W5_WORDS, prefix:'S1W5' });

  // Level 4 (Spring 2)
  const s2w1 = setupWeek({ screenId:'spring2w1', weekKey:'L4W1', letters: S2W1_LETTERS, words: S2W1_WORDS, prefix:'S2W1' });
  const s2w2 = setupWeek({ screenId:'spring2w2', weekKey:'L4W2', letters: S2W2_LETTERS, words: S2W2_WORDS, prefix:'S2W2' });
  const s2w3 = setupWeek({ screenId:'spring2w3', weekKey:'L4W3', letters: S2W3_LETTERS, words: S2W3_WORDS, prefix:'S2W3' });
  const s2w4 = setupWeek({ screenId:'spring2w4', weekKey:'L4W4', letters: S2W4_LETTERS, words: S2W4_WORDS, prefix:'S2W4' });

  // Level 5 (Summer 1)
  const su1w1 = setupWeek({ screenId:'summer1w1', weekKey:'L5W1', letters: SU1W1_LETTERS, words: SU1W1_WORDS, prefix:'SU1W1' });
  const su1w2 = setupWeek({ screenId:'summer1w2', weekKey:'L5W2', letters: SU1W2_LETTERS, words: SU1W2_WORDS, prefix:'SU1W2' });
  const su1w3 = setupWeek({ screenId:'summer1w3', weekKey:'L5W3', letters: SU1W3_LETTERS, words: SU1W3_WORDS, prefix:'SU1W3' });
  const su1w4 = setupWeek({ screenId:'summer1w4', weekKey:'L5W4', letters: SU1W4_LETTERS, words: SU1W4_WORDS, prefix:'SU1W4' });

  // Level 6 (Summer 2)
  const su2w1 = setupWeek({ screenId:'summer2w1', weekKey:'L6W1', letters: SU2W1_LETTERS, words: SU2W1_WORDS, prefix:'SU2W1' });
  const su2w2 = setupWeek({ screenId:'summer2w2', weekKey:'L6W2', letters: SU2W2_LETTERS, words: SU2W2_WORDS, prefix:'SU2W2' });
  const su2w3 = setupWeek({ screenId:'summer2w3', weekKey:'L6W3', letters: SU2W3_LETTERS, words: SU2W3_WORDS, prefix:'SU2W3' });
  const su2w4 = setupWeek({ screenId:'summer2w4', weekKey:'L6W4', letters: SU2W4_LETTERS, words: SU2W4_WORDS, prefix:'SU2W4' });
  const su2w5 = setupWeek({ screenId:'summer2w5', weekKey:'L6W5', letters: SU2W5_LETTERS, words: SU2W5_WORDS, prefix:'SU2W5' });

  // ===== Celebration screen buttons =====
  safeOn('#celebrateHomeTop', 'click', ()=>show('home'));
  safeOn('#celebrateHome', 'click', ()=>show('home'));

  safeOn('#celebrateReplay', 'click', ()=>{
    if (ACTIVE_WEEK_KEY) {
      show('home');
      setTimeout(()=>goToWeekByKey(ACTIVE_WEEK_KEY), 0);
    } else {
      show('home');
    }
  });

  safeOn('#celebrateNext', 'click', ()=>{
    if(!ACTIVE_WEEK_KEY) return show('home');

    const idx = WEEK_ORDER.indexOf(ACTIVE_WEEK_KEY);
    const nextKey = (idx >= 0 && idx < WEEK_ORDER.length - 1) ? WEEK_ORDER[idx + 1] : null;

    show('home');
    if(nextKey){
      setTimeout(()=>{
        const ok = goToWeekByKey(nextKey);
        if(!ok) showToast("Next week is locked 🔒");
      }, 0);
    } else {
      showToast("You're at the last week 🎉");
    }
  });

  
  /* ========= 2) Home navigation handlers ========= */

  // Always unlocked
  safeOn('#btn-practise','click', () => {
    PRACTICE_KEY = null;
    PRACTICE_SEEN_LAST = false;
    startPractice(ALPHABET, null);
  });

  // Level 1 – Week 1 (phase1 set)
  safeOn('#btn-phase-1','click', () => {
    PRACTICE_KEY = 'L1W1';
    PRACTICE_SEEN_LAST = false;
    startPractice(PHASE_SETS.phase1, 'L1W1');
  });

  // Level 1
  safeOn('#btn-phase-2','click', () => { show('week2'); week2.initLetters(); });
  safeOn('#btn-phase-3','click', () => { show('week3'); week3.initLetters(); });
  safeOn('#btn-phase-4','click', () => { show('week4'); week4.initLetters(); });
  safeOn('#btn-phase-5','click', () => { show('week5'); week5.initLetters(); });

  // Level 2
  safeOn('#btn-phase-6','click',  () => { show('a2w1');      a2w1.initLetters(); });
  safeOn('#btn-phase-7','click',  () => { show('weekA2W2');  a2w2.initLetters(); });
  safeOn('#btn-phase-8','click',  () => { show('weekA2W3');  a2w3.initLetters(); });
  safeOn('#btn-phase-9','click',  () => { show('weekA2W4');  a2w4.initLetters(); });
  safeOn('#btn-phase-10','click', () => { show('weekA2W5');  a2w5.initLetters(); });

  // Level 3
  safeOn('#btn-s1w1','click', () => { show('spring1w1'); s1w1.initLetters(); });
  safeOn('#btn-s1w2','click', () => { show('spring1w2'); s1w2.initLetters(); });
  safeOn('#btn-s1w3','click', () => { show('spring1w3'); s1w3.initLetters(); });
  safeOn('#btn-s1w4','click', () => { show('spring1w4'); s1w4.initLetters(); });
  safeOn('#btn-s1w5','click', () => { show('spring1w5'); s1w5.initLetters(); });

  // Level 4
  safeOn('#btn-s2w1','click', () => { show('spring2w1'); s2w1.initLetters(); });
  safeOn('#btn-s2w2','click', () => { show('spring2w2'); s2w2.initLetters(); });
  safeOn('#btn-s2w3','click', () => { show('spring2w3'); s2w3.initLetters(); });
  safeOn('#btn-s2w4','click', () => { show('spring2w4'); s2w4.initLetters(); });

  // Level 5
  safeOn('#btn-su1w1','click', () => { show('summer1w1'); su1w1.initLetters(); });
  safeOn('#btn-su1w2','click', () => { show('summer1w2'); su1w2.initLetters(); });
  safeOn('#btn-su1w3','click', () => { show('summer1w3'); su1w3.initLetters(); });
  safeOn('#btn-su1w4','click', () => { show('summer1w4'); su1w4.initLetters(); });

  // Level 6
  safeOn('#btn-su2w1','click', () => { show('summer2w1'); su2w1.initLetters(); });
  safeOn('#btn-su2w2','click', () => { show('summer2w2'); su2w2.initLetters(); });
  safeOn('#btn-su2w3','click', () => { show('summer2w3'); su2w3.initLetters(); });
  safeOn('#btn-su2w4','click', () => { show('summer2w4'); su2w4.initLetters(); });
  safeOn('#btn-su2w5','click', () => { show('summer2w5'); su2w5.initLetters(); });

  /* ========= 3) Back buttons ========= */
  [
    '#backLetters','#backWeek2','#backWeek3','#backWeek4','#backWeek5',
    '#backA2','#backA2W2','#backA2W3','#backA2W4','#backA2W5',
    '#backS1W1','#backS1W2','#backS1W3','#backS1W4','#backS1W5',
    '#backS2W1','#backS2W2','#backS2W3','#backS2W4',
    '#backSU1W1','#backSU1W2','#backSU1W3','#backSU1W4',
    '#backSU2W1','#backSU2W2','#backSU2W3','#backSU2W4','#backSU2W5'
  ].forEach(sel => safeOn(sel, 'click', () => show('home')));

  /* ========= 4) Settings navigation + controls ========= */
  safeOn('#openSettings', 'click', () => show('settings'));
  safeOn('#backSettings', 'click', () => show('home'));

  const parentMode   = qs('#parentMode');
  const unlockAllBtn = qs('#unlockAllBtn');
  const resetBtn     = qs('#resetProgressBtn');

  const p0 = getProgress();
  if (parentMode) parentMode.checked = !!p0.parentMode;

  safeOn(parentMode, 'change', () => {
    const p = getProgress();
    p.parentMode = !!parentMode.checked;
    setProgress(p);
    showToast(p.parentMode ? "Parent mode on" : "Parent mode off");
  });

  safeOn(unlockAllBtn, 'click', () => {
    const p = getProgress();
    p.unlockAll = true;
    setProgress(p);
    updateHomeLocks();
    showToast("All levels unlocked");
  });

  safeOn(resetBtn, 'click', () => {
    const ok = confirm("Reset progress? This will remove all stars and locks will return.");
    if (!ok) return;
    const keepParent = getProgress().parentMode;
    setProgress({ completed: [], unlockAll: false, parentMode: keepParent });
    updateHomeLocks();
    showToast("Progress reset");
  });

 /* ========= Splash (show every app open) ========= */
  const splash = document.getElementById('splashOverlay');
  if (splash){
    splash.classList.add('is-visible');
    setTimeout(() => {
      splash.classList.add('is-hiding');
      setTimeout(() => splash.remove(), 650);
    }, 3000);
  }
 
      
/* ========= Term navigation (Home -> Term screens) ========= */
document.querySelectorAll('[data-open-term]').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-open-term');
    if (target) show(target);
  });
});

/* ========= Back buttons (Term screens -> Home) ========= */
document.querySelectorAll('[data-back-home]').forEach(btn => {
  btn.addEventListener('click', () => show('home'));
});

/* ========= Proxy buttons (Home shortcuts click real week buttons) ========= */
document.querySelectorAll('.proxy-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const sel = btn.getAttribute('data-proxy');
    const real = sel ? document.querySelector(sel) : null;
    if (real) real.click();
  });
});

  
  /* ========= 5) Start app ========= */
  
  show('home');
  updateHomeLocks();
});



























