// Phonics Fun — app.js (updated)

/* ---------- helpers ---------- */
const qs = (sel, root=document) => root.querySelector(sel);
const qsAll = (sel, root=document) => Array.from(root.querySelectorAll(sel));

function safeOn(target, event, handler){
  const el = (typeof target === 'string') ? qs(target) : target;
  if (!el) return;
  el.addEventListener(event, handler);
}

/* ---------- localStorage keys ---------- */
const LS_PROGRESS = 'phonics_progress_v1';   // completed weeks
const LS_LAST = 'phonics_last_screen_v1';    // last screen id
const LS_CHILD_MODE = 'phonics_child_mode_v1'; // settings toggle

/* ---------- state ---------- */
let progress = loadProgress(); // Set of week ids (e.g. "lvl1w1")

/* ---------- boot ---------- */
document.addEventListener('DOMContentLoaded', () => {
  // Default screen
  show('home');
  updateHomeLocks();

  // Settings button (⚙️)
  const openSettings = qs('#openSettings');
  safeOn(openSettings, 'click', () => show('settings'));

  // Back from settings
  safeOn('#backSettings', 'click', () => show('home'));

  // Reset progress
  safeOn('#resetProgress', 'click', () => {
    if (!confirm('Reset progress? This will lock later weeks again.')) return;
    progress = new Set();
    saveProgress(progress);
    toast('Progress reset ✅');
    updateHomeLocks();
  });

  // Child mode toggle
  const childToggle = qs('#childModeToggle');
  if (childToggle) {
    childToggle.checked = loadChildMode();
    applyChildMode(childToggle.checked);
    safeOn(childToggle, 'change', () => {
      setChildMode(childToggle.checked);
      applyChildMode(childToggle.checked);
      toast(childToggle.checked ? 'Child Mode ON 👶' : 'Child Mode OFF');
    });
  }

  // Continue button
  safeOn('#continueBtn', 'click', () => {
    const last = localStorage.getItem(LS_LAST) || 'home';
    show(last);
  });

  // Practise single letter sounds (always unlocked)
  safeOn('#btn-practise', 'click', () => {
    setLast('letters');
    show('letters');
  });

  // Home week buttons (Level 1 style)
  // IMPORTANT: these ids must match your HTML button ids
  // Example mapping below — adjust if your ids differ.
  const weekMap = [
    { btn:'#btn-lvl1w1', screen:'week2',  key:'lvl1w1' }, // Level 1 - Week 1
    { btn:'#btn-lvl1w2', screen:'week3',  key:'lvl1w2' },
    { btn:'#btn-lvl1w3', screen:'week4',  key:'lvl1w3' },
    { btn:'#btn-lvl1w4', screen:'week5',  key:'lvl1w4' },

    // Add the rest of your mapping here
    // { btn:'#btn-lvl2w1', screen:'a2w1', key:'lvl2w1' },
  ];

  weekMap.forEach(({btn, screen, key}) => {
    safeOn(btn, 'click', () => {
      if (isLocked(key)) return; // locked = do nothing
      setLast(screen);
      show(screen);
    });
  });

  /* ---------- letter practice ---------- */
  initSimpleSequence({
    screenId: 'letters',
    backBtn: '#backLetters',
    backTarget: 'home',
    areaId: '#letterArea',
    bigId: '#bigLetter',
    prevBtn: '#prevBtn',
    nextBtn: '#nextBtn',
    items: 'abcdefghijklmnopqrstuvwxyz'.toUpperCase().split(''),
    onFinish: null
  });

  /* ---------- week sequences (examples already in your HTML) ---------- */
  // Each week has:
  // - letters area (bigLetter)
  // - blending word area (bigWord)
  // We mark week complete when user reaches the last sound/word at least once.

  // Autumn 1 – Week 2 (example)
  initTabbedWeek({
    weekKey: 'lvl1w1',
    screenId: 'week2',
    backBtn: '#backWeek2',
    backTarget: 'home',

    // tabs
    tabLetters: '#tabLettersW2',
    tabBlend: '#tabBlendW2',
    paneLetters: '#paneLettersW2',
    paneBlend: '#paneBlendW2',

    // letters
    lettersArea: '#letterAreaW2',
    lettersBig: '#bigLetterW2',
    lettersPrev: '#prevBtnW2',
    lettersNext: '#nextBtnW2',
    letters: ['i','n','m','d'].map(x => x.toUpperCase()),

    // words
    wordsArea: '#blendSeqAreaW2',
    wordsBig: '#bigWordW2',
    wordsPrev: '#prevWordBtnW2',
    wordsNext: '#nextWordBtnW2',
    words: ['sit','pin','man','dip']
  });

  // Autumn 1 – Week 3
  initTabbedWeek({
    weekKey: 'lvl1w2',
    screenId: 'week3',
    backBtn: '#backWeek3',
    backTarget: 'home',

    tabLetters: '#tabLettersW3',
    tabBlend: '#tabBlendW3',
    paneLetters: '#paneLettersW3',
    paneBlend: '#paneBlendW3',

    lettersArea: '#letterAreaW3',
    lettersBig: '#bigLetterW3',
    lettersPrev: '#prevBtnW3',
    lettersNext: '#nextBtnW3',
    letters: ['g','o','c','k'].map(x => x.toUpperCase()),

    wordsArea: '#blendSeqAreaW3',
    wordsBig: '#bigWordW3',
    wordsPrev: '#prevWordBtnW3',
    wordsNext: '#nextWordBtnW3',
    words: ['man','can','dog','cat']
  });

  // Autumn 1 – Week 4
  initTabbedWeek({
    weekKey: 'lvl1w3',
    screenId: 'week4',
    backBtn: '#backWeek4',
    backTarget: 'home',

    tabLetters: '#tabLettersW4',
    tabBlend: '#tabBlendW4',
    paneLetters: '#paneLettersW4',
    paneBlend: '#paneBlendW4',

    lettersArea: '#letterAreaW4',
    lettersBig: '#bigLetterW4',
    lettersPrev: '#prevBtnW4',
    lettersNext: '#nextBtnW4',
    letters: ['ck','e','u','r'].map(x => x.toUpperCase()),

    wordsArea: '#blendSeqAreaW4',
    wordsBig: '#bigWordW4',
    wordsPrev: '#prevWordBtnW4',
    wordsNext: '#nextWordBtnW4',
    words: ['mum','rug','duck','sock']
  });

  // Autumn 1 – Week 5
  initTabbedWeek({
    weekKey: 'lvl1w4',
    screenId: 'week5',
    backBtn: '#backWeek5',
    backTarget: 'home',

    tabLetters: '#tabLettersW5',
    tabBlend: '#tabBlendW5',
    paneLetters: '#paneLettersW5',
    paneBlend: '#paneBlendW5',

    lettersArea: '#letterAreaW5',
    lettersBig: '#bigLetterW5',
    lettersPrev: '#prevBtnW5',
    lettersNext: '#nextBtnW5',
    letters: ['h','b','f','l'].map(x => x.toUpperCase()),

    wordsArea: '#blendSeqAreaW5',
    wordsBig: '#bigWordW5',
    wordsPrev: '#prevWordBtnW5',
    wordsNext: '#nextWordBtnW5',
    words: ['hug','bag','fun','lip']
  });

  // Add the rest of your weeks the same way (A2, Spring, Summer etc.)
});

