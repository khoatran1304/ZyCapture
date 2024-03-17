// import { ACTIONS, EXTENSION } from './modules/constants.js';
console.log("background running");

const EXTENSION = {
    BADGE_COLOR: "#9688F1",
}

const ACTIONS = {
    UPDATE_BADGE: 'update_badge',
}

const DEFAULT_VALUES = {
    BADGE_WAIT: 0,
}

//Default
chrome.action.setBadgeText({text: DEFAULT_VALUES.BADGE_WAIT.toString() });
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



chrome.tabs.onUpdated.addListener(
    function (tabId, changeInfo, tab){
        if (changeInfo.url) {
            chrome.tabs.sendMessage( tabId, {
              message: 'Content.Refresh',
            //   url: changeInfo.url
            })
        }
    }
);

