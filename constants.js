// constants.js

// Define constants
const ICONS = {
    "16": "images/icon16.png",
    "48": "images/icon48.png",
    "128": "images/icon128.png"
};
  
const HOST_PERMISSIONS = ["*://learn.zybooks.com/*"];
  
const EXTENSION = {
    BADGE_COLOR: "#9688F1",
}

const ACTIONS = {
    UPDATE_BADGE: 'update_badge',
}

const THEMES = {
    DARK_MODE: {
        header: {
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(29,30,33,.56)',
        },

        container: {
            backgroundColor: '#0d0d0e',
        },

        text: {
            primary: '#fff',
        }
    
    }
}


// Export constants if needed
  
export { ACTIONS, EXTENSION, THEMES };
  