/* ---------- navigation / screens ---------- */
function show(name){
  // Hide all screens first
  document.querySelectorAll('.screen').forEach(el => { el.style.display = 'none'; });

  const target = qs('#' + name);
  if (!target) return;

  target.style.display = (name === 'home') ? 'flex' : 'block';

  if (name === 'home') updateHomeLocks();
}

function setLast(screenId){
  localStorage.setItem(LS_LAST, screenId);
}

/* ---------- progress / locking ---------- */
function loadProgress(){
  try{
    const raw = localStorage.getItem(LS_PROGRESS);
    const arr = raw ? JSON.parse(raw) : [];
    return new Set(arr);
  }catch{
    return new Set();
  }
}
function saveProgress(set){
  localStorage.setItem(LS_PROGRESS, JSON.stringify(Array.from(set)));
}

function markDone(weekKey){
  if (!weekKey) return;
  if (!progress.has(weekKey)){
    progress.add(weekKey);
    saveProgress(progress);
    updateHomeLocks();
    toast('Week completed ⭐');
  }
}

function isLocked(weekKey){
  // Week 1 is never locked
  if (weekKey === 'lvl1w1') return false;

  // Lock rule: you must complete the immediately previous week.
  // Example: lvl1w2 requires lvl1w1 done, etc.
  const order = ['lvl1w1','lvl1w2','lvl1w3','lvl1w4']; // extend this list for all weeks
  const idx = order.indexOf(weekKey);
  if (idx <= 0) return false;

  const prev = order[idx-1];
  return !progress.has(prev);
}

function updateHomeLocks(){
  // Buttons should use data-week="lvl1w1" etc in HTML
  // and have class="pill"
  const buttons = qsAll('.pill[data-week]');
  buttons.forEach(btn => {
    const key = btn.getAttribute('data-week');

    if (!key) return;

    // Special: practise button always unlocked
    if (key === 'practice') {
      btn.dataset.status = 'open';
      btn.removeAttribute('aria-disabled');
      return;
    }

    if (progress.has(key)){
      btn.dataset.status = 'done';
      btn.removeAttribute('aria-disabled');
    } else if (isLocked(key)){
      btn.dataset.status = 'locked';
      btn.setAttribute('aria-disabled','true');
    } else {
      btn.dataset.status = 'open';
      btn.removeAttribute('aria-disabled');
    }
  });
}

