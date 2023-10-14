setTimeout(function() {
    window.location.href = "menu.html"; // Redirect to homepage
}, 5000); //5 seconds

document.addEventListener('DOMContentLoaded', function () {
    let storedSEVolume = localStorage.getItem('SEVolume');
    if (storedSEVolume === null) {
        storedSEVolume = 0.5;
        localStorage.setItem('SEVolume', storedSEVolume);
    }

    let storedMouseSpeed = localStorage.getItem('MouseSpeed');
    if (storedMouseSpeed === null) {
        storedMouseSpeed = 500;
        localStorage.setItem('MouseSpeed', storedMouseSpeed);
    }
    
});

