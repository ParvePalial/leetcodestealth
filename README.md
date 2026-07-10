# LeetCode Difficulty Hider

A Chrome extension that hides difficulty tags (Easy, Medium, Hard) and acceptance rates on LeetCode problems.

## Features

- 🙈 Automatically hides difficulty tags and acceptance statistics
- 👁️ Toggle button to show/hide on demand
- ✅ Automatically re-hides when you submit an accepted solution
- 💾 Remembers your preference across sessions
- ⚡ Works with LeetCode's dynamic content loading

## Installation

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top-right corner)
4. Click "Load unpacked"
5. Select the `leetcode-difficulty-hider` folder
6. The extension is now installed!

## Usage

1. Navigate to any LeetCode problem (e.g., `https://leetcode.com/problems/two-sum/`)
2. The difficulty tag and acceptance rate will be hidden by default
3. Click the floating button (bottom-right corner) to toggle visibility
4. When you submit an accepted solution, difficulty will auto-hide again

## How It Works

- Hides elements matching difficulty tag patterns
- Hides acceptance rate statistics
- Floating toggle button for manual control
- Watches for "Accepted" submission results to auto-enable hiding
- Persists your preference using Chrome storage

## Customization

You can modify the button position or styling by editing `styles.css`.

Enjoy distraction-free LeetCode grinding! 🚀
