// import { ACTIONS, THEMES } from './constants.js';
const EXTENSION = {
    BADGE_COLOR: "#9688F1",
}

const ACTIONS = {
    UPDATE_BADGE: 'update_badge',
}

const THEMES = {
    DARK_MODE: 85,
}



const capture = function (div, options){
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

const init = function() {
    const challenges = document.querySelectorAll('.interactive-activity-container');
    const counter = challenges.length;
    if (counter !== 0) {

        // alert(challenges.length); // Debug
        updateBadgeMsg(counter);

        for (let i = 0; i < challenges.length; i++) {
            const button = document.createElement('button');
            button.textContent = 'SAVE';
            button.addEventListener('click', () => assignType(challenges[i]))
            challenges[i]?.querySelector('.activity-title-bar').appendChild(button);
        }
    } else {
        console.log('Element not found yet. Retrying...');
        setTimeout(init, 1000); // Check again after 3 seconds
    }

    applyTheme();
}

const assignType = function(div)
{
    let codeChalleng = div.querySelector('.ace-editor-container');
    
    if(codeChalleng)
    {
        return captureSourcecode(div);
    }
    else{
        return capture(div);
    }
}

// Bug with code challenges
const captureSourcecode = function(div) {
    let options = {};

    //Pre-handle code-editor
    let containerStyle = {};
    let editorStyle = {};
    let aceContainer = div.querySelector('.ace-editor-container');
    let aceEditor = div.querySelector('.ace-editor');

    //Full viewport
    containerStyle = {...aceContainer.style};
    editorStyle = {...aceEditor.style};
    
    //Calculate height
    let codeHeight = aceEditor.querySelector('.ace_scrollbar-v').scrollHeight;

    //Expand the editor
    aceEditor.style.height = `inherit`;
    aceContainer.style.height = `${codeHeight + 100}px `;

    //Reset Style
    const resetStyle = function()
    {
        aceEditor.style = editorStyle;
        aceContainer.style = containerStyle;
    }
    

    // MUST HAVE POP-UP LOADING TO PREVENT USER
    // [CODE HERE]

    // Check if the div has fully expanded
    const checkExpanded = setInterval(function() {
        let currentHeight = aceContainer.clientHeight;
        
        if (currentHeight > codeHeight) {
            clearInterval(checkExpanded); // Stop the loop
            capture(div); // Proceed with capturing content
            resetStyle();
        }
    }, 1000); // Check every 1 second
}

const applyDarkMode = function()
{
    document.documentElement.style.filter = document.documentElement.style.filter ? '' : `invert(${THEMES.DARK_MODE}%)`
}

applyDarkMode();
init();

// MESSAGE SECTION

// Send message to background script to update badge text
const updateBadgeMsg = function(text)
{
    chrome.runtime.sendMessage(
        { action: ACTIONS.UPDATE_BADGE, value: text}, 
        ( response ) => {
            console.log(response.message);
        }
    );
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
