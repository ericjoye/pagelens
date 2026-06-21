# PageLens — Chrome Web Store Listing

## Extension Name

**PageLens — One-Page Audit Tool**

## Short Description (132 chars max)

Comprehensive one-page audit: health score, SEO, accessibility, performance, security, and technology detection.

## Long Description

PageLens is a comprehensive one-page audit tool that provides 7 analysis categories with health scoring, technology detection, and JSON export. Click the PageLens icon on any webpage to get an instant, actionable audit covering performance, SEO, accessibility, technology, security, and links — all in one clean interface.

**HEALTH SCORE**
PageLens starts with an overall health score (0-100) so you can quickly assess any page. The score starts at 100 and deducts points for every issue found across all categories. A quick stats grid shows page weight, request count, and key metrics at a glance.

**7 ANALYSIS CATEGORIES**
- **Performance** — page weight, request count, resource breakdown, timing metrics
- **SEO** — title/description validation, heading structure, image alt text audit, canonical/robots
- **Accessibility** — missing alt text, form labels, heading hierarchy, buttons without text, skip links, lang attribute
- **Technology** — detects 28 technologies including React, Vue, Angular, jQuery, WordPress, Shopify, and more
- **Security** — HTTPS check, mixed content, insecure forms, security headers
- **Links** — total/internal/external/nofollow/new-tab counts with full listing
- **Overview** — overall health score, quick stats, top issues summary

**JSON EXPORT**
Export the full audit as structured JSON for integration with CI/CD pipelines, reporting dashboards, or further analysis. Every data point is included — scores, issues, metrics, and raw data.

**ZERO DEPENDENCIES**
PageLens is pure vanilla JavaScript with zero external dependencies. It runs entirely in your browser via Manifest V3 content script injection. No data is sent to external servers.

## Key Features

- **Health score (0-100)** — instant page quality assessment
- **7 analysis categories** — performance, SEO, accessibility, technology, security, links, overview
- **Technology detection** — identifies 28+ frameworks and platforms
- **JSON export** — full audit data for CI/CD and reporting
- **Zero dependencies** — pure vanilla JavaScript
- **Manifest V3** — fully compatible with latest Chrome standard
- **Privacy-first** — all processing is local, no tracking

## Installation

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode** (toggle in the top-right corner)
3. Click **Load unpacked**
4. Select the `pagelens/` directory
5. The PageLens icon appears in your toolbar

## Requirements

- Chrome 88+ (Manifest V3 support)
- No additional dependencies

## Support

- **Contact:** eric@ericjoye.com
- **GitHub:** https://github.com/ericjoye/pagelens
- **Issues:** https://github.com/ericjoye/pagelens/issues
- **License:** MIT

## Keywords

page audit, SEO, accessibility, performance, security, health score, technology detection, web audit, page analysis, chrome extension, developer tools, web performance, SEO audit, accessibility audit
