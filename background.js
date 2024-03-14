// import { ACTIONS, EXTENSION } from './modules/constants.js';
console.log("background running");

const EXTENSION = {
    BADGE_COLOR: "#9688F1",
}

const ACTIONS = {
    UPDATE_BADGE: 'update_badge',
}

//Default
chrome.action.setBadgeText({text: '...'});
chrome.action.setBadgeBackgroundColor({color: EXTENSION.BADGE_COLOR});

//Functions
const updateBadge = function (text, color)
{
    chrome.action.setBadgeText({ text: text.toString() });
    color && chrome.action.setBadgeBackgroundColor({ color: color });
}


//Events
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => 
{
    if (request.action === ACTIONS.UPDATE_BADGE) {
        updateBadge(request.value, null);
        sendResponse({ message: "Badge updated successfully!" });
    }
});


