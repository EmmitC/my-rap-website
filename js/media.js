// media.js — populates the video grid on html/media.html from data/media.json.
// Each entry: { "title": "...", "type": "Music Video", "youtubeId": "..." }
// Empty by default — add entries as real videos become available.

(function () {
  const grid  = document.getElementById('media-grid');
  const empty = document.getElementById('media-empty');
  if (!grid) return;

  fetch('../data/media.json')
    .then(res => res.json())
    .then(items => {
      const valid = items.filter(v => v.youtubeId && v.title);
      if (!valid.length) {
        grid.style.display = 'none';
        if (empty) empty.style.display = 'block';
        return;
      }

      grid.innerHTML = valid.map(v => `
        <div class="media-card">
          <div class="media-thumb">
            <img src="https://img.youtube.com/vi/${v.youtubeId}/hqdefault.jpg" alt="${v.title}" loading="lazy">
            <a class="play-badge" href="https://www.youtube.com/watch?v=${v.youtubeId}" target="_blank" rel="noopener" aria-label="Watch ${v.title}">
              <i class="fas fa-play"></i>
            </a>
          </div>
          <div class="media-info">
            <div class="media-title">${v.title}</div>
            <div class="media-meta">${v.type || 'Video'}</div>
          </div>
        </div>
      `).join('');
    })
    .catch(err => {
      console.error('media: failed to load videos', err);
      grid.style.display = 'none';
      if (empty) empty.style.display = 'block';
    });
})();
