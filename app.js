/* =========================
   Phonics App (Complete)
   ========================= */

/**
 * AUDIO SETUP
 * Put your audio files in: /audio/
 * Naming convention used here:
 *   - sounds: /audio/sound_<token>.mp3   (e.g., sound_ai.mp3)
 *   - words:  /audio/word_<token>.mp3    (e.g., word_chair.mp3)
 *
 * If you don't have audio for something yet, it will still work (shows a toast).
 */

// ---------- DATA (edit this to match your curriculum) ----------
const CURRICULUM = {
  "Spring 2": {
    1: {
      sounds: ["", "", ""], // <-- replace with your actual Spring2 Week1 sounds
      words: [""] // <-- replace with your actual Spring2 Week1 words
    },
    2: {
      sounds: ["air", "er", "dd", "mm", "tt", "bb", "rr", "gg", "pp", "ff"],
      words: ["bigger", "chair", "fair", "rubber", "shimmer", "butter", "supper", "chatter", "muffin", "mutter", "buzzer", "cannot", "laptop", "seven", "fantastic", "comic"]
    },
    3: {
      sounds: ["ai", "ee", "ur", "ow", "igh", "oa", "oi", "ear", "oo", "oo", "air", "er", "ar", "or"],
      words: ["sharp", "shark", "sheep", "cheep", "queen", "tooth", "short", "thinker", "powder", "church", "corner", "farmer", "torch", "chain", "shower", "march"]
    },
    4: {
      sounds: ["ai", "ee", "ur", "ow", "igh", "oa", "oi", "ear", "oo", "oo", "air", "er", "ar", "or"],
      words: ["lightning", "mammoth", "earring", "poison", "queens", "chains", "chairs", "cars", "boots", "surfs", "cooks", "cheeps", "torches", "boxes", "fizzes", "fishes"]
    }
  }
};

// ---------- STORAGE KEYS ----------
const STORAGE_KEY = "phonics_app_state_v2";

// ---------- DEFAULT STATE ----------
const defaultState = () => ({
  mode: "child", // "child" | "parent"
  term: Object.keys(CURRICULUM)[0] || "Spring 2",
  week: 1,
  // completion: { "<term>|<week>": { soundsPlayed: [], wordsPlayed: [] } }
  completion: {},
  // unlocks: { "<term>": <highestUnlockedWeekNumber> }
  unlocks: {}
});

let state = loadState();

// ---------- DOM ----------
const termSelect = document.getElementById("termSelect");
const weeksEl = document.getElementById("weeks");
const continueBtn = document.getElementById("continueBtn");
const modeToggle = document.getElementById("modeToggle");
const modePill = document.getElementById("modePill");
const weekTitle = document.getElementById("weekTitle");
const soundsGrid = document.getElementById("soundsGrid");
const wordsGrid = document.getElementById("wordsGrid");
const statusLine = document.getElementById("statusLine");

const rewardModal = document.getElementById("rewardModal");
const modalBackdrop = document.getElementById("modalBackdrop");
const modalClose = document.getElementById("modalClose");
const modalEmoji = document.getElementById("modalEmoji");
const modalTitle = document.getElementById("modalTitle");
const modalText = document.getElementById("modalText");

const toast = document.getElementById("toast");

// ---------- INIT ----------
bootstrap();

// ---------- FUNCTIONS ----------
function bootstrap() {
  ensureUnlocks();
  mountTerms();
  wireEvents();

  // If stored week not present in term, fallback
  if (!CURRICULUM[state.term]) {
    state.term = Object.keys(CURRICULUM)[0];
    state.week = 1;
    saveState();
  }
  if (!CURRICULUM[state.term][state.week]) {
    state.week = getFirstWeek(state.term);
    saveState();
  }

  renderAll();
}

function wireEvents() {
  continueBtn.addEventListener("click", () => {
    loadWeek(state.term, state.week);
  });

  modeToggle.addEventListener("click", () => {
    state.mode = state.mode === "child" ? "parent" : "child";
    saveState();
    renderAll();
  });

  termSelect.addEventListener("change", (e) => {
    state.term = e.target.value;
    // In child mode, keep them on current progress week (or first unlocked)
    const maxUnlocked = getMaxUnlocked(state.term);
    state.week = Math.min(state.week, maxUnlocked);
    if (!CURRICULUM[state.term][state.week]) state.week = getFirstWeek(state.term);
    saveState();
    renderAll();
  });

  modalBackdrop.addEventListener("click", closeModal);
  modalClose.addEventListener("click", closeModal);
}

function mountTerms() {
  termSelect.innerHTML = "";
  Object.keys(CURRICULUM).forEach((term) => {
    const opt = document.createElement("option");
    opt.value = term;
    opt.textContent = term;
    termSelect.appendChild(opt);
  });
}

