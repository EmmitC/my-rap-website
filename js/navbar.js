// Toggle mobile navigation menu
function toggleMenu() {
  const menu = document.getElementById("mobileMenu");
  menu.classList.toggle("hidden");
}

// Toggle updates modal form
function toggleForm() {
  const form = document.getElementById("updatesForm");
  const isVisible = form.style.display === "flex";
  form.style.display = isVisible ? "none" : "flex";
}

// Optional: Close menu when clicking a nav link (for better UX)
document.querySelectorAll('#mobileMenu a, #mobileMenu button').forEach(link => {
  link.addEventListener('click', () => {
    document.getElementById("mobileMenu").classList.add("hidden");
  });
});
