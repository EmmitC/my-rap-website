(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var navEl     = document.getElementById('NavigationBar');
    var hamburger = navEl && navEl.querySelector('.nav-hamburger');
    var sourceUl  = navEl && navEl.querySelector('ul');
    if (!navEl || !hamburger || !sourceUl) return;

    // Build body-level panel from the existing ul (deep clone preserves active class + hrefs)
    var panel = document.createElement('div');
    panel.id = 'nav-panel';
    panel.appendChild(sourceUl.cloneNode(true));
    document.body.appendChild(panel);

    function open() {
      panel.classList.add('open');
      navEl.classList.add('nav-open');
      document.body.style.overflow = 'hidden';
    }

    function close() {
      panel.classList.remove('open');
      navEl.classList.remove('nav-open');
      document.body.style.overflow = '';
    }

    function toggle() {
      panel.classList.contains('open') ? close() : open();
    }

    hamburger.addEventListener('click', toggle);

    // Close when a link is tapped
    panel.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') close();
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });
  });
})();
