# PageLens — One-Click Page Audit Tool

[![GitHub Pages](https://img.shields.io/badge/🌐-Live%20Landing-blue?style=flat-square&color=6366f1)](https://ericjoye.github.io/pagelens/)
[![Vercel Landing](https://img.shields.io/badge/▲-Vercel%20Mirror-000?style=flat-square)](https://pagelens-landing.vercel.app)
[![GitHub](https://img.shields.io/github/license/ericjoye/pagelens?style=flat-square&color=10b981)](LICENSE)
[![Buy on Polar](https://img.shields.io/badge/🛒-Buy%20%245.00-000?style=flat-square&logo=polar)](https://buy.polar.sh/f83cdc44-4137-45c0-b59d-26a06deeb144)

**Comprehensive one-page audit tool for any webpage.** Click the PageLens icon on any page to get health scoring (0-100), SEO, accessibility, technology detection, security, performance, and link analysis — all in one clean popup. Free + $5 donation checkout.

**[🌐 Live Landing](https://ericjoye.github.io/pagelens/)** · **[📖 Articles](https://ericjoye.github.io/pagelens/blog/)** · **[🛒 Buy $5](https://buy.polar.sh/f83cdc44-4137-45c0-b59d-26a06deeb144)** · **[🐛 Report Issue](https://github.com/ericjoye/pagelens/issues)**

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
