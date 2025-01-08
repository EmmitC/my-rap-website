// Set the target date and time for the countdown
const countDownDate = new Date("Jul 31, 2025 23:59:59").getTime();

// Update the countdown every second
const countdownInterval = setInterval(function () {
    const now = new Date().getTime();
    const timeRemaining = countDownDate - now;

    // Calculate days, hours, minutes, and seconds
    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

    // Display the result in the element with id="timer"
    document.getElementById("timer").innerHTML =
        days + "d " + hours + "h " + minutes + "m " + seconds + "s ";

    // If the countdown is over, display a message
    if (timeRemaining < 0) {
        clearInterval(countdownInterval);
        document.getElementById("timer").innerHTML = "Countdown Finished!";
    }
}, 1000);



// Get the platforms container
const platforms = document.querySelector('.platforms');

// Variables for tracking touch positions
let startX = 0;
let scrollLeft = 0;

// Function to handle touch start event
platforms.addEventListener('touchstart', (e) => {
    startX = e.touches[0].pageX; // Get the starting touch position
    scrollLeft = platforms.scrollLeft; // Get the current scroll position
});

// Function to handle touch move event
platforms.addEventListener('touchmove', (e) => {
    if (startX === 0) return; // If no touch started, exit
    const moveX = e.touches[0].pageX - startX; // Calculate the movement in X direction
    platforms.scrollLeft = scrollLeft - moveX; // Scroll the container based on movement
});

// Function to handle touch end event
platforms.addEventListener('touchend', () => {
    startX = 0; // Reset touch position
});


// Get the socials container
const socials = document.querySelector('.socials');

// Variables for tracking touch positions
let startS = 0;
let scrollsLeft = 0;

// Function to handle touch start event
socials.addEventListener('touchstart', (e) => {
    startX = e.touches[0].pageS; // Get the starting touch position
    scrollLeft = socials.scrollLeft; // Get the current scroll position
});

// Function to handle touch move event
socials.addEventListener('touchmove', (e) => {
    if (startX === 0) return; // If no touch started, exit
    const moveX = e.touches[0].pageS - startS; // Calculate the movement in X direction
    socials.scrollsLeft = scrollsLeft - moveS; // Scroll the container based on movement
});

// Function to handle touch end event
socials.addEventListener('touchend', () => {
    startS = 0; // Reset touch position
});




// Set the target date and time for the pre-order countdown
const preordercountDownDate = new Date("Jul 31, 2025 23:59:59").getTime();

// Update the countdown every second
const preordercountdownInterval = setInterval(function () {
    const now = new Date().getTime();
    const timeRemaining = countDownDate - now;

    // Calculate days, hours, minutes, and seconds
    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

    // Display the result in the element with id="timer"
    document.getElementById("timer").innerHTML =
        days + "d " + hours + "h " + minutes + "m " + seconds + "s ";

    // If the countdown is over, display a message
    if (timeRemaining < 0) {
        clearInterval(countdownInterval);
        document.getElementById("timer").innerHTML = "Pre-order Ended!";
    }
}, 1000);



// Show the notification banner (you can add your own condition or timer here)
setTimeout(function () {
    document.getElementById("event-notification").classList.add("show");
}, 5000);  // Show after 5 seconds



// Display the popup after 5 seconds
setTimeout(function () {
    document.getElementById("event-popup").style.display = "block";
}, 5000);

// Close the popup
document.getElementById("close-popup").onclick = function () {
    document.getElementById("event-popup").style.display = "none";
};
