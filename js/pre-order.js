// Set the target date and time for the pre-order countdown
const preordercountDownDate = new Date("Jul 31, 2026 23:59:59").getTime();

// Update the countdown every second
const preordercountdownInterval = setInterval(function () {
    const now = new Date().getTime();
    const timeRemaining = preordercountDownDate - now;

    // Calculate days, hours, minutes, and seconds
    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

    // Display the result in the element with id="timer"
    document.getElementById("Pre-ordertimer").innerHTML =
        days + "d " + hours + "h " + minutes + "m " + seconds + "s ";

    // If the countdown is over, display a message
    if (timeRemaining < 0) {
        clearInterval(preordercountdownInterval);
        document.getElementById("Pre-ordertimer").innerHTML = "Pre-order Ended!";
    }
}, 1000);



