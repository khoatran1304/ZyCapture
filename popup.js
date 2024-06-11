document.addEventListener('DOMContentLoaded', initialize);

// Only Handle UI popup
// Store Value to storage, send message, and retrieve from content.js
function initialize() {
    const themeCheckBox = document.getElementById('darkmodeCbx');
    const brightnessSlider = document.getElementById('brightnessSlider');
    const solverButton = document.getElementById('quiz-solve');

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

    solverButton.addEventListener('click', function() {
        chrome.tabs.query(
            { 
                active: true, 
                currentWindow: true 
            },
            (tabs) => {
                
                chrome.tabs.sendMessage(tabs[0].id, { request: 'call_solver'});
            }
        );
    })

    // Listen for messages from content script
    // BUG CUZ EVERYTIME RE-OPEN POPPUP, THE POPUP WILL BE NEW INSTANCE, NOT KEEP THE OLD VALUE
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        console.log("Message received in popup");
        if (request.action === "update_solver") {
            // Handle the message as needed
            const report = request.message;

            document.querySelector("#quiz-counter").textContent = report;
        }
    });
}


