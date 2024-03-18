// Used to handle UI of webpage


// import { ACTIONS, THEMES } from './constants.js';
// Constants
const EXTENSION = {
    BADGE_COLOR: "#9688F1",
}

const ACTIONS = {
    CALL: 
    {   
        UPDATE_BADGE: 'update_badge',
    },
    
    RECEIVE: 
    {
        CHANGE_THEME: 'change_theme',
        CHANGE_ROUTE: 'change_route',
    }
}

const DEFAULT_VALUES = {
    BADGE_WAIT: '...',
}

const THEMES = {
    DARK_MODE: 'darkmode',
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

// Function to assign capture type based on content
function assignCaptureType(div) {
    const codeChallenge = div.querySelector('.ace-editor-container');

    if (codeChallenge) {
        captureSourcecode(div);
    } else {
        capture(div);
    }
}

function updateTheme(theme) {

    switch(theme)
    {   
        case THEMES.DARK_MODE:
            document.documentElement.style.filter = `invert(82%)`;
            break;

        // case THEMES.DARK_MODE:
        //     handle UI
        //     break;

        default:
            //reset css
            document.documentElement.style.filter = '';
            break;
    }
   
    chrome.storage.sync.set({ 'theme': theme });
}


// Initialization function
function initialize() {
    const challenges = document.querySelectorAll('.interactive-activity-container');
    const counter = challenges.length;

    //call background to update popup
    chrome.runtime.sendMessage({ action: ACTIONS.CALL.UPDATE_BADGE, value: counter}, response => console.log(response.message));

    if (counter !== 0) {
        for (const challenge of challenges) {

            //create HTML + CSS
            const button = createDownloadButton("Download");

            //assign action to button
            button.addEventListener('click', () => assignCaptureType(challenge));

            //inject to webpage
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




// Main initialization
initialize();


chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        // listen for messages sent from background.js

        const action = request.request;
        
        switch(action)
        {
            case ACTIONS.RECEIVE.CHANGE_THEME:
                const theme = request.theme;
                updateTheme(theme);
                break;
            case ACTIONS.RECEIVE.CHANGE_ROUTE:
                initialize();
                break;

            default:
                console.log('Content Action Not Match With ' + action);
                break;
        }
    }
);




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