/* ---------- sequences ---------- */
function initSimpleSequence({screenId, backBtn, backTarget, areaId, bigId, prevBtn, nextBtn, items, onFinish}){
  const big = qs(bigId);
  const area = qs(areaId);
  let i = 0;

  const render = () => { if (big) big.textContent = items[i]; };
  const next = () => { i = (i + 1) % items.length; render(); if (i === items.length - 1 && onFinish) onFinish(); };
  const prev = () => { i = (i - 1 + items.length) % items.length; render(); };

  safeOn(prevBtn, 'click', prev);
  safeOn(nextBtn, 'click', next);
  safeOn(area, 'click', next);

  // basic swipe
  if (area){
    let startX = 0;
    area.addEventListener('touchstart', e => startX = e.touches[0].clientX, {passive:true});
    area.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) (dx < 0 ? next() : prev());
    }, {passive:true});
  }

  safeOn(backBtn, 'click', () => { setLast(backTarget); show(backTarget); });

  render();
}

function initTabbedWeek(cfg){
  // back
  safeOn(cfg.backBtn, 'click', () => { setLast(cfg.backTarget); show(cfg.backTarget); });

  // tabs
  const tabLetters = qs(cfg.tabLetters);
  const tabBlend = qs(cfg.tabBlend);
  const paneLetters = qs(cfg.paneLetters);
  const paneBlend = qs(cfg.paneBlend);

  const setTab = (which) => {
    if (!tabLetters || !tabBlend || !paneLetters || !paneBlend) return;
    const lettersActive = which === 'letters';
    tabLetters.classList.toggle('active', lettersActive);
    tabBlend.classList.toggle('active', !lettersActive);
    paneLetters.classList.toggle('active', lettersActive);
    paneBlend.classList.toggle('active', !lettersActive);
  };

  safeOn(tabLetters, 'click', () => setTab('letters'));
  safeOn(tabBlend, 'click', () => setTab('blend'));

  // letters sequence (mark complete when user hits last item at least once)
  let li = 0;
  const lettersBig = qs(cfg.lettersBig);
  const lettersArea = qs(cfg.lettersArea);

  const renderLetters = () => { if (lettersBig) lettersBig.textContent = cfg.letters[li]; };
  const nextL = () => {
    li = (li + 1) % cfg.letters.length;
    renderLetters();
    if (li === cfg.letters.length - 1) markDone(cfg.weekKey);
  };
  const prevL = () => { li = (li - 1 + cfg.letters.length) % cfg.letters.length; renderLetters(); };

  safeOn(cfg.lettersPrev, 'click', prevL);
  safeOn(cfg.lettersNext, 'click', nextL);
  safeOn(lettersArea, 'click', nextL);

  if (lettersArea){
    let sx = 0;
    lettersArea.addEventListener('touchstart', e => sx = e.touches[0].clientX, {passive:true});
    lettersArea.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 40) (dx < 0 ? nextL() : prevL());
    }, {passive:true});
  }

  // words sequence (also counts towards completion)
  let wi = 0;
  const wordsBig = qs(cfg.wordsBig);
  const wordsArea = qs(cfg.wordsArea);

  const renderWords = () => { if (wordsBig) wordsBig.textContent = cfg.words[wi]; };
  const nextW = () => {
    wi = (wi + 1) % cfg.words.length;
    renderWords();
    if (wi === cfg.words.length - 1) markDone(cfg.weekKey);
  };
  const prevW = () => { wi = (wi - 1 + cfg.words.length) % cfg.words.length; renderWords(); };

  safeOn(cfg.wordsPrev, 'click', prevW);
  safeOn(cfg.wordsNext, 'click', nextW);
  safeOn(wordsArea, 'click', nextW);

  if (wordsArea){
    let sx2 = 0;
    wordsArea.addEventListener('touchstart', e => sx2 = e.touches[0].clientX, {passive:true});
    wordsArea.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - sx2;
      if (Math.abs(dx) > 40) (dx < 0 ? nextW() : prevW());
    }, {passive:true});
  }

  // initial
  setTab('letters');
  renderLetters();
  renderWords();
}

/* ---------- child mode ---------- */
function loadChildMode(){
  return localStorage.getItem(LS_CHILD_MODE) === '1';
}
function setChildMode(v){
  localStorage.setItem(LS_CHILD_MODE, v ? '1' : '0');
}
function applyChildMode(isChild){
  document.body.classList.toggle('child-mode', isChild);
}

/* ---------- toast ---------- */
let toastTimer = null;
function toast(msg){
  const el = qs('#toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.remove('hidden');

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.add('hidden'), 2200);
}
