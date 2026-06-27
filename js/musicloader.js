// musicloader.js — loads tracks from ../data/musicloader.json
// NOTE: raps.html now has a full built-in player.
// This file is kept as a fallback loader only and does nothing
// if the built-in #track-list is already populated by inline JS.

(function () {
  const container = document.getElementById('music-player');
  if (!container) return;

  // If inline JS already populated the track list, bail out.
  const trackList = document.getElementById('track-list');
  if (trackList && trackList.children.length > 0) return;

  fetch('../data/musicloader.json')
    .then(res => res.json())
    .then(tracks => {
      // Filter out empty entries
      const valid = tracks.filter(t => t.title && t.file);
      if (!valid.length) return;

      valid.forEach(track => {
        const card = document.createElement('div');
        card.className = 'track-card';
        card.innerHTML = `
          <div class="music-player">
            <p class="np-label">Now Playing</p>
            ${track.cover ? `<img src="${track.cover}" alt="${track.title} cover">` : ''}
            <h3>${track.title}</h3>
            <p>${track.artist}</p>
            <div class="controls">
              <audio controls>
                <source src="${track.file}" type="audio/mpeg">
                Your browser does not support the audio element.
              </audio>
            </div>
          </div>
        `;
        container.appendChild(card);
      });
    })
    .catch(err => console.warn('musicloader: could not load tracks:', err));
})();