function renderAll() {
  termSelect.value = state.term;

  modePill.textContent = state.mode === "child" ? "👶 Child Mode" : "👨‍👩‍👦 Parent Mode";
  modeToggle.textContent = state.mode === "child" ? "👨‍👩‍👦 Parent Mode" : "👶 Child Mode";

  renderWeeks();
  renderWeekContent();
  renderStatus();
}

function renderStatus() {
  const maxUnlocked = getMaxUnlocked(state.term);
  statusLine.textContent = `${state.term} • Week ${state.week} • Unlocked: Week 1–${maxUnlocked}`;
}

function renderWeeks() {
  weeksEl.innerHTML = "";

  const termData = CURRICULUM[state.term];
  const allWeeks = Object.keys(termData).map(Number).sort((a,b)=>a-b);
  const maxUnlocked = getMaxUnlocked(state.term);

  allWeeks.forEach((wk) => {
    const btn = document.createElement("button");
    btn.className = "btn week-btn";
    const isUnlocked = wk <= maxUnlocked;
    const isCurrent = wk === state.week;

    if (!isUnlocked) {
      btn.classList.add("locked");
      btn.disabled = true;
      btn.textContent = `🔒 Week ${wk}`;
    } else {
      btn.textContent = `Week ${wk}`;
      btn.addEventListener("click", () => loadWeek(state.term, wk));
    }

    if (isCurrent) btn.classList.add("current");

    // Progressive disclosure: Child mode shows only current week button
    if (state.mode === "child" && wk !== state.week) {
      btn.style.display = "none";
    }

    weeksEl.appendChild(btn);
  });
}

function renderWeekContent() {
  const weekData = CURRICULUM[state.term][state.week];
  weekTitle.textContent = `${state.term} — Week ${state.week}`;

  const key = weekKey(state.term, state.week);
  if (!state.completion[key]) {
    state.completion[key] = { soundsPlayed: [], wordsPlayed: [] };
    saveState();
  }

  // Make big buttons in child mode (less clutter)
  document.body.classList.toggle("child-mode", state.mode === "child");

  soundsGrid.innerHTML = "";
  wordsGrid.innerHTML = "";

  const playedSounds = new Set(state.completion[key].soundsPlayed);
  const playedWords = new Set(state.completion[key].wordsPlayed);

  // SOUNDS
  (weekData.sounds || []).filter(Boolean).forEach((s) => {
    const btn = document.createElement("button");
    btn.className = "btn sound-btn";
    btn.textContent = s;
    if (playedSounds.has(s)) btn.classList.add("done");

    btn.addEventListener("click", async () => {
      await playAudioWithFeedback(btn, audioPathForSound(s));
      markPlayed("sound", s);
      btn.classList.add("done");
      maybeWeekComplete();
      maybeSetComplete(); // sounds+words set complete
    });

    soundsGrid.appendChild(btn);
  });

  // WORDS
  (weekData.words || []).filter(Boolean).forEach((w) => {
    const btn = document.createElement("button");
    btn.className = "btn word-btn";
    btn.textContent = w;

    btn.addEventListener("click", async () => {
      await playAudioWithFeedback(btn, audioPathForWord(w));
      markPlayed("word", w);
      maybeWeekComplete();
      maybeSetComplete();
    });

    wordsGrid.appendChild(btn);
  });
}

function loadWeek(term, week) {
  const maxUnlocked = getMaxUnlocked(term);
  if (week > maxUnlocked && state.mode !== "parent") {
    // child mode can't jump ahead
    return;
  }
  state.term = term;
  state.week = week;
  saveState();
  renderAll();
}

function markPlayed(type, token) {
  const key = weekKey(state.term, state.week);
  const completion = state.completion[key] || { soundsPlayed: [], wordsPlayed: [] };

  if (type === "sound") {
    if (!completion.soundsPlayed.includes(token)) completion.soundsPlayed.push(token);
  } else {
    if (!completion.wordsPlayed.includes(token)) completion.wordsPlayed.push(token);
  }

  state.completion[key] = completion;
  saveState();
}

/**
 * ⭐ Week complete:
 * Trigger when ALL sounds are played at least once (simple definition of "week complete").
 * Then unlock next week.
 */
