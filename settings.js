document.getElementById('back-button').addEventListener('click', function () {
    window.location.href = 'menu.html';
});

document.addEventListener('DOMContentLoaded', function () {
    // Get the volume slider and its value span
    const volumeSlider = document.getElementById('volume-slider');
    const volumeValue = document.getElementById('volume-value');

    // Update the volume value when the slider changes
    volumeSlider.addEventListener('input', function () {
        const actualValue = volumeSlider.value;  // Get the actual value (between 0 and 1)
        const displayedValue = actualValue * 10; // Convert to a user-friendly format (0.1 becomes 1, 0.5 becomes 5)
        volumeValue.textContent = displayedValue;

        // Save the new volume setting in local storage
        localStorage.setItem('soundVolume', actualValue);
    });

    // Load the volume setting from local storage or use the default (0.5)
    const storedVolume = localStorage.getItem('soundVolume') || 0.5;
    volumeSlider.value = storedVolume;

    // Set the initial displayed value based on the loaded volume
    volumeValue.textContent = storedVolume * 10;
});