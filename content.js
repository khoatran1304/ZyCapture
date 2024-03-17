// import { ACTIONS, THEMES } from './constants.js';
// Constants
const EXTENSION = {
    BADGE_COLOR: "#9688F1",
}

const ACTIONS = {
    UPDATE_BADGE: 'update_badge',
}

const DEFAULT_VALUES = {
    BADGE_WAIT: '...',
}

const THEMES = {
    DARK_MODE: 85,
}

const MAX_RETRIES = 5;
let retryCount = 0;

// Function to capture content
function capture(div, options) {
    const fileName = div.querySelector('.activity-title').innerText;

    html2canvas(div, options || {}).then(canvas => {
        const imageDataURL = canvas.toDataURL('image/png');
        const link = document.createElement('a');

        link.download = `${fileName || 'zybook_image'}.png`;
        link.href = imageDataURL;
        link.click();
    });
}

// Function to capture source code content
function captureSourcecode(div) {
    let fileName = div.querySelector('.activity-title').innerText;

    html2canvas(div, options || {}).then(function(canvas) {
        // Convert canvas to image data URL
        const imageDataURL = canvas.toDataURL('image/png');

        // Create a link element to download the image
        const link = document.createElement('a');
        link.download = `${fileName || 'zybook_image'}.png`;
        link.href = imageDataURL;
        link.click();
    });
}

// Function to create and style download button
function createDownloadButton(name) {
    const button = document.createElement('button');

    button.className = 'downloadBtn';
    button.textContent = name;

    button.style.backgroundColor = '#4CAF50';
    button.style.border = 'none';
    button.style.color = 'white';
    button.style.padding = '15px 32px';
    button.style.textAlign = 'center';
    button.style.textDecoration = 'none';
    button.style.display = 'inline-block';
    button.style.fontSize = '16px';
    button.style.margin = '4px 2px';
    button.style.cursor = 'pointer';
    button.style.borderRadius = '8px';
    button.style.transitionDuration = '0.4s';

    button.addEventListener('mouseover', () => {
        button.style.backgroundColor = '#45a049';
    });

    button.addEventListener('mouseout', () => {
        button.style.backgroundColor = '#4CAF50';
    });

    return button;
}

// Initialization function
function initialize() {
    const challenges = document.querySelectorAll('.interactive-activity-container');
    const counter = challenges.length;

    updateBadgeMsg(counter);

    if (counter !== 0) {
        for (const challenge of challenges) {
            const button = createDownloadButton("Download");
            button.addEventListener('click', () => assignCaptureType(challenge));
            challenge.querySelector('.activity-title-bar').appendChild(button);
        }

        //RESET GLOBAL RETRY VARIABLE
        retryCount = 0;

    } else {
        console.log('Element not found yet. Retrying...');
        retryCount++;

        if (retryCount <= MAX_RETRIES) {
            setTimeout(initialize, 1000);
        } else {
            console.log('Max retries exceeded. Stopping retrying.');
        }
    }
}

// Function to assign capture type based on content
function assignCaptureType(div) {
    const codeChallenge = div.querySelector('.ace-editor-container');

    if (codeChallenge) {
        captureSourcecode(div);
    } else {
        capture(div);
    }
}

// Function to reset styling
function resetStyle() {
    // Reset styling
}




// Handle dark mode message
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    document.documentElement.style.filter = request.enableDarkMode ? `invert(${THEMES.DARK_MODE}%)` : '';
    chrome.storage.sync.set({ 'darkModeEnabled': request.enableDarkMode });
});

// Update badge message
function updateBadgeMsg(text) {
    chrome.runtime.sendMessage(
        { action: ACTIONS.UPDATE_BADGE, value: text}, 
        response => console.log(response.message)
    );
}

// Main initialization
initialize();


chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        // listen for messages sent from background.js
    if (request.message === 'Content.Refresh') {
        console.log('Content.Refresh') // new url is now in content scripts!
        initialize();
    }
});




//backup
// const applyTheme = function() {
//     const topToolbars = document.querySelector('.top-toolbar');
//     Object.assign(topToolbars.style, THEMES.DARK_MODE.header);

//     const container = document.querySelector('.route-container');
//     Object.assign(container.style, THEMES.DARK_MODE.container);

//     const cards = document.querySelectorAll('.zb-card');
//     cards.forEach((card) => {
//         // card.style.backgroundColor = "";
//         Object.assign(card.style, THEMES.DARK_MODE.card);
//     });

//     const resource = document.querySelectorAll('.static-container, .content-resource, .participation, .challenge');
//     resource.forEach((res) => {
//         // card.style.backgroundColor = "";
//         // Object.assign(res.style, THEMES.DARK_MODE.card);
//         res.style.backgroundColor = 'transparent';
//     });

//     //text color
//     const allElements = document.querySelectorAll('*');
//     allElements.forEach(element => {
//         if ((element.classList.contains('static-container')
//             ||element.classList.contains('activity-instructions')
//             ||element.classList.contains('ember-view')
//             ||element.tagName.toLowerCase() == 'pre')
//             && !element.classList.contains('activity-title-bar')
//         ) {
//             // Change the text color to white
//             element.style.color = '#ffffff';
//         }
//     });

//     const titles = document.querySelectorAll('.activity-title-bar');
//     titles.forEach(title => 
//     {
//         title.style.color = 'black';
//     })

//     const tables = document.querySelectorAll('.sortable');
//     tables.forEach(table => 
//     {
//         table.style.color = 'black';
//     })

//     const objects = document.querySelectorAll('object');
//     objects.forEach(object => 
//     {
//         object.style.backgroundColor = 'wheat';
//     })

//     const boxes = document.querySelectorAll('.n, .na, .k');
//     boxes.forEach(box => 
//     {
//         box.style.color = 'white';
//     })

// };
