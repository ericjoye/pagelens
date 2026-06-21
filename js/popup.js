// PageLens popup logic
'use strict';

let currentData = null;

// ── Tab Navigation ───────────────────────────────────────────────────────

document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');
  });
});

// ── Analyze Page ─────────────────────────────────────────────────────────

async function analyzePage() {
  document.querySelectorAll('.loading').forEach(el => el.classList.remove('hidden'));
  document.querySelectorAll('[id$="-content"]').forEach(el => el.classList.add('hidden'));

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) { showError('No active tab found'); return; }

    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: analyzePageInContext,
    });

    const data = results[0]?.result;
    if (!data) { showError('Could not analyze page'); return; }

    currentData = data;
    renderOverview(data);
    renderPerformance(data.performance);
    renderSEO(data.seo);
    renderAccessibility(data.accessibility);
    renderTechnology(data.technology);
    renderSecurity(data.security);
    renderLinks(data.links);
  } catch (err) {
    showError(`Error: ${err.message}`);
  }
}

function showError(msg) {
  document.querySelectorAll('.loading').forEach(el => el.textContent = msg);
}

// ── Render: Overview ─────────────────────────────────────────────────────

function renderOverview(data) {
  document.getElementById('overview-loading').classList.add('hidden');
  document.getElementById('overview-content').classList.remove('hidden');

  const score = data.score;
  const badge = document.getElementById('score-badge');
  document.getElementById('score-value').textContent = score;
  badge.textContent = score;
  badge.className = 'score-badge ' + (score >= 80 ? 'good' : score >= 50 ? 'ok' : 'bad');

  const stats = [
    { label: 'Requests', value: data.performance.requestCount },
    { label: 'Page Size', value: formatBytes(data.performance.totalSize) },
    { label: 'DOM Nodes', value: data.performance.domNodes },
    { label: 'Tech Found', value: data.technology.detected.length },
    { label: 'Links', value: data.links.total },
    { label: 'Issues', value: data.deductions.length },
  ];

  document.getElementById('quick-stats').innerHTML = stats.map(s =>
    `<div class="stat-item"><span class="stat-value">${s.value}</span><span class="stat-label">${s.label}</span></div>`
  ).join('');

  const issuesContainer = document.getElementById('top-issues');
  if (data.deductions.length === 0) {
    issuesContainer.innerHTML = '<p class="check-ok">No issues found!</p>';
  } else {
    issuesContainer.innerHTML = data.deductions.map(d =>
      `<div class="issue-item"><span class="check-fail">✗</span><span>${escapeHtml(d)}</span></div>`
    ).join('');
  }
}

// ── Render: Performance ──────────────────────────────────────────────────

function renderPerformance(perf) {
  document.getElementById('perf-loading').classList.add('hidden');
  document.getElementById('perf-content').classList.remove('hidden');

  const timingRows = [
    ['DNS Lookup', perf.timing.dns],
    ['Connection', perf.timing.connect],
    ['TTFB', perf.timing.ttfb],
    ['Download', perf.timing.download],
    ['DOM Processing', perf.timing.dom],
    ['Fully Loaded', perf.timing.fullyLoaded],
  ];

  let html = '<div class="card"><h3>Timing</h3>';
  timingRows.forEach(([label, value]) => {
    html += `<div class="metric-row"><span class="metric-label">${label}</span><span class="metric-value">${value !== null ? value + 'ms' : 'N/A'}</span></div>`;
  });
  html += '</div>';

  html += '<div class="card"><h3>Resources</h3>';
  html += `<div class="metric-row"><span class="metric-label">Total Requests</span><span class="metric-value">${perf.requestCount}</span></div>`;
  html += `<div class="metric-row"><span class="metric-label">Total Size</span><span class="metric-value">${formatBytes(perf.totalSize)}</span></div>`;
  html += `<div class="metric-row"><span class="metric-label">Scripts</span><span class="metric-value">${perf.resources.scripts}</span></div>`;
  html += `<div class="metric-row"><span class="metric-label">CSS</span><span class="metric-value">${perf.resources.css}</span></div>`;
  html += `<div class="metric-row"><span class="metric-label">Images</span><span class="metric-value">${perf.resources.images}</span></div>`;
  html += `<div class="metric-row"><span class="metric-label">Fonts</span><span class="metric-value">${perf.resources.fonts}</span></div>`;
  html += `<div class="metric-row"><span class="metric-label">DOM Nodes</span><span class="metric-value">${perf.domNodes}</span></div>`;
  html += '</div>';

  document.getElementById('perf-content').innerHTML = html;
}

