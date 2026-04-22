const btn = document.getElementById('toggleBtn');

// Set initial button look based on storage
chrome.storage.local.get(['stealthMode'], function(result) {
    let isStealth = result.stealthMode !== false;
    updateUI(isStealth);
});

// Handle Button Click
btn.addEventListener('click', () => {
    chrome.storage.local.get(['stealthMode'], function(result) {
        let isStealth = result.stealthMode !== false;
        let newState = !isStealth; // Flip the switch

        // Save to storage
        chrome.storage.local.set({ stealthMode: newState });
        updateUI(newState);

        // Tell the LeetCode page to update immediately
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, { action: "toggle", state: newState });
            }
        });
    });
});

function updateUI(isStealth) {
    btn.innerText = isStealth ? "Turn OFF" : "Turn ON";
    btn.className = isStealth ? "on" : "off";
}