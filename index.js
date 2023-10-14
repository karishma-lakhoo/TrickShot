setTimeout(function() {
    window.location.href = "menu.html"; // Redirect to homepage
}, 5000); //5 seconds

document.addEventListener('DOMContentLoaded', function () {
    let storedVolume = localStorage.getItem('soundVolume');
    if (storedVolume === null) {
        // If not set in local storage, set the default value
        storedVolume = 0.5;
        localStorage.setItem('soundVolume', storedVolume);
    }
    
});

