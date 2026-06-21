# PageLens — Chrome Extension

Comprehensive one-page audit tool for any webpage. Provides 7 analysis categories with health scoring, technology detection, and JSON export.

## Features

- **Overview** — Overall health score (0-100), quick stats grid, top issues
- **Performance** — Page weight, request count, resource breakdown, timing metrics
- **SEO** — Title/description validation, heading structure, image alt text audit, canonical/robots
- **Accessibility** — Missing alt text, form labels, heading hierarchy, buttons without text, skip links, lang attribute
- **Technology** — Detects 28 technologies (React, Vue, Angular, jQuery, WordPress, Shopify, etc.)
- **Security** — HTTPS check, mixed content, insecure forms, security headers
- **Links** — Total/internal/external/nofollow/new-tab counts with full listing

## Install (Developer Mode)

1. Open Chrome → `chrome://extensions`
2. Enable "Developer mode" (top-right toggle)
3. Click "Load unpacked"
4. Select the `pagelens/` directory
5. The PageLens icon appears in your toolbar

## Usage

1. Navigate to any webpage
2. Click the PageLens toolbar icon
3. View the health score and browse analysis tabs
4. Click "Export JSON" to download a full report

## File Layout

```
pagelens/
├── manifest.json          # Chrome extension manifest (MV3)
├── background.js          # Service worker — message routing
├── popup.html             # Popup UI structure
├── css/popup.css          # Popup styles (dark header, card layout)
├── js/
│   ├── analyzer.js        # Content script — all page analysis logic
│   └── popup.js           # Popup interaction, tab rendering, export
├── icons/
│   ├── icon16.png         # 16x16 toolbar icon
│   ├── icon48.png         # 48x48 extensions page icon
│   └── icon128.png        # 128x128 Chrome Web Store icon
└── README.md              # This file
```

## Technical Notes

- Pure vanilla JavaScript — zero dependencies
- Manifest V3 compatible
- All URL parsing guarded with try/catch
- Content script injection via `chrome.scripting.executeScript`
- Health score: starts at 100, deducts for issues found
- Technology detection: 28 signatures via DOM/window attribute checks