function maybeWeekComplete() {
  const weekData = CURRICULUM[state.term][state.week];
  const key = weekKey(state.term, state.week);
  const completion = state.completion[key];

  const sounds = (weekData.sounds || []).filter(Boolean);
  if (sounds.length === 0) return;

  const played = new Set(completion.soundsPlayed);
  const allPlayed = sounds.every((s) => played.has(s));

  const weekCompleteFlag = `${key}|weekComplete`;
  if (allPlayed && !state.completion[weekCompleteFlag]) {
    state.completion[weekCompleteFlag] = true;
    saveState();

    showReward({
      emoji: "⭐",
      title: "Week complete!",
      text: `Nice work — you completed Week ${state.week}.`
    });

    unlockNextWeek();
    renderAll();
  }
}

/**
 * 🎉 Set complete:
 * Trigger when ALL sounds + ALL words are played at least once.
 */
function maybeSetComplete() {
  const weekData = CURRICULUM[state.term][state.week];
  const key = weekKey(state.term, state.week);
  const completion = state.completion[key];

  const sounds = (weekData.sounds || []).filter(Boolean);
  const words = (weekData.words || []).filter(Boolean);
  if (sounds.length === 0 && words.length === 0) return;

  const playedSounds = new Set(completion.soundsPlayed);
  const playedWords = new Set(completion.wordsPlayed);

  const allSoundsPlayed = sounds.every((s) => playedSounds.has(s));
  const allWordsPlayed = words.every((w) => playedWords.has(w));

  const setCompleteFlag = `${key}|setComplete`;
  if (allSoundsPlayed && allWordsPlayed && !state.completion[setCompleteFlag]) {
    state.completion[setCompleteFlag] = true;
    saveState();

    // Confetti
    try {
      if (typeof confetti === "function") {
        confetti({ particleCount: 140, spread: 70, origin: { y: 0.65 } });
      }
    } catch (_) {}

    showReward({
      emoji: "🎉",
      title: "Set complete!",
      text: "You finished all sounds and words in this set!"
    });
  }
}

function unlockNextWeek() {
  const termWeeks = Object.keys(CURRICULUM[state.term]).map(Number).sort((a,b)=>a-b);
  const maxUnlocked = getMaxUnlocked(state.term);
  const currentIndex = termWeeks.indexOf(state.week);
  if (currentIndex === -1) return;

  const nextWeek = termWeeks[currentIndex + 1];
  if (!nextWeek) return; // last week

  // If next is locked, unlock it
  if (nextWeek > maxUnlocked) {
    state.unlocks[state.term] = nextWeek;
    saveState();
  }
}

function ensureUnlocks() {
  // Initialize unlocks: default unlock week 1 for each term
  const terms = Object.keys(CURRICULUM);
  terms.forEach((t) => {
    if (!state.unlocks[t]) {
      state.unlocks[t] = getFirstWeek(t);
    }
  });

  // Ensure current term unlock exists
  if (!state.unlocks[state.term]) state.unlocks[state.term] = getFirstWeek(state.term);

  saveState();
}

function getFirstWeek(term) {
  const weeks = Object.keys(CURRICULUM[term] || {}).map(Number).sort((a,b)=>a-b);
  return weeks[0] || 1;
}

function getMaxUnlocked(term) {
  return state.unlocks[term] || getFirstWeek(term);
}

function weekKey(term, week) {
  return `${term}|${week}`;
}

// ---------- AUDIO ----------
function audioPathForSound(token) {
  return `audio/sound_${sanitizeToken(token)}.mp3`;
}

function audioPathForWord(token) {
  return `audio/word_${sanitizeToken(token)}.mp3`;
}

function sanitizeToken(token) {
  return String(token)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "");
}

async function playAudioWithFeedback(buttonEl, src) {
  buttonEl.classList.add("playing");

  try {
    const audio = new Audio(src);
    const playPromise = audio.play();

    if (playPromise && typeof playPromise.then === "function") {
      await playPromise;
    }

    // Remove "playing" when finished
    await new Promise((resolve) => {
      audio.onended = resolve;
      audio.onerror = () => resolve(); // treat as complete
    });

    // If error likely due to missing file
    if (audio.error) {
      showToast(`No audio found: ${src}`);
    }
  } catch (e) {
    showToast(`Audio couldn’t play: ${src}`);
  } finally {
    // ensure pop/glow ends even if audio fails
    setTimeout(() => buttonEl.classList.remove("playing"), 50);
  }
}

// ---------- MODAL / TOAST ----------
function showReward({ emoji, title, text }) {
  modalEmoji.textContent = emoji;
  modalTitle.textContent = title;
  modalText.textContent = text;
  rewardModal.classList.remove("hidden");
}

function closeModal() {
  rewardModal.classList.add("hidden");
}

let toastTimer = null;
function showToast(message) {
  toast.textContent = message;
  toast.classList.remove("hidden");
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.add("hidden"), 2200);
}

// ---------- STORAGE ----------
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    return { ...defaultState(), ...parsed };
  } catch {
    return defaultState();
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}
