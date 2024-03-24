document.addEventListener('DOMContentLoaded', initialize);

// Only Handle UI popup
// Store Value to storage, send message, and retrieve from content.js
function initialize() {
    const themeCheckBox = document.getElementById('darkmodeCbx');
    const brightnessSlider = document.getElementById('brightnessSlider');

    // Handle checkbox UI match with current theme
    chrome.storage.sync.get('theme', function(store) {
        themeCheckBox.checked = store.theme === 'darkmode';
    });

    // Retrieve brightness value from storage
    chrome.storage.sync.get('brightness', function(store) {
        brightnessSlider.value = store.brightness || 100;
    });
    

    // Catch change event from checkbox
    themeCheckBox.addEventListener('change', function() {
        const isChecked = themeCheckBox.checked;
        const theme = isChecked ? 'darkmode' : '';

        chrome.storage.sync.set({ 'theme': theme });

        chrome.tabs.query(
            { 
                active: true, 
                currentWindow: true 
            },
            (tabs) => {
                chrome.tabs.sendMessage(tabs[0].id, { request: 'change_theme'});
            }
        );
    });

    // Catch change event from brightness slider
    brightnessSlider.addEventListener('change', function() {
        const brightness = this.value;
        
        chrome.storage.sync.set({ 'brightness': brightness });

        chrome.tabs.query(
            { 
                active: true, 
                currentWindow: true 
            },
            (tabs) => {
                
                chrome.tabs.sendMessage(tabs[0].id, { request: 'change_brightness'});
            }
        );
    });
}
