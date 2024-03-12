// Function to check for the presence of the element
//Capture the content of the body
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
    if (challenges.length !== 0) {
        alert(challenges.length); // Debug
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



init();
