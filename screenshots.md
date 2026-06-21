# Screenshots — PageLens

**Product:** PageLens — Comprehensive one-page audit tool. 7 analysis categories with health scoring, technology detection, and JSON export.

**Type:** Chrome Extension (Manifest V3)

---

## Screenshot 1: Main Interface — Health Score Overview

**What to capture:** The extension popup showing the Overview tab with the overall health score, quick stats grid, and top issues.

**ASCII Mockup:**

```
┌─────────────────────────────────────────────┐
│  🔍 PageLens v1.0.0          [⚙] [📤]     │
├─────────────────────────────────────────────┤
│  [Overview] [Perf] [SEO] [A11y] [Tech]     │
│  [Security] [Links]                         │
├─────────────────────────────────────────────┤
│                                             │
│           ┌─────────────┐                   │
│           │             │                   │
│           │     78      │                   │
│           │   ─────     │                   │
│           │   Health    │                   │
│           │   Score     │                   │
│           └─────────────┘                   │
│                                             │
│  ┌──────────┬──────────┬──────────┐         │
│  │ 📄 2.3MB │ 🌐 47    │ ⚡ 1.2s  │         │
│  │ Page     │ Requests │ Load     │         │
│  │ Weight   │          │ Time     │         │
│  ├──────────┼──────────┼──────────┤         │
│  │ 🖼 12    │ 📝 3     │ 🔗 28    │         │
│  │ Images   │ Headings │ Links    │         │
│  ├──────────┼──────────┼──────────┤         │
│  │ ⚠️ 5     │ ❌ 3     │ ℹ️ 8     │         │
│  │ Warnings │ Errors   │ Info     │         │
│  └──────────┴──────────┴──────────┘         │
│                                             │
│  ── Top Issues ─────────────────────────    │
│  ❌ Missing alt text on 4 images            │
│  ❌ Meta description too short              │
│  ⚠️ 3 external links without rel="noopener" │
│  ⚠️ Page weight exceeds 2MB                 │
│  ℹ️ No preload hints for critical resources │
│                                             │
│  [📤 Export JSON]  [🔄 Re-scan]            │
└─────────────────────────────────────────────┘
```

---

## Screenshot 2: Key Feature — Technology Detection

**What to capture:** The Technology tab showing detected frameworks, libraries, and tools used on the page.

**ASCII Mockup:**

```
┌─────────────────────────────────────────────┐
│  🔍 PageLens v1.0.0          [⚙] [📤]     │
├─────────────────────────────────────────────┤
│  [Overview] [Perf] [SEO] [A11y] [Tech]     │
│  [Security] [Links]                         │
├─────────────────────────────────────────────┤
│                                             │
│  🔧 Detected Technologies (7)               │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │ ⚛️  React          v18.2.0          │    │
│  │    Detected via: window.React       │    │
│  ├─────────────────────────────────────┤    │
│  │ 📦 Webpack         v5.x             │    │
│  │    Detected via: __webpack_require__│    │
│  ├─────────────────────────────────────┤    │
│  │ 🎨 Tailwind CSS    v3.x             │    │
│  │    Detected via: DOM class patterns  │    │
│  ├─────────────────────────────────────┤    │
│  │ 📊 Google Analytics  GA4            │    │
│  │    Detected via: gtag script        │    │
│  ├─────────────────────────────────────┤    │
│  │ 🔍 Google Tag Manager               │    │
│  │    Detected via: gtm.js             │    │
│  ├─────────────────────────────────────┤    │
│  │ 💬 Intercom           Chat widget   │    │
│  │    Detected via: window.Intercom    │    │
│  ├─────────────────────────────────────┤    │
│  │ 🍪 Cookiebot          Consent mgr   │    │
│  │    Detected via: cookiebot DOM      │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  28 technologies scanned · 7 detected       │
└─────────────────────────────────────────────┘
```

---

## Screenshot 3: Performance Analysis

**What to capture:** the Performance tab showing page weight, request count, resource breakdown, and timing metrics.

**ASCII Mockup:**

