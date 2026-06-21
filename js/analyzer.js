// PageLens analyzer — content script with all page analysis logic
'use strict';

function safeUrl(url) {
  try { return new URL(url); } catch { return null; }
}

function analyzePage() {
  const doc = document;
  const perf = performance.getEntriesByType('navigation')[0] || {};
  const resources = performance.getEntriesByType('resource') || [];

  // ── Overview ──────────────────────────────────────────────────────────
  const overview = {
    url: location.href,
    hostname: (() => { try { return new URL(location.href).hostname; } catch { return 'unknown'; } })(),
    title: doc.title || '',
    lang: doc.documentElement.lang || '',
  };

  // ── Performance ───────────────────────────────────────────────────────
  const perfData = {
    totalSize: resources.reduce((sum, r) => sum + (r.transferSize || 0), 0),
    requestCount: resources.length,
    timing: {
      dns: perf.domainLookupEnd && perf.domainLookupStart ? Math.round(perf.domainLookupEnd - perf.domainLookupStart) : null,
      connect: perf.connectEnd && perf.connectStart ? Math.round(perf.connectEnd - perf.connectStart) : null,
      ttfb: perf.responseStart && perf.requestStart ? Math.round(perf.responseStart - perf.requestStart) : null,
      download: perf.responseEnd && perf.responseStart ? Math.round(perf.responseEnd - perf.responseStart) : null,
      dom: perf.domContentLoadedEventEnd && perf.domContentLoadedEventStart ? Math.round(perf.domContentLoadedEventEnd - perf.domContentLoadedEventStart) : null,
      fullyLoaded: perf.loadEventEnd && perf.loadEventStart ? Math.round(perf.loadEventEnd - perf.loadEventStart) : null,
    },
    resources: {
      scripts: resources.filter(r => r.initiatorType === 'script').length,
      css: resources.filter(r => r.initiatorType === 'css' || r.initiatorType === 'link').length,
      images: resources.filter(r => r.initiatorType === 'img').length,
      fonts: resources.filter(r => r.name.includes('.woff') || r.name.includes('.ttf') || r.name.includes('.eot')).length,
      other: 0,
    },
    domNodes: doc.querySelectorAll('*').length,
  };
  perfData.resources.other = perfData.requestCount - perfData.resources.scripts - perfData.resources.css - perfData.resources.images - perfData.resources.fonts;

  // ── SEO ───────────────────────────────────────────────────────────────
  const seo = {
    title: doc.title || '',
    titleLength: doc.title ? doc.title.length : 0,
    description: '',
    descriptionLength: 0,
    headingStructure: { h1: 0, h2: 0, h3: 0, h4: 0, h5: 0, h6: 0 },
    h1Count: 0,
    imagesWithoutAlt: 0,
    totalImages: doc.querySelectorAll('img').length,
    canonical: '',
    robots: '',
    hasCanonical: false,
    hasRobots: false,
  };

  const descTag = doc.querySelector('meta[name="description"]');
  if (descTag) {
    seo.description = descTag.getAttribute('content') || '';
    seo.descriptionLength = seo.description.length;
  }

  for (let i = 1; i <= 6; i++) {
    const count = doc.querySelectorAll(`h${i}`).length;
    seo.headingStructure[`h${i}`] = count;
  }
  seo.h1Count = seo.headingStructure.h1;

  doc.querySelectorAll('img').forEach(img => {
    if (!img.getAttribute('alt')) seo.imagesWithoutAlt++;
  });

  const canonical = doc.querySelector('link[rel="canonical"]');
  if (canonical) {
    seo.canonical = canonical.getAttribute('href') || '';
    seo.hasCanonical = true;
  }

  const robots = doc.querySelector('meta[name="robots"]');
  if (robots) {
    seo.robots = robots.getAttribute('content') || '';
    seo.hasRobots = true;
  }

  // ── Accessibility ─────────────────────────────────────────────────────
  const a11y = {
    imagesWithoutAlt: seo.imagesWithoutAlt,
    totalImages: seo.totalImages,
    missingFormLabels: 0,
    headingIssues: [],
    buttonsWithoutText: 0,
    hasSkipLinks: false,
    hasLang: !!seo.lang,
  };

  // Check form labels
  doc.querySelectorAll('input, select, textarea').forEach(input => {
    const id = input.getAttribute('id');
    const ariaLabel = input.getAttribute('aria-label');
    const ariaLabelledBy = input.getAttribute('aria-labelledby');
    const title = input.getAttribute('title');
    const hasLabel = (id && doc.querySelector(`label[for="${id}"]`)) || ariaLabel || ariaLabelledBy || title;
    if (!hasLabel && input.type !== 'hidden') a11y.missingFormLabels++;
  });

  // Heading hierarchy issues
  if (seo.h1Count === 0) a11y.headingIssues.push('Missing H1');
  else if (seo.h1Count > 1) a11y.headingIssues.push(`Multiple H1s (${seo.h1Count})`);

  let prevLevel = 0;
  doc.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(h => {
    const level = parseInt(h.tagName[1]);
    if (level > prevLevel + 1) {
      a11y.headingIssues.push(`Skipped heading level: H${prevLevel} → H${level}`);
    }
    prevLevel = level;
  });

  // Buttons without text
  doc.querySelectorAll('button').forEach(btn => {
    const text = btn.textContent.trim();
    const ariaLabel = btn.getAttribute('aria-label');
    if (!text && !ariaLabel) a11y.buttonsWithoutText++;
  });

  // Skip links
  doc.querySelectorAll('a[href^="#"]').forEach(a => {
    if (a.textContent.toLowerCase().includes('skip') || a.textContent.toLowerCase().includes('main')) {
      a11y.hasSkipLinks = true;
    }
  });

  // ── Technology Detection ──────────────────────────────────────────────
  const tech = {
    detected: [],
    all: [],
  };

  const signatures = [
    { name: 'React', test: () => !!window.__REACT_DEVTOOLS_GLOBAL_HOOK__ || !!doc.querySelector('[data-reactroot]') || (window.React && window.React.version) },
    { name: 'Vue', test: () => !!doc.querySelector('[data-v-]') || !!window.__VUE__ || (window.Vue && window.Vue.version) },
    { name: 'Angular', test: () => !!doc.querySelector('[ng-app]') || !!window.ng || (window.angular && window.angular.version) },
    { name: 'jQuery', test: () => !!window.jQuery || !!window.$ },
    { name: 'Svelte', test: () => !!doc.querySelector('[svelte]') || !!window.__svelte },
    { name: 'Next.js', test: () => !!window.__NEXT_DATA__ || !!doc.querySelector('#__next') },
    { name: 'Nuxt', test: () => !!window.__NUXT__ || !!doc.querySelector('#__nuxt') },
    { name: 'Gatsby', test: () => !!doc.querySelector('[data-reactroot]') || !!window.__GATSBY },
    { name: 'WordPress', test: () => !!doc.querySelector('link[href*="wp-content"]') || !!window.wp },
    { name: 'Shopify', test: () => !!window.Shopify || !!doc.querySelector('link[href*="cdn.shopify.com"]') },
    { name: 'Bootstrap', test: () => !!doc.querySelector('.container, .row, .col-') || !!window.bootstrap },
    { name: 'Tailwind', test: () => !!doc.querySelector('[class*="tw-"], [class*="md:"], [class*="lg:"]') || (doc.querySelector('style') && doc.querySelector('style').textContent.includes('tailwind')) },
    { name: 'Material UI', test: () => !!doc.querySelector('[class*="Mui"]') || !!window.MaterialUI },
    { name: 'Google Analytics', test: () => !!window.ga || !!window.gtag || !!doc.querySelector('script[src*="google-analytics.com"]') || !!doc.querySelector('script[src*="gtag"]') },
    { name: 'Google Tag Manager', test: () => !!window.google_tag_manager || !!doc.querySelector('script[src*="googletagmanager.com"]') },
    { name: 'Hotjar', test: () => !!window.hj || !!doc.querySelector('script[src*="hotjar.com"]') },
    { name: 'Intercom', test: () => !!window.Intercom || !!doc.querySelector('script[src*="intercom"]') },
    { name: 'Segment', test: () => !!window.analytics || !!doc.querySelector('script[src*="segment.com"]') },
    { name: 'Cloudflare', test: () => !!doc.querySelector('meta[name="cf-railgun"]') },
    { name: 'Google Fonts', test: () => !!doc.querySelector('link[href*="fonts.googleapis.com"]') },
    { name: 'Stripe', test: () => !!window.Stripe || !!doc.querySelector('script[src*="js.stripe.com"]') },
    { name: 'HubSpot', test: () => !!window._hsq || !!doc.querySelector('script[src*="hs-scripts.com"]') },
    { name: 'Sentry', test: () => !!window.Sentry || !!doc.querySelector('script[src*="sentry.io"]') },
    { name: 'Webpack', test: () => !!window.webpackJsonp || !!window.__webpack_modules__ },
    { name: 'Vite', test: () => !!doc.querySelector('script[type="module"]') && (doc.querySelector('script[src*="vite"]') || !!window.__VITE__) },
    { name: 'Jekyll', test: () => !!doc.querySelector('meta[name="generator"][content*="Jekyll"]') },
    { name: 'Hugo', test: () => !!doc.querySelector('meta[name="generator"][content*="Hugo"]') },
    { name: 'Drupal', test: () => !!window.Drupal || !!doc.querySelector('link[href*="sites/default/files"]') },
    { name: 'Wix', test: () => !!doc.querySelector('script[src*="wix.com"]') || !!window.wixBiSession },
  ];

  signatures.forEach(sig => {
    try {
      if (sig.test()) tech.detected.push(sig.name);
    } catch {}
  });
  tech.all = signatures.map(s => s.name);

  // ── Security ──────────────────────────────────────────────────────────
  const security = {
    https: location.protocol === 'https:',
    mixedContent: false,
    insecureForms: [],
    securityHeaders: {
      hasCSP: false,
      hasXFrameOptions: false,
      hasHSTS: false,
    },
  };

  // Check mixed content
  if (security.https) {
    doc.querySelectorAll('img, script, link, iframe, video, audio').forEach(el => {
      const src = el.getAttribute('src') || el.getAttribute('href') || '';
      if (src.startsWith('http:')) security.mixedContent = true;
    });
  }

  // Insecure forms
  doc.querySelectorAll('form').forEach(form => {
    const action = form.getAttribute('action') || '';
    if (action.startsWith('http:') || (!security.https && action)) {
      security.insecureForms.push(action || '(empty action)');
    }
  });

  // Check meta-based security indicators
  const csp = doc.querySelector('meta[http-equiv="Content-Security-Policy"]');
  if (csp) security.securityHeaders.hasCSP = true;

  const xframe = doc.querySelector('meta[http-equiv="X-Frame-Options"]');
  if (xframe) security.securityHeaders.hasXFrameOptions = true;

  // ── Links ─────────────────────────────────────────────────────────────
  const links = {
    total: 0,
    internal: 0,
    external: 0,
    noFollow: 0,
    newTab: 0,
    items: [],
  };

  const hostname = overview.hostname;
  doc.querySelectorAll('a[href]').forEach(a => {
    const href = a.getAttribute('href') || '';
    const rel = (a.getAttribute('rel') || '').toLowerCase();
    const target = a.getAttribute('target') || '';

    if (href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('mailto:') || href.startsWith('tel:')) return;

    links.total++;
    if (rel.includes('nofollow')) links.noFollow++;
    if (target === '_blank') links.newTab++;

    let isExternal = false;
    if (href.startsWith('http')) {
      try {
        const linkUrl = new URL(href);
        isExternal = linkUrl.hostname !== hostname;
      } catch {}
    }

    if (isExternal) links.external++;
    else links.internal++;

    if (links.items.length < 100) {
      links.items.push({
        href: href.substring(0, 200),
        text: a.textContent.trim().substring(0, 80),
        external: isExternal,
        noFollow: rel.includes('nofollow'),
      });
    }
  });

  // ── Health Score ──────────────────────────────────────────────────────
  let score = 100;
  const deductions = [];

  if (!seo.title || seo.titleLength < 10) { score -= 15; deductions.push('Missing/poor title'); }
  if (!seo.description) { score -= 10; deductions.push('Missing meta description'); }
  if (seo.h1Count === 0) { score -= 15; deductions.push('Missing H1'); }
  if (seo.h1Count > 1) { score -= 5; deductions.push('Multiple H1s'); }
  if (seo.imagesWithoutAlt > 0) { score -= Math.min(10, seo.imagesWithoutAlt * 2); deductions.push(`${seo.imagesWithoutAlt} images missing alt`); }
  if (!security.https) { score -= 20; deductions.push('Not HTTPS'); }
  if (security.mixedContent) { score -= 10; deductions.push('Mixed content'); }
  if (a11y.missingFormLabels > 0) { score -= Math.min(10, a11y.missingFormLabels * 2); deductions.push(`${a11y.missingFormLabels} inputs missing labels`); }
  if (!a11y.hasLang) { score -= 5; deductions.push('Missing lang attribute'); }
  if (!seo.hasCanonical) { score -= 5; deductions.push('Missing canonical URL'); }

  score = Math.max(0, score);

  return {
    score,
    deductions,
    overview,
    performance: perfData,
    seo,
    accessibility: a11y,
    technology: tech,
    security,
    links,
  };
}

// No auto-run — analyzer.js is a library; popup.js injects via chrome.scripting.executeScript
