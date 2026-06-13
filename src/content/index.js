import { isDetailPage } from './vehicleParser.js';
import { injectSaveButton, injectAdvisorPanel, resetInjectionState } from './saveButton.js';
import './content.css';

// ─── Injection logic ──────────────────────────────────────────────────────────

function tryInject() {
  if (!isDetailPage()) return;
  injectSaveButton();
  injectAdvisorPanel();
}

// Wait for the DOM to settle (avto.net may render parts dynamically)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', tryInject);
} else {
  tryInject();
}

// MutationObserver for SPA-style navigation (if avto.net ever goes that route)
let debounceTimer;
let lastUrl = window.location.href;

const observer = new MutationObserver(() => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    const currentUrl = window.location.href;

    // Bug 3 fix: if the URL changed the content script's module-level
    // `buttonInjected` / `advisorInjected` flags are still true from the
    // previous page, so injectSaveButton() would silently no-op.  Reset the
    // flags whenever the page URL changes so the button re-injects correctly.
    if (currentUrl !== lastUrl) {
      resetInjectionState();
      lastUrl = currentUrl;
    }

    if (isDetailPage()) {
      injectSaveButton();
      injectAdvisorPanel();
    }
  }, 600);
});

observer.observe(document.body, { childList: true, subtree: true });

// Re-check on history navigation (back/forward)
window.addEventListener('popstate', () => {
  // Bug 3 fix: reset flags before re-injecting so the button appears on the
  // new page.  Previously only tryInject() was called, but buttonInjected=true
  // caused it to return early without doing anything.
  resetInjectionState();
  lastUrl = window.location.href;
  setTimeout(tryInject, 800);
});
