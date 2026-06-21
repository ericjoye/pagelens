// PageLens background service worker
'use strict';

chrome.runtime.onInstalled.addListener(async () => {
  const data = await new Promise(resolve => chrome.storage.local.get(null, resolve));
  if (!data.pl_tier) {
    chrome.storage.local.set({ pl_tier: 'free' });
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  handleMessage(message, sender).then(sendResponse).catch(err => {
    console.error('[PageLens] Error:', err);
    sendResponse({ error: err.message });
  });
  return true;
});

async function handleMessage(message, sender) {
  const { action, payload } = message;

  switch (action) {
    case 'getTabAnalysis': {
      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tab) return { error: 'No active tab' };

        // First, inject the analyzer script
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['js/analyzer.js'],
        });

        // Then run the analysis function
        const results = await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: () => {
            if (typeof analyzePage === 'function') return analyzePage();
            return null;
          },
        });

        return { data: results[0]?.result };
      } catch (err) {
        return { error: err.message };
      }
    }

    case 'getTier':
      return { tier: await getTier() };

    default:
      throw new Error(`Unknown action: ${action}`);
  }
}

async function getTier() {
  const data = await new Promise(resolve => chrome.storage.local.get(['pl_tier'], resolve));
  return data.pl_tier || 'free';
}
