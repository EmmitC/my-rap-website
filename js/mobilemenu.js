// Initialize variables first
const toggle = document.getElementById('mobileToggle');
const menu = document.getElementById('mobileMenu');
const backdrop = document.getElementById("menuBackdrop");

// Close mobile menu and backdrop
function closeMenu() {
  if (menu) {
    menu.classList.remove('show');
  }
  if (toggle) {
    toggle.classList.remove('active');
  }
  if (backdrop) {
    backdrop.classList.add('hidden');
  }
}

// Toggle updates modal form
function toggleForm() {
  const form = document.getElementById("updatesForm");
  if (form) {
    const isVisible = form.style.display === "flex";
    form.style.display = isVisible ? "none" : "flex";
  }
}

// Mobile menu toggle button
if (toggle && menu) {
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    menu.classList.toggle('show');
    if (backdrop) {
      if (menu.classList.contains('show')) {
        backdrop.classList.remove('hidden');
      } else {
        backdrop.classList.add('hidden');
      }
    }
  });
}

// Close menu if backdrop clicked
if (backdrop) {
  backdrop.addEventListener("click", closeMenu);
}

// Close menu when clicking a nav link (for better UX)
document.querySelectorAll('#mobileMenu a, #mobileMenu button').forEach(link => {
  link.addEventListener('click', () => {
    closeMenu();
  });
});





