document.addEventListener('DOMContentLoaded', initialize);


function initialize() {
    const themeCheckBox = document.getElementById('darkmodeCbx');
    const brightnessSlider = document.getElementById('brightnessSlider');

    
    //handle checkbox UI match with current theme
    chrome.storage.sync.get('theme', function(store) {
        themeCheckBox.checked = store.theme === 'darkmode';
    });

    // [error when retrieve from store]
    // chrome.storage.sync.get('brightness', function(store) {
    //     if (chrome.runtime.lastError) {
    //         console.error(chrome.runtime.lastError);
    //     } else {
    //         brightnessSlider.value = store.brightness || 100; // Default value if brightness is not found
    //     }
    // });


    //catch change event from checkbox
    themeCheckBox.addEventListener('change', function() {
        const isChecked = themeCheckBox.checked;
        const theme = isChecked ? 'darkmode' : '';

        chrome.tabs.query(
            { 
                active: true, 
                currentWindow: true 
            },
            (tabs) => {
                console.log('Sending message to content script');
                chrome.tabs.sendMessage(tabs[0].id, { request: 'change_theme', theme: theme });
            }
        );
    });

    brightnessSlider.addEventListener('change', function() {
        const brightnessValue = this.value;
        
        chrome.tabs.query(
            { 
                active: true, 
                currentWindow: true 
            },
            (tabs) => {
                console.log('Sending message to content script');
                chrome.tabs.sendMessage(tabs[0].id, { request: 'change_brightness', brightness: brightnessValue });
            }
        );
    });

}
