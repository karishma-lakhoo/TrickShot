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