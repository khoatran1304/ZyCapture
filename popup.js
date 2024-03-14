document.addEventListener('DOMContentLoaded', function() {
    const checkbox = document.getElementById('darkmodeCbx');

    chrome.storage.sync.get('darkModeEnabled', function(data) {
        console.log('Retrieved data from storage:', data);
        checkbox.checked = data.darkModeEnabled || false;
    });

    // Send message to content script when checkbox state changes
    checkbox.addEventListener('change', function() {
        var isChecked = checkbox.checked;
        console.log('Checkbox state changed:', isChecked);
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            console.log('Sending message to content script');
            chrome.tabs.sendMessage(tabs[0].id, { enableDarkMode: isChecked });
        });
    });
});
