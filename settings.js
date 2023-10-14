document.getElementById('back-button').addEventListener('click', function () {
    window.location.href = 'menu.html';
});

document.addEventListener('DOMContentLoaded', function () {
    const SEVolumeSlider = document.getElementById('SEVolume-slider');
    const SEVolumeValue = document.getElementById('SEVolume-value');

    SEVolumeSlider.addEventListener('input', function () {
        const actualSEValue = SEVolumeSlider.value;  
        const displayedSEValue = actualSEValue * 10; 
        SEVolumeValue.textContent = displayedSEValue;

        localStorage.setItem('SEVolume', actualSEValue);
    });

    const storedSEVolume = localStorage.getItem('SEVolume') ;
    SEVolumeSlider.value = storedSEVolume;
    SEVolumeValue.textContent = storedSEVolume * 10;

    const MouseSpeedSlider = document.getElementById('MouseSpeed-slider');
    const MouseSpeedValue = document.getElementById('MouseSpeed-value');

    MouseSpeedSlider.addEventListener('input', function () {
        const actualMouseSpeedValue = 1100 - MouseSpeedSlider.value;  
        const displayedMouseSpeedValue = 100 -actualMouseSpeedValue / 10; 
        MouseSpeedValue.textContent = displayedMouseSpeedValue;

        localStorage.setItem('MouseSpeed', actualMouseSpeedValue);
    });

    const storedMouseSpeed = localStorage.getItem('MouseSpeed') ;
    MouseSpeedSlider.value = storedMouseSpeed;
    MouseSpeedValue.textContent = storedMouseSpeed / 10;
    
});

