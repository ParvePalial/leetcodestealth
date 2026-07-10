// LeetCode Difficulty Hider - Content Script

let isHidden = true;

// Initialize from storage
chrome.storage.sync.get(['difficultyHidden'], (result) => {
  isHidden = result.difficultyHidden !== undefined ? result.difficultyHidden : true;
  applyHiding();
  createToggleButton();
});

function hideDifficultyAndStats() {
  // Hide difficulty tags (Easy, Medium, Hard)
  const difficultyTags = document.querySelectorAll('div[class*="text-difficulty-"]');
  difficultyTags.forEach(tag => {
    if (tag.textContent.trim().match(/^(Easy|Medium|Hard|\d+)$/)) {
      tag.style.display = 'none';
    }
  });

  // Hide acceptance rate and accepted stats
  const statsContainers = document.querySelectorAll('div.flex.flex-wrap.items-center.gap-4');
  statsContainers.forEach(container => {
    const text = container.textContent;
    if (text.includes('Accepted') || text.includes('Acceptance Rate')) {
      container.style.display = 'none';
    }
  });

  // --- GeeksforGeeks Hiding ---
  // Hide difficulty badges (e.g., <strong>Hard</strong> adjacent to problem header)
  document.querySelectorAll('strong').forEach(strong => {
    if (strong.textContent.trim().match(/^(School|Basic|Easy|Medium|Hard)$/)) {
      const parent = strong.parentElement;
      if (parent && (
        parent.querySelector('div[class*="problems_header_content"]') ||
        parent.querySelector('div[class*="problems_header_description"]') ||
        strong.closest('div[class*="problems_header"]')
      )) {
        strong.style.display = 'none';
      }
    }
  });

  // Hide the "Difficulty: " label span inside description
  document.querySelectorAll('span').forEach(span => {
    if (span.textContent.trim().startsWith('Difficulty:')) {
      const parent = span.closest('div[class*="problems_header_description"]') || span.parentElement;
      if (parent && (
        parent.classList.toString().includes('problems_header_description') ||
        parent.querySelector('span[class*="problems_label"]') ||
        parent.textContent.includes('Accuracy:')
      )) {
        span.style.display = 'none';
      }
    }
  });
}

function showDifficultyAndStats() {
  // Show difficulty tags
  const difficultyTags = document.querySelectorAll('div[class*="text-difficulty-"]');
  difficultyTags.forEach(tag => {
    if (strong.textContent.trim().match(/^(School|Basic|Easy|Medium|Hard)$/)) {
      tag.style.display = '';
    }
  });

  // Show acceptance rate and accepted stats
  const statsContainers = document.querySelectorAll('div.flex.flex-wrap.items-center.gap-4');
  statsContainers.forEach(container => {
    const text = container.textContent;
    if (text.includes('Accepted') || text.includes('Acceptance Rate')) {
      container.style.display = '';
    }
  });

  // --- GeeksforGeeks Showing ---
  document.querySelectorAll('strong').forEach(strong => {
    if (strong.textContent.trim().match(/^(School|Basic|Easy|Medium|Hard)$/)) {
      const parent = strong.parentElement;
      if (parent && (
        parent.querySelector('div[class*="problems_header_content"]') ||
        parent.querySelector('div[class*="problems_header_description"]') ||
        strong.closest('div[class*="problems_header"]')
      )) {
        strong.style.display = '';
      }
    }
  });

  document.querySelectorAll('span').forEach(span => {
    if (span.textContent.trim().startsWith('Difficulty:')) {
      const parent = span.closest('div[class*="problems_header_description"]') || span.parentElement;
      if (parent && (
        parent.classList.toString().includes('problems_header_description') ||
        parent.querySelector('span[class*="problems_label"]') ||
        parent.textContent.includes('Accuracy:')
      )) {
        span.style.display = '';
      }
    }
  });
}

function applyHiding() {
  if (isHidden) {
    hideDifficultyAndStats();
  } else {
    showDifficultyAndStats();
  }
}

function createToggleButton() {
  // Remove existing button if any
  const existingButton = document.getElementById('lc-difficulty-toggle');
  if (existingButton) {
    existingButton.remove();
  }

  const button = document.createElement('button');
  button.id = 'lc-difficulty-toggle';
  button.className = 'lc-toggle-btn';
  button.textContent = isHidden ? '👁️ Show Difficulty' : '🙈 Hide Difficulty';
  button.title = isHidden ? 'Click to show difficulty and stats' : 'Click to hide difficulty and stats';
  
  button.addEventListener('click', () => {
    isHidden = !isHidden;
    chrome.storage.sync.set({ difficultyHidden: isHidden });
    button.textContent = isHidden ? '👁️ Show Difficulty' : '🙈 Hide Difficulty';
    button.title = isHidden ? 'Click to show difficulty and stats' : 'Click to hide difficulty and stats';
    applyHiding();
  });

  // Add button to the page (try multiple locations)
  const insertButton = () => {
    const navbar = document.querySelector('nav') || document.querySelector('[role="navigation"]');
    if (navbar) {
      navbar.appendChild(button);
      return true;
    }
    
    const header = document.querySelector('header');
    if (header) {
      header.appendChild(button);
      return true;
    }
    
    // Fallback: add to body
    document.body.appendChild(button);
    return true;
  };

  insertButton();
}

// Watch for submission success and auto-enable hiding
function watchForAcceptedSubmission() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) { // Element node
          const text = node.textContent || '';
          
          // Check for "Accepted" success message
          if (text.includes('Accepted') && 
              (text.includes('Success') || node.className.includes('success') || 
               node.querySelector('[class*="success"]'))) {
            
            // Auto-enable hiding when solution is accepted
            if (!isHidden) {
              isHidden = true;
              chrome.storage.sync.set({ difficultyHidden: true });
              applyHiding();
              
              const toggleBtn = document.getElementById('lc-difficulty-toggle');
              if (toggleBtn) {
                toggleBtn.textContent = '👁️ Show Difficulty';
                toggleBtn.title = 'Click to show difficulty and stats';
              }
            }
          }
        }
      });
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// Watch for dynamic content changes
const contentObserver = new MutationObserver(() => {
  applyHiding();
});

contentObserver.observe(document.body, {
  childList: true,
  subtree: true
});

// Initialize
watchForAcceptedSubmission();

// Re-apply on navigation (SPA behavior)
let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    setTimeout(() => {
      applyHiding();
      createToggleButton();
    }, 500);
  }
}).observe(document, { subtree: true, childList: true });
