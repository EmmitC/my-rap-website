// tourdata.js — fetches ../data/tourDates.json, splits shows into Upcoming
// and Past, renders both, and broadcasts the earliest upcoming date so the
// page's countdown can target the real next show instead of a hardcoded date.
// Called from html/tours.html, so "../data/" resolves correctly.

(function () {
  const container     = document.getElementById('tour-cards-container');
  const loading       = document.getElementById('tours-loading');
  const empty         = document.getElementById('tours-empty');
  const pastSection    = document.getElementById('past-shows-section');
  const pastContainer  = document.getElementById('past-cards-container');

  if (!container) return;

  function parseDate(dateStr) {
    const parts = (dateStr || '').split('-'); // DD-MM-YYYY
    if (parts.length !== 3) return null;
    const d = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
    return isNaN(d) ? null : d;
  }

  function fmtDate(d) {
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  function buildCard(tour, dateObj, isPast) {
    const card = document.createElement('div');
    card.className = 'tour-card' + (isPast ? ' past' : '');
    card.innerHTML = `
      <div>
        <div style="font-size:0.7rem;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.3);margin-bottom:0.25rem;">
          <i class="fas fa-map-marker-alt" style="color:#FF9900;margin-right:0.3rem;"></i>${tour.City || ''}
        </div>
        <div style="font-family:'TrashHand',cursive;font-size:1.5rem;color:#FF9900;margin-bottom:0.15rem;">${tour.venue || ''}</div>
        <div style="font-size:0.88rem;color:rgba(255,255,255,0.55);">${tour.location || ''}</div>
      </div>
      <div class="tour-card-right">
        <span style="font-family:'TrashHand',cursive;font-size:1.1rem;color:white;">${dateObj ? fmtDate(dateObj) : (tour.date || '')}</span>
        ${isPast
          ? `<span style="font-size:0.78rem;color:rgba(255,255,255,0.35);font-weight:700;"><i class="fas fa-check"></i> Played</span>`
          : `<a href="./booking.html" class="btn btn-outline btn-sm" style="font-size:0.78rem;padding:0.4rem 1rem;"><i class="fas fa-ticket-alt"></i> Get Tickets</a>`}
      </div>
    `;
    return card;
  }

  fetch('../data/tourDates.json')
    .then(res => {
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    })
    .then(data => {
      if (loading) loading.remove();

      if (!data || data.length === 0) {
        if (empty) empty.style.display = 'block';
        return;
      }

      const now = Date.now();
      const withDates = data.map(t => ({ tour: t, dateObj: parseDate(t.date) }));
      const upcoming = withDates.filter(x => x.dateObj && x.dateObj.getTime() >= now).sort((a, b) => a.dateObj - b.dateObj);
      const past     = withDates.filter(x => x.dateObj && x.dateObj.getTime() < now).sort((a, b) => b.dateObj - a.dateObj);

      if (!upcoming.length) {
        if (empty) empty.style.display = 'block';
      } else {
        upcoming.forEach((x, i) => {
          const card = buildCard(x.tour, x.dateObj, false);
          card.style.animationDelay = `${i * 0.08}s`;
          container.appendChild(card);
        });
        window.dispatchEvent(new CustomEvent('next-show-date', { detail: upcoming[0].dateObj }));
      }

      if (past.length && pastContainer) {
        past.forEach((x, i) => {
          const card = buildCard(x.tour, x.dateObj, true);
          card.style.animationDelay = `${i * 0.08}s`;
          pastContainer.appendChild(card);
        });
        if (pastSection) pastSection.style.display = 'block';
      }
    })
    .catch(err => {
      console.error('Error loading tour dates:', err);
      if (loading) loading.remove();
      if (empty) empty.style.display = 'block';
    });
})();
