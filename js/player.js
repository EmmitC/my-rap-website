// player.js — full mixtape player for html/collections.html (#mixtapes tab)
// Fetches tracks from ../data/musicloader.json and renders:
//   - the now-playing card + progress/controls
//   - a Lyrics panel for the current track
//   - a Follow toggle (persisted in localStorage)
//   - a hidden-but-explorable comment thread per track (persisted in localStorage,
//     per-browser only — this is a static site with no backend/database)

(function () {
  const trackList = document.getElementById('track-list');
  if (!trackList) return; // not on the player page

  const audio       = new Audio();
  audio.volume      = 0.8;
  let TRACKS        = [];
  let currentIdx    = 0;
  let isPlaying     = false;
  let isShuffle     = false;
  let isRepeat      = false;
  let lyricsOpen    = false;
  const openComments = new Set();

  const playBtn     = document.getElementById('play-btn');
  const playIcon    = document.getElementById('play-icon');
  const btnPrev     = document.getElementById('btn-prev');
  const btnNext     = document.getElementById('btn-next');
  const btnShuffle  = document.getElementById('btn-shuffle');
  const btnRepeat   = document.getElementById('btn-repeat');
  const progressBar = document.getElementById('progress-bar');
  const progressFill= document.getElementById('progress-fill');
  const timeCurrent = document.getElementById('time-current');
  const timeTotal   = document.getElementById('time-total');
  const volSlider   = document.getElementById('vol-slider');
  const volIcon     = document.getElementById('vol-icon');
  const npCover     = document.getElementById('np-cover');
  const npTitle     = document.getElementById('np-title');
  const npArtist    = document.getElementById('np-artist');
  const lyricsBtn   = document.getElementById('lyrics-btn');
  const lyricsPanel = document.getElementById('lyrics-panel');
  const lyricsText  = document.getElementById('lyrics-text');
  const followBtn   = document.getElementById('follow-btn');

  /* ---------------------------------------------------------------
     Helpers
     --------------------------------------------------------------- */
  function fmt(s) {
    if (!s || isNaN(s)) return '0:00';
    return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, ch => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[ch]));
  }

  /* ---------------------------------------------------------------
     Comments (localStorage, per track, per browser)
     --------------------------------------------------------------- */
  function commentsKey(slug) { return `maze28_comments_${slug}`; }

  function getComments(slug) {
    try { return JSON.parse(localStorage.getItem(commentsKey(slug))) || []; }
    catch (_) { return []; }
  }

  function addComment(slug, name, text) {
    const list = getComments(slug);
    list.push({ name, text, date: new Date().toISOString() });
    localStorage.setItem(commentsKey(slug), JSON.stringify(list));
  }

  function fmtDate(iso) {
    const d = new Date(iso);
    if (isNaN(d)) return '';
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  /* ---------------------------------------------------------------
     Now playing / track list
     --------------------------------------------------------------- */
  function loadTrack(idx, autoplay) {
    if (!TRACKS.length) return;
    const t = TRACKS[idx];
    currentIdx = idx;
    audio.src  = '../' + t.file;
    npTitle.textContent  = t.title;
    npArtist.textContent = t.artist;

    npCover.innerHTML = '';
    const img = document.createElement('img');
    img.src = '../' + t.cover;
    img.alt = t.title;
    img.onerror = () => { npCover.innerHTML = '<i class="fas fa-music"></i>'; };
    npCover.appendChild(img);

    if (lyricsOpen) renderLyrics();
    renderList();
    if (autoplay) {
      audio.play().then(() => { isPlaying = true; updatePlayBtn(); }).catch(() => {});
    }
  }

  function updatePlayBtn() {
    playIcon.className = isPlaying ? 'fas fa-pause' : 'fas fa-play';
  }

  function renderList() {
    trackList.innerHTML = TRACKS.map((t, i) => {
      const comments = getComments(t.slug);
      const isOpen = openComments.has(t.slug);
      return `
        <div class="track-item">
          <div class="track-row ${i === currentIdx ? 'active' : ''}" data-idx="${i}">
            <span class="track-num">${i + 1}</span>
            <button class="track-icon-btn" aria-label="Play ${escapeHtml(t.title)}">
              ${i === currentIdx && isPlaying
                ? `<div class="bars"><span></span><span></span><span></span></div>`
                : `<i class="fas fa-play" style="margin-left:2px;font-size:0.7rem;"></i>`}
            </button>
            <div class="track-meta">
              <div class="track-name">${escapeHtml(t.title)}</div>
              <div class="track-artist-small">${escapeHtml(t.artist)}</div>
            </div>
            <button class="track-comment-btn ${isOpen ? 'active' : ''}" data-slug="${t.slug}" aria-label="Comments for ${escapeHtml(t.title)}" title="Comments">
              <i class="fas fa-comment-dots"></i>
              ${comments.length ? `<span class="comment-count">${comments.length}</span>` : ''}
            </button>
          </div>
          <div class="track-comments-panel ${isOpen ? 'open' : ''}" data-panel="${t.slug}">
            <div class="track-comments-inner">
              <div class="comment-list">
                ${comments.length
                  ? comments.map(c => `
                      <div class="comment-item">
                        <span class="comment-author">${escapeHtml(c.name)}</span>
                        <span class="comment-date">${fmtDate(c.date)}</span>
                        <div class="comment-text">${escapeHtml(c.text)}</div>
                      </div>`).join('')
                  : `<p class="comment-empty">No comments yet — be the first to share your thoughts.</p>`}
              </div>
              <form class="comment-form" data-slug="${t.slug}">
                <input type="text" name="name" placeholder="Your name" maxlength="40" required>
                <textarea name="text" rows="2" placeholder="Share your thoughts on this track…" maxlength="500" required></textarea>
                <button type="submit">Post</button>
              </form>
              <div class="comment-note">Comments are saved on this device only.</div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    trackList.querySelectorAll('.track-row').forEach(row => {
      row.addEventListener('click', () => {
        const idx = parseInt(row.dataset.idx, 10);
        if (idx === currentIdx && isPlaying) {
          audio.pause(); isPlaying = false; updatePlayBtn(); renderList();
        } else {
          loadTrack(idx, true);
        }
      });
    });

    trackList.querySelectorAll('.track-comment-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const slug = btn.dataset.slug;
        if (openComments.has(slug)) openComments.delete(slug); else openComments.add(slug);
        btn.classList.toggle('active');
        const panel = trackList.querySelector(`.track-comments-panel[data-panel="${slug}"]`);
        if (panel) panel.classList.toggle('open');
      });
    });

    trackList.querySelectorAll('.comment-form').forEach(form => {
      form.addEventListener('submit', e => {
        e.preventDefault();
        const slug = form.dataset.slug;
        const name = form.name.value.trim();
        const text = form.text.value.trim();
        if (!name || !text) return;
        addComment(slug, name, text);
        openComments.add(slug);
        renderList();
      });
    });
  }

  /* ---------------------------------------------------------------
     Lyrics panel
     --------------------------------------------------------------- */
  function renderLyrics() {
    const t = TRACKS[currentIdx];
    lyricsText.textContent = (t && t.lyrics) ? t.lyrics : 'No lyrics available for this track yet.';
  }

  if (lyricsBtn) {
    lyricsBtn.addEventListener('click', () => {
      lyricsOpen = !lyricsOpen;
      lyricsPanel.classList.toggle('open', lyricsOpen);
      lyricsBtn.classList.toggle('active', lyricsOpen);
      if (lyricsOpen) renderLyrics();
    });
  }

  /* ---------------------------------------------------------------
     Follow toggle (persisted locally — no backend on a static site)
     --------------------------------------------------------------- */
  const FOLLOW_KEY = 'maze28_following';

  function applyFollowState(following) {
    followBtn.classList.toggle('active', following);
    followBtn.innerHTML = following
      ? '<i class="fas fa-heart"></i> Following'
      : '<i class="far fa-heart"></i> Follow';
  }

  if (followBtn) {
    applyFollowState(localStorage.getItem(FOLLOW_KEY) === '1');
    followBtn.addEventListener('click', () => {
      const now = localStorage.getItem(FOLLOW_KEY) !== '1';
      localStorage.setItem(FOLLOW_KEY, now ? '1' : '0');
      applyFollowState(now);
    });
  }

  /* ---------------------------------------------------------------
     Transport controls
     --------------------------------------------------------------- */
  playBtn.addEventListener('click', () => {
    if (!TRACKS.length) return;
    if (!audio.src) { loadTrack(0, true); return; }
    if (isPlaying) { audio.pause(); isPlaying = false; }
    else           { audio.play().catch(() => {}); isPlaying = true; }
    updatePlayBtn(); renderList();
  });

  btnPrev.addEventListener('click', () => {
    if (!TRACKS.length) return;
    if (audio.currentTime > 3) { audio.currentTime = 0; return; }
    loadTrack((currentIdx - 1 + TRACKS.length) % TRACKS.length, isPlaying);
  });

  btnNext.addEventListener('click', () => {
    if (!TRACKS.length) return;
    const next = isShuffle
      ? (() => { let r; do { r = Math.floor(Math.random() * TRACKS.length); } while (r === currentIdx && TRACKS.length > 1); return r; })()
      : (currentIdx + 1) % TRACKS.length;
    loadTrack(next, isPlaying);
  });

  btnShuffle.addEventListener('click', () => {
    isShuffle = !isShuffle;
    btnShuffle.classList.toggle('active', isShuffle);
  });

  btnRepeat.addEventListener('click', () => {
    isRepeat = !isRepeat;
    btnRepeat.classList.toggle('active', isRepeat);
    audio.loop = isRepeat;
  });

  audio.addEventListener('timeupdate', () => {
    if (!audio.duration) return;
    const pct = (audio.currentTime / audio.duration) * 100;
    progressFill.style.width = pct + '%';
    timeCurrent.textContent  = fmt(audio.currentTime);
    timeTotal.textContent    = fmt(audio.duration);
  });

  audio.addEventListener('ended', () => {
    if (!isRepeat) btnNext.click();
  });

  audio.addEventListener('play',  () => { isPlaying = true;  updatePlayBtn(); renderList(); });
  audio.addEventListener('pause', () => { isPlaying = false; updatePlayBtn(); renderList(); });

  progressBar.addEventListener('click', e => {
    if (!audio.duration) return;
    const pct = (e.clientX - progressBar.getBoundingClientRect().left) / progressBar.offsetWidth;
    audio.currentTime = pct * audio.duration;
  });

  volSlider.addEventListener('input', () => {
    audio.volume = volSlider.value;
    volIcon.className = audio.volume < 0.1 ? 'fas fa-volume-mute vol-icon' : audio.volume < 0.5 ? 'fas fa-volume-down vol-icon' : 'fas fa-volume-up vol-icon';
  });

  volIcon.addEventListener('click', () => {
    audio.muted = !audio.muted;
    volIcon.className = audio.muted ? 'fas fa-volume-mute vol-icon' : 'fas fa-volume-up vol-icon';
  });

  /* ---------------------------------------------------------------
     Init — load tracks, then jump to a track if the page was
     opened with a #slug hash. Only "mixtape" tracks are playable
     here — the debut album is locked until its release date and
     lives on AlbumPromo.html instead (see js/albumtracks.js).
     --------------------------------------------------------------- */
  fetch('../data/musicloader.json')
    .then(res => res.json())
    .then(data => {
      const tracks = Array.isArray(data) ? data : (data.tracks || []);
      TRACKS = tracks.filter(t => t.type === 'mixtape' && t.title && t.file);
      if (!TRACKS.length) throw new Error('no tracks');

      const hash = decodeURIComponent(location.hash.replace('#', ''));
      const startIdx = Math.max(0, TRACKS.findIndex(t => t.slug === hash));

      renderList();
      loadTrack(startIdx, false);
    })
    .catch(err => {
      console.error('player: failed to load tracks', err);
      trackList.innerHTML = '<p style="color:rgba(255,255,255,0.4);text-align:center;padding:2rem;">Couldn’t load tracks right now — please refresh.</p>';
    });
})();