// ── Render: SEO ──────────────────────────────────────────────────────────

function renderSEO(seo) {
  document.getElementById('seo-loading').classList.add('hidden');
  document.getElementById('seo-content').classList.remove('hidden');

  let html = '<div class="card"><h3>Title</h3>';
  html += `<p class="${seo.titleLength >= 10 && seo.titleLength <= 60 ? 'check-ok' : 'check-warn'}">${escapeHtml(seo.title || 'Missing')} (${seo.titleLength} chars)</p></div>`;

  html += '<div class="card"><h3>Description</h3>';
  html += `<p class="${seo.descriptionLength >= 50 && seo.descriptionLength <= 160 ? 'check-ok' : 'check-warn'}">${escapeHtml(seo.description || 'Missing')} (${seo.descriptionLength} chars)</p></div>`;

  html += '<div class="card"><h3>Heading Structure</h3>';
  Object.entries(seo.headingStructure).forEach(([h, count]) => {
    const isProblem = h === 'h1' && (count === 0 || count > 1);
    html += `<div class="metric-row"><span class="metric-label">${h.toUpperCase()}</span><span class="metric-value ${isProblem ? 'check-fail' : ''}">${count}</span></div>`;
  });
  html += '</div>';

  html += '<div class="card"><h3>Images</h3>';
  html += `<div class="metric-row"><span class="metric-label">Total</span><span class="metric-value">${seo.totalImages}</span></div>`;
  html += `<div class="metric-row"><span class="metric-label">Missing Alt</span><span class="metric-value ${seo.imagesWithoutAlt > 0 ? 'check-fail' : 'check-ok'}">${seo.imagesWithoutAlt}</span></div></div>`;

  html += '<div class="card"><h3>Other</h3>';
  html += `<div class="metric-row"><span class="metric-label">Canonical</span><span class="metric-value">${seo.hasCanonical ? '<span class="check-ok">Yes</span>' : '<span class="check-fail">No</span>'}</span></div>`;
  html += `<div class="metric-row"><span class="metric-label">Robots</span><span class="metric-value">${seo.hasRobots ? '<span class="check-ok">Yes</span>' : '<span class="check-warn">No</span>'}</span></div></div>`;

  document.getElementById('seo-content').innerHTML = html;
}

// ── Render: Accessibility ────────────────────────────────────────────────

function renderAccessibility(a11y) {
  document.getElementById('a11y-loading').classList.add('hidden');
  document.getElementById('a11y-content').classList.remove('hidden');

  let html = '<div class="card"><h3>Checks</h3>';
  html += checkRow('Images with alt text', a11y.imagesWithoutAlt === 0, `${a11y.imagesWithoutAlt}/${a11y.totalImages} missing`);
  html += checkRow('Form labels', a11y.missingFormLabels === 0, `${a11y.missingFormLabels} missing`);
  html += checkRow('Heading hierarchy', a11y.headingIssues.length === 0, a11y.headingIssues.join(', ') || 'OK');
  html += checkRow('Buttons with text', a11y.buttonsWithoutText === 0, `${a11y.buttonsWithoutText} without text`);
  html += checkRow('Skip links', a11y.hasSkipLinks, a11y.hasSkipLinks ? 'Found' : 'Not found');
  html += checkRow('Lang attribute', a11y.hasLang, a11y.hasLang ? 'Present' : 'Missing');
  html += '</div>';

  if (a11y.headingIssues.length > 0) {
    html += '<div class="card"><h3>Heading Issues</h3>';
    a11y.headingIssues.forEach(issue => {
      html += `<div class="issue-item"><span class="check-fail">✗</span><span>${escapeHtml(issue)}</span></div>`;
    });
    html += '</div>';
  }

  document.getElementById('a11y-content').innerHTML = html;
}

