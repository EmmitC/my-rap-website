// albumstory.js — scroll-driven word reveal + chapter rail for html/AlbumPromo.html
// Splits each page's story text into words wrapped in overflow-masked spans,
// then reveals them with a staggered rise as the page scrolls into view.
// Also drives the chapter rail: click-to-jump + scroll-spy for the active chapter.

(function () {
  const pages = document.querySelectorAll('#AlbumIntro .page');
  if (!pages.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  pages.forEach(page => {
    const target = page.querySelector('h1, p');
    if (!target || prefersReducedMotion) return;

    // Preserve <br> line breaks while wrapping every word in a reveal mask
    const lines = target.innerHTML.split(/<br\s*\/?>/i);
    target.innerHTML = lines.map(line => {
      const words = line.trim().split(/\s+/).filter(Boolean);
      return words.map(word => `<span class="story-mask"><span class="story-word">${word}</span></span>`).join(' ');
    }).join('<br>');

    target.querySelectorAll('.story-word').forEach((word, i) => {
      word.style.transitionDelay = `${i * 0.045}s`;
    });
  });

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      entry.target.classList.toggle('in-view', entry.isIntersecting);
    });
  }, { threshold: 0.35 });
  pages.forEach(page => revealObserver.observe(page));

  const rail = document.getElementById('story-rail');
  if (!rail) return;

  rail.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById(btn.dataset.target)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });

  const spyObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const btn = rail.querySelector(`button[data-target="${entry.target.id}"]`);
      if (btn) btn.classList.toggle('active', entry.isIntersecting);
    });
  }, { threshold: 0.5 });
  pages.forEach(page => spyObserver.observe(page));
})();
