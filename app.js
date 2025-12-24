// app.js
/* global MOVIES */

const els = {
  watchBtn: document.getElementById("watchBtn"),
  countdown: document.getElementById("countdown"),
  showtime: document.getElementById("showtime"),
  ticket: document.getElementById("ticket"),
  title: document.getElementById("movieTitle"),
  director: document.getElementById("movieDirector"),
  runtime: document.getElementById("movieRuntime"),
  genre: document.getElementById("movieGenre"),
  description: document.getElementById("movieDescription"),
  remaining: document.getElementById("remainingCount"),
  serial: document.getElementById("ticketSerial"),
  exhausted: document.getElementById("exhausted"),
  resetBtn: document.getElementById("resetBtn"),
};

const STORAGE_KEY = "cinema_unwatched_indices_v1";

function loadUnwatchedIndices() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return null;
    // sanity: only keep valid indices
    const valid = arr.filter((n) => Number.isInteger(n) && n >= 0 && n < MOVIES.length);
    return valid.length ? valid : null;
  } catch {
    return null;
  }
}

function saveUnwatchedIndices(indices) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(indices));
}

function resetUnwatched() {
  const indices = Array.from({ length: MOVIES.length }, (_, i) => i);
  saveUnwatchedIndices(indices);
  return indices;
}

let unwatched = loadUnwatchedIndices() ?? resetUnwatched();

function updateRemainingUI() {
  els.remaining.textContent = `${unwatched.length} remaining`;
}

function setHidden(el, hidden) {
  el.classList.toggle("hidden", hidden);
}

function pickRandomMovieNoRepeat() {
  if (unwatched.length === 0) return null;

  const r = Math.floor(Math.random() * unwatched.length);
  const pickedIndex = unwatched[r];

  // remove from unwatched
  unwatched.splice(r, 1);
  saveUnwatchedIndices(unwatched);

  return MOVIES[pickedIndex];
}

function randomSerial(len = 6) {
  let s = "";
  for (let i = 0; i < len; i += 1) s += Math.floor(Math.random() * 10);
  return s;
}

function getDescription(movie) {
  const genre = (movie.genre || '').toLowerCase();
  const map = {
    action: 'An adrenaline-fueled ride with big set pieces and brisk pacing — perfect when you want excitement.',
    crime: 'A gritty, character-driven crime story with tense stakes and moral complexity.',
    'sci-fi': 'A visually rich sci‑fi voyage with big ideas and atmospheric world-building.',
    horror: 'A tense, atmospheric horror experience—expect creeping dread and memorable scares.',
    comedy: 'A witty, upbeat comedy to lift your spirits and spark laughter.',
    drama: 'A thoughtful drama rooted in strong performances and emotional beats.',
    thriller: 'A taut thriller that keeps you on the edge of your seat with twists and suspense.',
    fantasy: 'A magical, immersive fantasy full of wonder and epic scope.',
    animation: 'A beautifully crafted animated tale—playful, heartfelt, and imaginative.',
    romance: 'A tender romance with warm moments and emotional resonance.',
    war: 'A powerful, cinematic war drama—intense and evocative.',
    western: 'A classic western vibe—wide landscapes and bold showdowns.',
    mystery: 'A slow-burn mystery about secrets, revelations, and unexpected turns.'
  };

  const base = map[genre] || 'An engaging, well-crafted film that matches the mood you’re after.';
  return base;
}

function renderMovie(movie) {
  els.title.textContent = movie.title;
  els.director.textContent = movie.director;
  els.runtime.textContent = `${movie.runtime} min`;
  els.genre.textContent = movie.genre;
  if (els.serial) els.serial.textContent = randomSerial(6);

  if (els.description) {
    // Prefer movie-specific copy if present
    if (movie.vibe || movie.blurb || movie.goodFor) {
      els.description.innerHTML = `
        <div class="ticket-vibe">${movie.vibe ? movie.vibe : ''}</div>
        <p class="desc-text tagline">${movie.blurb ? movie.blurb : getDescription(movie)}</p>
        <div class="desc-goodfor">Good for: ${movie.goodFor ? movie.goodFor : ''}</div>
      `;
    } else {
      els.description.textContent = getDescription(movie);
    }
  }

  updateRemainingUI();
}

function setBoothCTA(text) {
  // booth button contains multiple decorative spans; only update the CTA text
  const cta = els.watchBtn.querySelector(".booth-cta");
  if (cta) cta.textContent = text;
}

function disableButton(disabled) {
  els.watchBtn.disabled = disabled;
}

function showExhausted() {
  setHidden(els.ticket, true);
  setHidden(els.exhausted, false);
  disableButton(false);
  setBoothCTA("Time to Watch…");
  if (els.description) els.description.textContent = "You've seen the whole list — hit Reset & Shuffle to play again.";
}

function hideExhausted() {
  setHidden(els.exhausted, true);
}

function startCountdownThenShowTicket() {
  hideExhausted();
  setHidden(els.ticket, true);
  setHidden(els.showtime, true);

  disableButton(true);
  setHidden(els.watchBtn, true);

  let n = 10;
  els.countdown.textContent = String(n);
  setHidden(els.countdown, false);

  const tick = () => {
    n -= 1;
    if (n > 0) {
      els.countdown.textContent = String(n);
      return;
    }

    // finished countdown
    clearInterval(timer);
    setHidden(els.countdown, true);

    // SHOWTIME flash
    setHidden(els.showtime, false);

    setTimeout(() => {
      setHidden(els.showtime, true);

      const movie = pickRandomMovieNoRepeat();
      if (!movie) {
        showExhausted();
        return;
      }

      renderMovie(movie);
      setHidden(els.ticket, false);
      // Keep the booth hidden while showing the ticket. Click the ticket to pick again.
// if that was the last movie, show exhausted panel after showing ticket
      if (unwatched.length === 0) {
        // keep ticket visible, but also allow a reset prompt below
        setHidden(els.exhausted, false);
      }
    }, 900);
  };

  const timer = setInterval(tick, 1000);
}

function init() {
  updateRemainingUI();
  // If list already exhausted from a previous session, show reset UI.
  if (unwatched.length === 0) {
    showExhausted();
  } else {
    if (els.description) els.description.textContent = "Tap the ticket to reveal tonight's pick and vibe.";
  }

  els.watchBtn.addEventListener("click", () => {
    if (unwatched.length === 0) {
      showExhausted();
      return;
    }
    startCountdownThenShowTicket();
  });

  

  // Click the ticket itself to pick again (keeps the booth hidden once a movie is showing)
  els.ticket.addEventListener("click", () => {
    if (unwatched.length === 0) { showExhausted(); return; }
    startCountdownThenShowTicket();
  });
els.resetBtn.addEventListener("click", () => {
    unwatched = resetUnwatched();
    hideExhausted();
    updateRemainingUI();
    setHidden(els.ticket, true);
    setHidden(els.countdown, true);
    setHidden(els.showtime, true);
    setHidden(els.watchBtn, false);
    disableButton(false);
    setBoothCTA("Time to Watch…");
    if (els.description) els.description.textContent = 'Tap the ticket to reveal tonight\'s pick and the vibe you\'re in for.';
  });
}

init();
