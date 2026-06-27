document.addEventListener("DOMContentLoaded", () => {
  const countDownDate = new Date("Jul 31, 2026 23:59:59").getTime();

  const countdownInterval = setInterval(() => {
    const now = Date.now();
    const timeRemaining = countDownDate - now;

    if (timeRemaining <= 0) {
      clearInterval(countdownInterval);
      document.getElementById("t-days").textContent = "00";
      document.getElementById("t-hours").textContent = "00";
      document.getElementById("t-mins").textContent = "00";
      document.getElementById("t-secs").textContent = "00";
      document.getElementById("finished-msg").textContent = "Out Now!";
      return;
    }

    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

    const pad = (num) => String(num).padStart(2, "0");

    document.getElementById("t-days").textContent = pad(days);
    document.getElementById("t-hours").textContent = pad(hours);
    document.getElementById("t-mins").textContent = pad(minutes);
    document.getElementById("t-secs").textContent = pad(seconds);
  }, 1000);}
)