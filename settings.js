document.getElementById('back-button').addEventListener('click', function () {
    window.location.href = 'menu.html';
});

document.addEventListener('DOMContentLoaded', function () {
    // Get the volume slider and its value span
    const SEVolumeSlider = document.getElementById('SEVolume-slider');
    const SEVolumeValue = document.getElementById('SEVolume-value');

    // Update the volume value when the slider changes
    SEVolumeSlider.addEventListener('input', function () {
        const actualSEValue = SEVolumeSlider.value;  // Get the actual value (between 0 and 1)
        const displayedSEValue = actualSEValue * 10; // Convert to a user-friendly format (0.1 becomes 1, 0.5 becomes 5)
        SEVolumeValue.textContent = displayedSEValue;

        // Save the new volume setting in local storage
        localStorage.setItem('SEVolume', actualSEValue);
    });

    // Load the volume setting from local storage or use the default (0.5)
    const storedSEVolume = localStorage.getItem('SEVolume') || 0.5;
    SEVolumeSlider.value = storedSEVolume;

    // Set the initial displayed value based on the loaded volume
    SEVolumeValue.textContent = storedSEVolume * 10;
});