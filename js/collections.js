// collections.js — tab scroll-spy for html/collections.html
// (the Mixtapes player itself is rendered by js/player.js)

(function () {
  const tabs = Array.from(document.querySelectorAll('.tab-btn'));
  if (!tabs.length) return;
  const sections = tabs.map(tab => document.querySelector(tab.getAttribute('href')));

  function setActiveTab() {
    const scrollPos = window.scrollY + 140;
    let activeIdx = 0;
    sections.forEach((sec, i) => {
      if (sec && sec.offsetTop <= scrollPos) activeIdx = i;
    });
    tabs.forEach((tab, i) => tab.classList.toggle('active', i === activeIdx));
  }

  window.addEventListener('scroll', setActiveTab, { passive: true });
  setActiveTab();
})();
