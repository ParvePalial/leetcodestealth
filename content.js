// 1. Check storage and set initial state
chrome.storage.local.get(['stealthMode'], function(result) {
    // The magic logic: If the database is empty (first load), 
    // result.stealthMode is 'undefined'. 
    // Because 'undefined' is not 'false', isStealth becomes TRUE. Default is ON!
    let isStealth = result.stealthMode !== false; 
    
    toggleStealthClass(isStealth);
});

function toggleStealthClass(enable) {
    if (enable) {
        document.body.classList.add('stealth-enabled');
    } else {
        document.body.classList.remove('stealth-enabled');
    }
}

// 2. Listen for the manual override from your popup button
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "toggle") {
        toggleStealthClass(request.state);
    }
});