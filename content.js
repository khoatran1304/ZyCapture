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
        CHANGE_ROUTE: 'change_route',
        CHANGE_THEME: 'change_theme',
        CHANGE_BRIGHTNESS: 'change_brightness',
        CALL_SOLVER: 'call_solver'
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

function fetchTheme() {
    chrome.storage.sync.get('theme', (store) => {
        const theme =  store.theme || '';

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
    });
}

function fetchBrightness(){
    chrome.storage.sync.get('brightness', (store) => 
    {
        const brightness = store.brightness || 100;

        //use for body only, use for root will complict with invert()
        document.body.style.removeProperty('filter');
        document.body.style.setProperty('filter',`brightness(${brightness}%)`,'important');
    });
}


//Quiz Resolver
const delay = function(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}



const solver = async function () {
    const questions = document.querySelectorAll(".question-set-question");
    let i = 1;
    let total = questions.length;

    for (const question of questions) {
        // Send message to the popup
        chrome.runtime.sendMessage({ 
            action: "update_solver",
            message: `${i++}/${total}`
        });

        await solveQuestion(question);
    }   
}


// Initialization function
function initialize() {
    const challenges = document.querySelectorAll('.interactive-activity-container');
    const counter = challenges.length;

    //set brightness
    fetchTheme();
    fetchBrightness();

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

        console.log(action);
        
        switch(action)
        {
            case ACTIONS.RECEIVE.CHANGE_ROUTE:
                initialize();
                break;

            case ACTIONS.RECEIVE.CHANGE_THEME:
                fetchTheme();
                break;
            
            case ACTIONS.RECEIVE.CHANGE_BRIGHTNESS:
                fetchBrightness();
                break;
            
            case ACTIONS.RECEIVE.CALL_SOLVER:
                solver();
                break;

            default:
                console.log('Content Action Not Match With ' + action);
                initialize();
                break;
        }
    }
);


// -------------Problem Solving Scripts------------------
async function solveQuestion(question) 
{
    //debug
    console.log(question.classList);

    // Scroll to the current question element
    question.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Ignore the case checked
    const marker = question.querySelector('.zb-chevron');
    if(marker.classList.contains('check')) return;

    // category and solve
    question.classList.contains(problems.FILLOUT_CLASS) && await problems.fillOut(question);
    question.classList.contains(problems.MULTICHOICE_CLASS) && await problems.multiChoice(question);
}

const problems = 
{
    FILLOUT_CLASS: "short-answer-question",
    MULTICHOICE_CLASS: "multiple-choice-question",

    fillOut: async (question) => 
            {
                // Hidden explanation
                const explanation = question.querySelector(".zb-explanation");
                explanation.style.visibility = "hidden";

                // Show answer
                const showButton = question.querySelector(".show-answer-button");
                showButton.click();

                // Wait for a short delay before clicking again (simulate human-like behavior)
                await delay(1000);
                showButton.click();

                // Set answer after a short delay
                await delay(1000);
                const answerSpan = question.querySelector(".forfeit-answer");
                const answerInput = question.querySelector(".zb-text-area");
                const answerText = answerSpan.textContent.trim(); // Get the text content and remove leading/trailing whitespace
                answerInput.value = answerText;
                const inputEvent = new Event('input', { bubbles: true });
                answerInput.dispatchEvent(inputEvent);

                // Submit after a short delay
                await delay(1000);
                const checkButton = question.querySelector(".check-button");
                checkButton.click();

                // Show explanation
                explanation.style.visibility = "visible";
            },

    multiChoice: async (question) => 
            {
                const choices = question.querySelectorAll('input[type="radio"]');
                const result = document.querySelector('.zb-explanation');

                choices.forEach(async element => 
                {
                    element.click();

                    await delay(500);
                    
                    if(result.classList.contains('correct')) return;
                });
            } 
}


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