function checkRow(label, pass, detail) {
  return `<div class="metric-row"><span class="metric-label">${label}</span><span class="metric-value ${pass ? 'check-ok' : 'check-fail'}">${pass ? '✓' : '✗'} ${detail}</span></div>`;
}

// ── Render: Technology ───────────────────────────────────────────────────

function renderTechnology(tech) {
  document.getElementById('tech-loading').classList.add('hidden');
  document.getElementById('tech-content').classList.remove('hidden');

  let html = '<div class="card"><h3>Detected Technologies</h3>';
  if (tech.detected.length === 0) {
    html += '<p style="color:#6b7280;font-size:11px">No technologies detected</p>';
  } else {
    html += '<div class="tech-tags">';
    tech.detected.forEach(name => { html += `<span class="tech-tag detected">${escapeHtml(name)}</span>`; });
    html += '</div>';
  }
  html += '</div>';

  html += '<div class="card"><h3>All Signatures Scanned</h3>';
  html += '<div class="tech-tags">';
  tech.all.forEach(name => {
    const isDetected = tech.detected.includes(name);
    html += `<span class="tech-tag ${isDetected ? 'detected' : ''}">${escapeHtml(name)}</span>`;
  });
  html += '</div></div>';

  document.getElementById('tech-content').innerHTML = html;
}

// ── Render: Security ─────────────────────────────────────────────────────

function renderSecurity(sec) {
  document.getElementById('security-loading').classList.add('hidden');
  document.getElementById('security-content').classList.remove('hidden');

  let html = '<div class="card"><h3>Connection</h3>';
  html += `<div class="metric-row"><span class="metric-label">HTTPS</span><span class="metric-value ${sec.https ? 'check-ok' : 'check-fail'}">${sec.https ? '✓ Secure' : '✗ Not secure'}</span></div>`;
  html += `<div class="metric-row"><span class="metric-label">Mixed Content</span><span class="metric-value ${!sec.mixedContent ? 'check-ok' : 'check-fail'}">${sec.mixedContent ? '✗ Found' : '✓ None'}</span></div></div>`;

  html += '<div class="card"><h3>Security Headers (Meta)</h3>';
  html += '<p class="check-warn" style="font-size:10px;margin-bottom:6px">HSTS is an HTTP header and cannot be detected from a content script.</p>';
  html += `<div class="metric-row"><span class="metric-label">CSP</span><span class="metric-value ${sec.securityHeaders.hasCSP ? 'check-ok' : 'check-warn'}">${sec.securityHeaders.hasCSP ? '✓ Present' : '⚠ Not found'}</span></div>`;
  html += `<div class="metric-row"><span class="metric-label">X-Frame-Options</span><span class="metric-value ${sec.securityHeaders.hasXFrameOptions ? 'check-ok' : 'check-warn'}">${sec.securityHeaders.hasXFrameOptions ? '✓ Present' : '⚠ Not found'}</span></div></div>`;

  if (sec.insecureForms.length > 0) {
    html += '<div class="card"><h3>Insecure Forms</h3>';
    sec.insecureForms.forEach(action => { html += `<p class="check-fail">✗ ${escapeHtml(action)}</p>`; });
    html += '</div>';
  }

  document.getElementById('security-content').innerHTML = html;
}

// ── Render: Links ────────────────────────────────────────────────────────

function renderLinks(links) {
  document.getElementById('links-loading').classList.add('hidden');
  document.getElementById('links-content').classList.remove('hidden');

  let html = '<div class="card"><h3>Summary</h3>';
  html += `<div class="metric-row"><span class="metric-label">Total</span><span class="metric-value">${links.total}</span></div>`;
  html += `<div class="metric-row"><span class="metric-label">Internal</span><span class="metric-value">${links.internal}</span></div>`;
  html += `<div class="metric-row"><span class="metric-label">External</span><span class="metric-value">${links.external}</span></div>`;
  html += `<div class="metric-row"><span class="metric-label">NoFollow</span><span class="metric-value">${links.noFollow}</span></div>`;
  html += `<div class="metric-row"><span class="metric-label">New Tab</span><span class="metric-value">${links.newTab}</span></div></div>`;

  if (links.items.length > 0) {
    html += '<div class="card"><h3>Link List (first 100)</h3>';
    links.items.forEach(link => {
      const classes = ['link-item'];
      if (link.external) classes.push('external');
      if (link.noFollow) classes.push('nofollow');
      html += `<div class="${classes.join(' ')}">`;
      html += `<span class="link-href">${escapeHtml(link.href)}</span>`;
      if (link.text) html += ` — <span class="link-text">${escapeHtml(link.text)}</span>`;
      html += '</div>';
    });
    html += '</div>';
  }

  document.getElementById('links-content').innerHTML = html;
}

