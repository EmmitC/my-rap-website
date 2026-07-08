// albumtracklist.js — renders the debut album's tracklist on html/AlbumPromo.html.
// Tracks stay locked (visible, not playable) until data/musicloader.json's
// releaseDate has passed — the real mixtape tracks live on Collections instead.

(function () {
  const list = document.getElementById('album-tracklist');
  if (!list) return;

  fetch('../data/musicloader.json')
    .then(res => res.json())
    .then(data => {
      const tracks = (data.tracks || []).filter(t => t.type === 'album');
      const releaseDate = data.releaseDate ? new Date(data.releaseDate) : null;
      const unlocked = !!releaseDate && Date.now() >= releaseDate.getTime();

      if (!tracks.length) {
        list.innerHTML = '<p style="text-align:center;color:rgba(255,255,255,0.35);padding:2rem;">Tracklist coming soon.</p>';
        return;
      }

      list.innerHTML = tracks.map((t, i) => `
        <div class="track-row ${unlocked ? '' : 'locked'}" ${unlocked ? '' : 'aria-disabled="true"'}>
          <span class="track-num">${i + 1}</span>
          <button class="track-icon-btn" ${unlocked ? '' : 'disabled'} aria-label="${unlocked ? 'Play ' + t.title : t.title + ' — locked until release'}">
            <i class="fas ${unlocked ? 'fa-play' : 'fa-lock'}" ${unlocked ? 'style="margin-left:2px;font-size:0.7rem;"' : 'style="font-size:0.7rem;"'}></i>
          </button>
          <div class="track-meta">
            <div class="track-name">${t.title}${t.tag ? ` <span class="track-tag">${t.tag}</span>` : ''}</div>
            <div class="track-artist-small">${unlocked ? t.artist : 'Unlocks on release day'}</div>
          </div>
        </div>
      `).join('');
    })
    .catch(err => {
      console.error('albumtracklist: failed to load', err);
      list.innerHTML = '<p style="text-align:center;color:rgba(255,255,255,0.35);padding:2rem;">Couldn’t load the tracklist right now.</p>';
    });
})();
