# Privacy Policy — PageLens

**Last updated:** June 20, 2026

## Overview

PageLens ("we", "our", "the extension") is a Chrome extension that provides comprehensive one-page audits including performance, SEO, accessibility, technology detection, security, and link analysis.

## Data Collection

**PageLens does NOT collect, store, or transmit any personal data.**

All analysis happens locally in your browser. When you use PageLens:

- **No data is sent to external servers.** Page analysis is performed entirely within your browser using content scripts. Nothing is uploaded anywhere.
- **No tracking or analytics.** We do not use Google Analytics, Mixpanel, or any other tracking service.
- **No cookies.** PageLens does not set or read any cookies.
- **No account required.** There is no signup, login, or user account system.

## Permissions

PageLens requests the following Chrome permissions:

- **activeTab** — To access the currently active tab when you click the extension icon. Used only to analyze the page you're viewing.
- **scripting** — To inject content scripts that perform page analysis.
- **storage** — To save your preferences locally in your browser via `chrome.storage.local`. This data never leaves your device.

## Host Permissions

PageLens requests `<all_urls>` access because it needs to analyze any webpage you choose. This permission is used solely for local analysis — no data is transmitted externally.

## How It Works

When you click the PageLens icon on a webpage, the extension:

1. Injects a content script into the active page.
2. Analyzes the page's DOM, meta tags, links, resources, and security headers.
3. Computes a health score and categorizes findings.
4. Displays the results in the popup UI.

No data is stored, logged, or transmitted at any point.

## Third-Party Services

PageLens does not integrate with any third-party services.

## Changes to This Policy

We may update this privacy policy from time to time. Any changes will be reflected in the extension's listing on the Chrome Web Store and in the extension's source code.

## Contact

If you have questions about this privacy policy, contact us at: [YOUR EMAIL ADDRESS]
