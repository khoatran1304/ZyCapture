document.addEventListener('DOMContentLoaded', initialize);


function initialize() {
    const themeCheckBox = document.getElementById('darkmodeCbx');

    //handle checkbox UI match with current theme
    chrome.storage.sync.get('theme', function(currentTheme) {
        themeCheckBox.checked = currentTheme.theme === 'darkmode';
    });

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
}