```
┌─────────────────────────────────────────────┐
│  🔍 PageLens v1.0.0          [⚙] [📤]     │
├─────────────────────────────────────────────┤
│  [Overview] [Perf] [SEO] [A11y] [Tech]     │
│  [Security] [Links]                         │
├─────────────────────────────────────────────┤
│                                             │
│  ⚡ Performance Analysis                     │
│                                             │
│  ── Page Weight ────────────────────────     │
│  Total: 2.3 MB                              │
│  ┌─────────────────────────────────────┐    │
│  │ 🖼 Images    1.4 MB  ████████████ 61%│    │
│  │ 📜 JS        520 KB  █████     23%  │    │
│  │ 🎨 CSS       180 KB  ██        8%   │    │
│  │ 🔤 Fonts     120 KB  █         5%   │    │
│  │ 📄 HTML       80 KB  █         3%   │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ── Request Count ──────────────────────     │
│  Total: 47 requests                         │
│  ┌─────────────────────────────────────┐    │
│  │ 🖼 Images      18  ████████         │    │
│  │ 📜 Scripts     12  █████           │    │
│  │ 🎨 Stylesheets  8  ███             │    │
│  │ 🔤 Fonts        5  ██              │    │
│  │ 📡 XHR/Fetch    3  █               │    │
│  │ 📄 Documents    1  ▏               │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ── Timing ─────────────────────────────     │
│  DOM Content Loaded:    0.8s                │
│  Load Complete:         1.2s                │
│  First Contentful Paint: 0.4s               │
│  Largest Contentful Paint: 0.9s             │
│                                             │
│  ⚠️ 3 images over 200KB — consider compress │
└─────────────────────────────────────────────┘
```

---

## Screenshot 4: Links Analysis

**What to capture:** The Links tab showing total/internal/external/nofollow counts with a full listing.

**ASCII Mockup:**

```
┌─────────────────────────────────────────────┐
│  🔍 PageLens v1.0.0          [⚙] [📤]     │
├─────────────────────────────────────────────┤
│  [Overview] [Perf] [SEO] [A11y] [Tech]     │
│  [Security] [Links]                         │
├─────────────────────────────────────────────┤
│                                             │
│  🔗 Links Analysis                          │
│                                             │
│  ┌──────────┬──────────┬──────────┐         │
│  │ 🔗 28    │ 🏠 18    │ 🌐 10    │         │
│  │ Total    │ Internal │ External │         │
│  ├──────────┼──────────┼──────────┤         │
│  │ 🔖 4     │ ↗️ 6     │          │         │
│  │ Nofollow │ New Tab  │          │         │
│  └──────────┴──────────┴──────────┘         │
│                                             │
│  ── External Links ─────────────────────    │
│  ┌─────────────────────────────────────┐    │
│  │ 🌐 https://github.com/example       │    │
│  │    Text: "View on GitHub"           │    │
│  │    rel: noopener noreferrer         │    │
│  ├─────────────────────────────────────┤    │
│  │ 🌐 https://twitter.com/example      │    │
│  │    Text: "Follow us"                │    │
│  │    rel: noopener                   │    │
│  ├─────────────────────────────────────┤    │
│  │ 🌐 https://linkedin.com/company    │    │
│  │    Text: "LinkedIn"                 │    │
│  │    rel: (missing — ⚠️ warning)      │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ── Nofollow Links ─────────────────────    │
│  ┌─────────────────────────────────────┐    │
│  │ 🔖 https://sponsor.example.com      │    │
│  │ 🔖 https://affiliate.example.com    │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  [📤 Export JSON]  [📋 Copy Links]         │
└─────────────────────────────────────────────┘
```

---

## Notes for Actual Screenshots

1. **Health score circle** is the hero visual — make it large and prominent with a color gradient (green/yellow/red)
2. **Technology detection** is a unique feature — show recognizable logos/icons for React, Vue, etc.
3. **Performance bars** should use horizontal bar charts with percentage labels
4. **Links tab** should show the full URL list with rel attributes
5. **Use a real website** with mixed content (internal + external links, multiple resource types)
6. **Export JSON** button should be visible on every tab
7. **Dark header with tab navigation** matches the MetaScan style
8. **Extension icon** visible in toolbar
