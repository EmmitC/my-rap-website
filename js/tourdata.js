// tourdata.js — fetches ../data/tourDates.json and renders tour cards
// Called from html/tours.html, so "../data/" resolves correctly.

(function () {
  const container = document.getElementById('tour-cards-container');
  const loading   = document.getElementById('tours-loading');
  const empty     = document.getElementById('tours-empty');

  if (!container) return;

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

      data.forEach((tour, i) => {
        const card = document.createElement('div');
        card.className = 'tour-card';
        card.style.animationDelay = `${i * 0.08}s`;

        // Format date nicely if possible
        let dateStr = tour.date || '';
        try {
          const parts = dateStr.split('-'); // DD-MM-YYYY
          if (parts.length === 3) {
            const d = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
            if (!isNaN(d)) {
              dateStr = d.toLocaleDateString('en-GB', {
                day: 'numeric', month: 'long', year: 'numeric'
              });
            }
          }
        } catch (_) {}

        card.innerHTML = `
          <div>
            <div style="font-size:0.7rem;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.3);margin-bottom:0.25rem;">
              <i class="fas fa-map-marker-alt" style="color:#FF9900;margin-right:0.3rem;"></i>${tour.City || ''}
            </div>
            <div style="font-family:'TrashHand',cursive;font-size:1.5rem;color:#FF9900;margin-bottom:0.15rem;">${tour.venue || ''}</div>
            <div style="font-size:0.88rem;color:rgba(255,255,255,0.55);">${tour.location || ''}</div>
          </div>
          <div class="tour-card-right">
            <span style="font-family:'TrashHand',cursive;font-size:1.1rem;color:white;">${dateStr}</span>
            <a href="./booking.html" class="btn btn-outline btn-sm" style="font-size:0.78rem;padding:0.4rem 1rem;">
              <i class="fas fa-ticket-alt"></i> Get Tickets
            </a>
          </div>
        `;

        container.appendChild(card);
      });
    })
    .catch(err => {
      console.error('Error loading tour dates:', err);
      if (loading) loading.remove();
      if (empty) empty.style.display = 'block';
    });
})();
