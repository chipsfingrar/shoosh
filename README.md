# Shoosh

A Firefox browser extension that blocks annoying, attention-stealing content on YouTube.

## Features

Shoosh helps you maintain focus on YouTube by letting you control what distracts you:

- **Hide Shorts** — Removes Shorts shelves, items, and the sidebar entry. Automatically redirects `/shorts/` URLs to the normal video player.
- **Hide Recommendations** — Hides the recommended videos sidebar on watch pages.
- **Hide Comments** — Hides the comments section on watch pages.
- **Redirect Homepage** — Automatically redirects youtube.com to your subscriptions feed.
- **Theater Mode** — Automatically switches to theater mode on watch pages.

All settings are toggleable and can be toggled individually to suit your preferences.

## Installation

1. Clone or download this repository
2. Open Firefox and navigate to `about:debugging`
3. Click **This Firefox** (or **This Nightly** if using Firefox Nightly)
4. Click **Load Temporary Add-on**
5. Select any file from the Shoosh directory

For a permanent installation, you can package the extension as an `.xpi` file and distribute it.

## How It Works

Shoosh uses a content script that:
1. Reads your preferences from browser storage
2. Applies CSS rules to hide specified elements
3. Monitors the page for changes and reapplies rules as needed
4. Reacts to settings changes without requiring a page reload

## Development

### Project Structure

```
shoosh/
├── manifest.json          # Extension metadata and permissions
├── content/
│   └── youtube.js        # Content script that applies blocking rules
├── options/
│   ├── options.html      # Settings UI
│   ├── options.js        # Settings logic
│   └── options.css       # Settings styles
├── background/
│   └── background.js     # Background script
├── icons/                # Extension icons
├── assets/               # Design assets
└── package.sh            # Packaging script
```

### Building

To package the extension as an `.xpi` file:

```bash
./package.sh
```

This creates a `shoosh.xpi` file ready for distribution.

### Settings Schema

All settings are stored in the browser's sync storage under these keys:

- `youtube.hideShorts` (boolean, default: true)
- `youtube.hideRecommendations` (boolean, default: true)
- `youtube.hideComments` (boolean, default: true)
- `youtube.redirectHomepage` (boolean, default: true)
- `youtube.theaterMode` (boolean, default: false)

## Browser Support

- Firefox 109+

## License

See LICENSE file for details.
