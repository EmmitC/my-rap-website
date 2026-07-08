// homefeed.js — populates the homepage "Latest Drop" and "Next Show" spotlight
// cards from data/musicloader.json and data/tourDates.json.

(function () {
  const releaseEl = document.getElementById('latest-release');
  const showEl    = document.getElementById('next-show');

  if (releaseEl) {
    fetch('data/musicloader.json')
      .then(res => res.json())
      .then(data => {
        const mixtapes = (data.tracks || []).filter(t => t.type === 'mixtape' && t.title);
        const latest = mixtapes[mixtapes.length - 1];
        if (!latest) { releaseEl.style.display = 'none'; return; }
        releaseEl.querySelector('.spotlight-cover').src = latest.cover;
        releaseEl.querySelector('.spotlight-cover').alt = latest.title;
        releaseEl.querySelector('.spotlight-title').textContent = latest.title;
        releaseEl.querySelector('.spotlight-link').href = `./html/collections.html#${latest.slug}`;
      })
      .catch(err => { console.error('homefeed: latest release failed', err); releaseEl.style.display = 'none'; });
  }

  if (showEl) {
    fetch('data/tourDates.json')
      .then(res => res.json())
      .then(shows => {
        const upcoming = shows
          .map(s => {
            const [d, m, y] = s.date.split('-');
            return Object.assign({}, s, { dateObj: new Date(`${y}-${m}-${d}`) });
          })
          .filter(s => !isNaN(s.dateObj) && s.dateObj.getTime() >= Date.now())
          .sort((a, b) => a.dateObj - b.dateObj);

        const next = upcoming[0];
        if (!next) { showEl.style.display = 'none'; return; }
        showEl.querySelector('.spotlight-venue').textContent = next.venue;
        showEl.querySelector('.spotlight-city').textContent = `${next.City} — ${next.location}`;
        showEl.querySelector('.spotlight-date').textContent = next.dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
      })
      .catch(err => { console.error('homefeed: next show failed', err); showEl.style.display = 'none'; });
  }
})();
