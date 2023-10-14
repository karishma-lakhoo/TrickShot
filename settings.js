document.getElementById('back-button').addEventListener('click', function () {
    window.location.href = 'menu.html';
});

document.addEventListener('DOMContentLoaded', function () {
    // Get the volume slider and its value span
    const volumeSlider = document.getElementById('volume-slider');
    const volumeValue = document.getElementById('volume-value');

    // Load the volume setting from local storage or use the default (3)
    let storedVolume = localStorage.getItem('soundVolume');
    volumeSlider.value = storedVolume;
    volumeValue.textContent = storedVolume;

    // Update the volume value when the slider changes
    volumeSlider.addEventListener('input', function () {
        const newValue = volumeSlider.value;
        volumeValue.textContent = newValue;

        // Save the new volume setting in local storage
        localStorage.setItem('soundVolume', newValue);
    });


});
