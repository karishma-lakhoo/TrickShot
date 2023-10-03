document.getElementById('play-button').addEventListener('click', function () {
    window.location.href = 'game.html';
});

document.getElementById('controls-button').addEventListener('click', function () {
    alert('Controls: WASD to move, SPACE to jump, MOUSE to look around.');
});

document.getElementById('about-button').addEventListener('click', function () {
    // Add code to show game information or navigate to the about page
    alert('About the Game: This is a three.js demo with basic collisions.');
});

// Get a reference to the audio element
const backgroundMusic = new Audio('music/menusong.mp3');
backgroundMusic.loop = true; // Make the audio loop continuously

// Add a click event listener to the Bluetooth switch
document.getElementById('music').addEventListener('change', function () {
    if (this.checked) {
        backgroundMusic.play(); // Play the audio
    } else {
        backgroundMusic.pause(); // Pause the audio
    }
});


