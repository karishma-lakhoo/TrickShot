setTimeout(function() {
    window.location.href = "menu.html"; // Redirect to homepage
}, 5000); //5 seconds

document.addEventListener('DOMContentLoaded', function () {
    let storedSEVolume = localStorage.getItem('SEVolume');
    if (storedSEVolume === null) {
        // If not set in local storage, set the default value
        storedSEVolume = 0.5;
        localStorage.setItem('SEVolume', storedSEVolume);
    }
    
});

