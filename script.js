// Get the form element
const loginForm = document.getElementById("loginForm");

// Add an event listener for form submission
loginForm.addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Get the values from the inputs
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Simple interactivity: Alert the username and password
    if (username && password) {
        alert(`Welcome, ${username}! You have logged in.`);
    } else {
        alert("Please enter correct both username and password.");
    }
});