// ── Export: JSON ─────────────────────────────────────────────────────────

document.getElementById('export-json-btn').addEventListener('click', () => {
  if (!currentData) return;
  const json = JSON.stringify(currentData, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  chrome.downloads.download({ url, filename: `pagelens-${currentData.overview.hostname}.json` });
  URL.revokeObjectURL(url);
});

// ── Export: PDF (HTML report) ────────────────────────────────────────────

document.getElementById('export-pdf-btn').addEventListener('click', () => {
  if (!currentData) return;
  const d = currentData;
  const scoreColor = d.score >= 80 ? '#059669' : d.score >= 50 ? '#d97706' : '#dc2626';

  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>PageLens Report — ${escapeHtml(d.overview.hostname)}</title>
<style>
  body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:800px;margin:0 auto;padding:30px;color:#1a1a2e;font-size:14px}
  h1{font-size:24px;margin-bottom:4px}
  .subtitle{color:#6b7280;font-size:13px;margin-bottom:20px}
  .score-box{display:inline-block;padding:8px 20px;border-radius:8px;color:white;font-size:28px;font-weight:800;background:${scoreColor}}
  h2{font-size:16px;border-bottom:2px solid #e5e7eb;padding-bottom:6px;margin-top:24px}
  table{width:100%;border-collapse:collapse;margin:8px 0}
  th,td{text-align:left;padding:6px 10px;border-bottom:1px solid #f3f4f6;font-size:13px}
  th{color:#6b7280;font-weight:600;width:40%}
  .ok{color:#059669}.warn{color:#d97706}.fail{color:#dc2626}
  .tag{display:inline-block;padding:2px 8px;border-radius:4px;font-size:11px;margin:2px}
  .tag-detected{background:#dcfce7;color:#166534}
  .tag-missed{background:#f3f4f6;color:#6b7280}
  .issue{padding:4px 0;font-size:13px}
</style></head>
<body>
<h1>PageLens Report</h1>
<div class="subtitle">${escapeHtml(d.overview.url)} — Generated ${new Date().toLocaleString()}</div>
<div class="score-box">${d.score}/100</div> <span style="font-size:13px;color:#6b7280;margin-left:8px">Health Score</span>

<h2>Overview</h2>
<table><tr><th>Page Title</th><td>${escapeHtml(d.overview.title || 'Missing')}</td></tr>
<tr><th>URL</th><td>${escapeHtml(d.overview.url)}</td></tr>
<tr><th>Hostname</th><td>${escapeHtml(d.overview.hostname)}</td></tr>
<tr><th>Language</th><td>${escapeHtml(d.overview.lang || 'Not set')}</td></tr>
<tr><th>Page Size</th><td>${formatBytes(d.performance.totalSize)}</td></tr>
<tr><th>Requests</th><td>${d.performance.requestCount}</td></tr>
<tr><th>DOM Nodes</th><td>${d.performance.domNodes}</td></tr>
<tr><th>Technologies Detected</th><td>${d.technology.detected.length}</td></tr>
<tr><th>Total Links</th><td>${d.links.total}</td></tr></table>

<h2>Issues (${d.deductions.length})</h2>
${d.deductions.length === 0 ? '<p class="ok">No issues found!</p>' : d.deductions.map(i => `<div class="issue"><span class="fail">✗</span> ${escapeHtml(i)}</div>`).join('')}

<h2>SEO</h2>
<table><tr><th>Title</th><td class="${d.seo.titleLength >= 10 && d.seo.titleLength <= 60 ? 'ok' : 'warn'}">${escapeHtml(d.seo.title || 'Missing')} (${d.seo.titleLength} chars)</td></tr>
<tr><th>Description</th><td class="${d.seo.descriptionLength >= 50 && d.seo.descriptionLength <= 160 ? 'ok' : 'warn'}">${escapeHtml(d.seo.description || 'Missing')} (${d.seo.descriptionLength} chars)</td></tr>
<tr><th>H1 Count</th><td class="${d.seo.h1Count === 1 ? 'ok' : 'fail'}">${d.seo.h1Count}</td></tr>
<tr><th>Images Missing Alt</th><td class="${d.seo.imagesWithoutAlt === 0 ? 'ok' : 'fail'}">${d.seo.imagesWithoutAlt} / ${d.seo.totalImages}</td></tr>
<tr><th>Canonical</th><td>${d.seo.hasCanonical ? '<span class="ok">✓ Present</span>' : '<span class="fail">✗ Missing</span>'}</td></tr>
<tr><th>Robots Meta</th><td>${d.seo.hasRobots ? '<span class="ok">✓ Present</span>' : '<span class="warn">⚠ Not found</span>'}</td></tr></table>

<h2>Accessibility</h2>
<table><tr><th>Images Missing Alt</th><td class="${d.accessibility.imagesWithoutAlt === 0 ? 'ok' : 'fail'}">${d.accessibility.imagesWithoutAlt} / ${d.accessibility.totalImages}</td></tr>
<tr><th>Missing Form Labels</th><td class="${d.accessibility.missingFormLabels === 0 ? 'ok' : 'fail'}">${d.accessibility.missingFormLabels}</td></tr>
<tr><th>Heading Issues</th><td class="${d.accessibility.headingIssues.length === 0 ? 'ok' : 'fail'}">${d.accessibility.headingIssues.join(', ') || 'None'}</td></tr>
<tr><th>Buttons Without Text</th><td class="${d.accessibility.buttonsWithoutText === 0 ? 'ok' : 'fail'}">${d.accessibility.buttonsWithoutText}</td></tr>
<tr><th>Skip Links</th><td>${d.accessibility.hasSkipLinks ? '<span class="ok">✓ Found</span>' : '<span class="warn">⚠ Not found</span>'}</td></tr>
<tr><th>Lang Attribute</th><td>${d.accessibility.hasLang ? '<span class="ok">✓ Present</span>' : '<span class="fail">✗ Missing</span>'}</td></tr></table>

<h2>Technologies (${d.technology.detected.length} detected)</h2>
<p>${d.technology.detected.length === 0 ? 'None detected' : d.technology.detected.map(t => `<span class="tag tag-detected">${escapeHtml(t)}</span>`).join(' ')}</p>
<details><summary style="cursor:pointer;color:#6b7280;font-size:12px">All ${d.technology.all.length} signatures scanned</summary>
<p>${d.technology.all.map(t => `<span class="tag ${d.technology.detected.includes(t) ? 'tag-detected' : 'tag-missed'}">${escapeHtml(t)}</span>`).join(' ')}</p></details>

<h2>Security</h2>
<table><tr><th>HTTPS</th><td>${d.security.https ? '<span class="ok">✓ Secure</span>' : '<span class="fail">✗ Not secure</span>'}</td></tr>
<tr><th>Mixed Content</th><td>${d.security.mixedContent ? '<span class="fail">✗ Found</span>' : '<span class="ok">✓ None</span>'}</td></tr>
<tr><th>CSP Meta</th><td>${d.security.securityHeaders.hasCSP ? '<span class="ok">✓ Present</span>' : '<span class="warn">⚠ Not found</span>'}</td></tr>
<tr><th>X-Frame-Options Meta</th><td>${d.security.securityHeaders.hasXFrameOptions ? '<span class="ok">✓ Present</span>' : '<span class="warn">⚠ Not found</span>'}</td></tr>
<tr><th>Insecure Forms</th><td>${d.security.insecureForms.length > 0 ? '<span class="fail">✗ ' + d.security.insecureForms.length + ' found</span>' : '<span class="ok">✓ None</span>'}</td></tr></table>

<h2>Links</h2>
<table><tr><th>Total</th><td>${d.links.total}</td></tr>
<tr><th>Internal</th><td>${d.links.internal}</td></tr>
<tr><th>External</th><td>${d.links.external}</td></tr>
<tr><th>NoFollow</th><td>${d.links.noFollow}</td></tr>
<tr><th>New Tab</th><td>${d.links.newTab}</td></tr></table>

<h2>Performance</h2>
<table><tr><th>DNS Lookup</th><td>${d.performance.timing.dns !== null ? d.performance.timing.dns + 'ms' : 'N/A'}</td></tr>
<tr><th>Connection</th><td>${d.performance.timing.connect !== null ? d.performance.timing.connect + 'ms' : 'N/A'}</td></tr>
<tr><th>TTFB</th><td>${d.performance.timing.ttfb !== null ? d.performance.timing.ttfb + 'ms' : 'N/A'}</td></tr>
<tr><th>Download</th><td>${d.performance.timing.download !== null ? d.performance.timing.download + 'ms' : 'N/A'}</td></tr>
<tr><th>DOM Processing</th><td>${d.performance.timing.dom !== null ? d.performance.timing.dom + 'ms' : 'N/A'}</td></tr>
<tr><th>Fully Loaded</th><td>${d.performance.timing.fullyLoaded !== null ? d.performance.timing.fullyLoaded + 'ms' : 'N/A'}</td></tr></table>

</body></html>`;

  const blob = new Blob([html], { type: 'text/html' });
  const blobUrl = URL.createObjectURL(blob);
  chrome.downloads.download({
    url: blobUrl,
    filename: `pagelens-report-${d.overview.hostname}.html`,
    saveAs: true,
  });
  // Note: we don't revoke immediately so the download can complete
  setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
});

// ── Export: CSV ──────────────────────────────────────────────────────────

document.getElementById('export-csv-btn').addEventListener('click', () => {
  if (!currentData) return;
  const d = currentData;
  const rows = [
    ['Metric', 'Value'],
    ['URL', d.overview.url],
    ['Hostname', d.overview.hostname],
    ['Title', d.seo.title],
    ['Title Length', d.seo.titleLength],
    ['Description', d.seo.description],
    ['Description Length', d.seo.descriptionLength],
    ['H1 Count', d.seo.h1Count],
    ['Images Without Alt', d.seo.imagesWithoutAlt],
    ['Total Images', d.seo.totalImages],
    ['Has Canonical', d.seo.hasCanonical ? 'Yes' : 'No'],
    ['Has Robots', d.seo.hasRobots ? 'Yes' : 'No'],
    ['HTTPS', d.security.https ? 'Yes' : 'No'],
    ['Mixed Content', d.security.mixedContent ? 'Yes' : 'No'],
    ['CSP', d.security.securityHeaders.hasCSP ? 'Yes' : 'No'],
    ['X-Frame-Options', d.security.securityHeaders.hasXFrameOptions ? 'Yes' : 'No'],
    ['Total Links', d.links.total],
    ['Internal Links', d.links.internal],
    ['External Links', d.links.external],
    ['NoFollow Links', d.links.noFollow],
    ['Technologies Detected', d.technology.detected.join('; ')],
    ['Health Score', d.score],
    ['Issues', d.deductions.join('; ')],
    ['Page Size (bytes)', d.performance.totalSize],
    ['Request Count', d.performance.requestCount],
    ['DOM Nodes', d.performance.domNodes],
  ];

  const csv = rows.map(r => r.map(c => '"' + String(c).replace(/"/g, '""') + '"').join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  chrome.downloads.download({ url, filename: `pagelens-${d.overview.hostname}.csv` });
  URL.revokeObjectURL(url);
});

// ── Stripe / Pro Upgrade ─────────────────────────────────────────────────

async function initUpgradeButton() {
  const tier = await new Promise(resolve => chrome.storage.local.get(['pl_tier'], r => resolve(r.pl_tier || 'free')));
  const btn = document.getElementById('upgrade-btn');
  if (!btn) return;

  if (tier === 'pro') {
    btn.textContent = '✓ Pro';
    btn.classList.add('pro-active');
    btn.disabled = true;
    return;
  }

  btn.addEventListener('click', async () => {
    // Check if Stripe key is configured
    const config = await new Promise(resolve => chrome.storage.local.get(['stripe_checkout_url'], r => resolve(r)));

    if (config.stripe_checkout_url) {
      chrome.tabs.create({ url: config.stripe_checkout_url });
    } else {
      // Fallback: open Stripe billing portal placeholder
      const stripeUrl = 'https://billing.stripe.com/p/login/test_00g14M8px5US104dQQ';
      chrome.tabs.create({ url: stripeUrl });
    }
  });
}

// ── Refresh ──────────────────────────────────────────────────────────────

document.getElementById('refresh-btn').addEventListener('click', analyzePage);

// ── Helpers ──────────────────────────────────────────────────────────────

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ── Init ─────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  analyzePage();
  initUpgradeButton();
});

// ── Content script function (injected) ──────────────────────────────────

function analyzePageInContext() {
  const doc = document;
  const perf = performance.getEntriesByType('navigation')[0] || {};
  const resources = performance.getEntriesByType('resource') || [];

  const overview = {
    url: location.href,
    hostname: (() => { try { return new URL(location.href).hostname; } catch { return 'unknown'; } })(),
    title: doc.title || '',
    lang: doc.documentElement.lang || '',
  };

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
  if (descTag) { seo.description = descTag.getAttribute('content') || ''; seo.descriptionLength = seo.description.length; }

  for (let i = 1; i <= 6; i++) seo.headingStructure[`h${i}`] = doc.querySelectorAll(`h${i}`).length;
  seo.h1Count = seo.headingStructure.h1;
  doc.querySelectorAll('img').forEach(img => { if (!img.getAttribute('alt')) seo.imagesWithoutAlt++; });

  const canonical = doc.querySelector('link[rel="canonical"]');
  if (canonical) { seo.canonical = canonical.getAttribute('href') || ''; seo.hasCanonical = true; }
  const robots = doc.querySelector('meta[name="robots"]');
  if (robots) { seo.robots = robots.getAttribute('content') || ''; seo.hasRobots = true; }

  const a11y = {
    imagesWithoutAlt: seo.imagesWithoutAlt, totalImages: seo.totalImages, missingFormLabels: 0,
    headingIssues: [], buttonsWithoutText: 0, hasSkipLinks: false, hasLang: !!seo.lang,
  };

  doc.querySelectorAll('input, select, textarea').forEach(input => {
    const id = input.getAttribute('id');
    const hasLabel = (id && doc.querySelector(`label[for="${id}"]`)) || input.getAttribute('aria-label') || input.getAttribute('aria-labelledby') || input.getAttribute('title');
    if (!hasLabel && input.type !== 'hidden') a11y.missingFormLabels++;
  });

  if (seo.h1Count === 0) a11y.headingIssues.push('Missing H1');
  else if (seo.h1Count > 1) a11y.headingIssues.push('Multiple H1s (' + seo.h1Count + ')');

  let prevLevel = 0;
  doc.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(h => {
    const level = parseInt(h.tagName[1]);
    if (level > prevLevel + 1) a11y.headingIssues.push('Skipped heading level: H' + prevLevel + ' → H' + level);
    prevLevel = level;
  });

  doc.querySelectorAll('button').forEach(btn => {
    if (!btn.textContent.trim() && !btn.getAttribute('aria-label')) a11y.buttonsWithoutText++;
  });

  doc.querySelectorAll('a[href^="#"]').forEach(a => {
    if (a.textContent.toLowerCase().includes('skip') || a.textContent.toLowerCase().includes('main')) a11y.hasSkipLinks = true;
  });

  const tech = { detected: [], all: [] };
  const signatures = [
    { name: 'React', test: () => !!window.__REACT_DEVTOOLS_GLOBAL_HOOK__ || !!doc.querySelector('[data-reactroot]') || !!(window.React && window.React.version) },
    { name: 'Vue', test: () => !!doc.querySelector('[data-v-]') || !!window.__VUE__ || !!(window.Vue && window.Vue.version) },
    { name: 'Angular', test: () => !!doc.querySelector('[ng-app]') || !!window.ng || !!(window.angular && window.angular.version) },
    { name: 'jQuery', test: () => !!window.jQuery || !!window.$ },
    { name: 'Svelte', test: () => !!doc.querySelector('[svelte]') || !!window.__svelte },
    { name: 'Next.js', test: () => !!window.__NEXT_DATA__ || !!doc.querySelector('#__next') },
    { name: 'Nuxt', test: () => !!window.__NUXT__ || !!doc.querySelector('#__nuxt') },
    { name: 'Gatsby', test: () => !!doc.querySelector('[data-reactroot]') || !!window.__GATSBY },
    { name: 'WordPress', test: () => !!doc.querySelector('link[href*="wp-content"]') || !!window.wp },
    { name: 'Shopify', test: () => !!window.Shopify || !!doc.querySelector('link[href*="cdn.shopify.com"]') },
    { name: 'Bootstrap', test: () => !!doc.querySelector('.container, .row, .col-') || !!window.bootstrap },
    { name: 'Tailwind', test: () => !!doc.querySelector('[class*="tw-"], [class*="md:"], [class*="lg:"]') || !!(doc.querySelector('style') && doc.querySelector('style').textContent.includes('tailwind')) },
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
    { name: 'Vite', test: () => !!doc.querySelector('script[type="module"]') && (!!doc.querySelector('script[src*="vite"]') || !!window.__VITE__) },
    { name: 'Jekyll', test: () => !!doc.querySelector('meta[name="generator"][content*="Jekyll"]') },
    { name: 'Hugo', test: () => !!doc.querySelector('meta[name="generator"][content*="Hugo"]') },
    { name: 'Drupal', test: () => !!window.Drupal || !!doc.querySelector('link[href*="sites/default/files"]') },
    { name: 'Wix', test: () => !!doc.querySelector('script[src*="wix.com"]') || !!window.wixBiSession },
  ];

  signatures.forEach(sig => { try { if (sig.test()) tech.detected.push(sig.name); } catch (e) {} });
  tech.all = signatures.map(s => s.name);

  const security = {
    https: location.protocol === 'https:', mixedContent: false, insecureForms: [],
    securityHeaders: { hasCSP: false, hasXFrameOptions: false, hasHSTS: false },
  };

  if (security.https) {
    doc.querySelectorAll('img, script, link, iframe, video, audio').forEach(el => {
      const src = el.getAttribute('src') || el.getAttribute('href') || '';
      if (src.startsWith('http:')) security.mixedContent = true;
    });
  }

  doc.querySelectorAll('form').forEach(form => {
    const action = form.getAttribute('action') || '';
    if (action.startsWith('http:') || (!security.https && action)) security.insecureForms.push(action || '(empty action)');
  });

  if (doc.querySelector('meta[http-equiv="Content-Security-Policy"]')) security.securityHeaders.hasCSP = true;
  if (doc.querySelector('meta[http-equiv="X-Frame-Options"]')) security.securityHeaders.hasXFrameOptions = true;

  const links = { total: 0, internal: 0, external: 0, noFollow: 0, newTab: 0, items: [] };
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
    if (href.startsWith('http')) { try { isExternal = new URL(href).hostname !== hostname; } catch (e) {} }
    if (isExternal) links.external++; else links.internal++;
    if (links.items.length < 100) links.items.push({ href: href.substring(0, 200), text: a.textContent.trim().substring(0, 80), external: isExternal, noFollow: rel.includes('nofollow') });
  });

  let score = 100;
  const deductions = [];
  if (!seo.title || seo.titleLength < 10) { score -= 15; deductions.push('Missing/poor title'); }
  if (!seo.description) { score -= 10; deductions.push('Missing meta description'); }
  if (seo.h1Count === 0) { score -= 15; deductions.push('Missing H1'); }
  if (seo.h1Count > 1) { score -= 5; deductions.push('Multiple H1s'); }
  if (seo.imagesWithoutAlt > 0) { score -= Math.min(10, seo.imagesWithoutAlt * 2); deductions.push(seo.imagesWithoutAlt + ' images missing alt'); }
  if (!security.https) { score -= 20; deductions.push('Not HTTPS'); }
  if (security.mixedContent) { score -= 10; deductions.push('Mixed content'); }
  if (a11y.missingFormLabels > 0) { score -= Math.min(10, a11y.missingFormLabels * 2); deductions.push(a11y.missingFormLabels + ' inputs missing labels'); }
  if (!a11y.hasLang) { score -= 5; deductions.push('Missing lang attribute'); }
  if (!seo.hasCanonical) { score -= 5; deductions.push('Missing canonical URL'); }
  score = Math.max(0, score);

  return { score, deductions, overview, performance: perfData, seo, accessibility: a11y, technology: tech, security, links };
}
