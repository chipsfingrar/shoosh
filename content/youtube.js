/**
 * Shoosh — YouTube content script
 * Reads settings from storage and applies blocking rules accordingly.
 */

const STYLE_ID = "shoosh-styles";

const DEFAULTS = {
  "youtube.hideShorts": true,
  "youtube.hideRecommendations": true,
  "youtube.hideComments": true,
  "youtube.redirectHomepage": true,
  "youtube.theaterMode": false,
};

function buildCSS(s) {
  const rules = [];

  if (s["youtube.hideShorts"]) {
    rules.push(
      /* Shorts shelf on home / subscriptions */
      `ytd-rich-section-renderer:has(#title-text[title="Shorts"])`,
      `ytd-rich-section-renderer:has(ytd-rich-shelf-renderer[is-shorts])`,
      /* Shorts shelf in search results */
      `ytd-reel-shelf-renderer`,
      /* Individual short items mixed into feeds */
      `ytd-rich-item-renderer:has(a[href*="/shorts/"])`,
      `ytd-video-renderer:has(a[href*="/shorts/"])`,
      `ytd-compact-video-renderer:has(a[href*="/shorts/"])`,
      `ytd-grid-video-renderer:has(a[href*="/shorts/"])`,
      /* Shorts tab in sidebar / mini-guide */
      `ytd-guide-entry-renderer:has(a[title="Shorts"])`,
      `ytd-mini-guide-entry-renderer:has(a[title="Shorts"])`,
      /* Shorts chip/filter in search */
      `yt-chip-cloud-chip-renderer:has([title="Shorts"])`
    );
  }

  if (s["youtube.hideRecommendations"]) {
    rules.push(`#secondary`);
  }

  if (s["youtube.hideComments"]) {
    rules.push(`#comments`);
  }

  if (rules.length === 0) return "";
  return rules.join(",\n") + " { display: none !important; }";
}

function injectStyles(css) {
  let el = document.getElementById(STYLE_ID);
  if (!el) {
    el = document.createElement("style");
    el.id = STYLE_ID;
    (document.head || document.documentElement).appendChild(el);
  }
  el.textContent = css;
}

function hideElementsJS(s) {
  const ids = [];
  if (s["youtube.hideRecommendations"]) ids.push("secondary");
  if (s["youtube.hideComments"]) ids.push("comments");
  for (const id of ids) {
    const el = document.getElementById(id);
    if (el && el.style.display !== "none") {
      el.style.setProperty("display", "none", "important");
    }
  }
}

function redirectShortsPage(s) {
  if (!s["youtube.hideShorts"]) return;
  const match = location.pathname.match(/^\/shorts\/([^/?#]+)/);
  if (match) {
    location.replace(`https://www.youtube.com/watch?v=${match[1]}`);
  }
}

function redirectHomePage(s) {
  if (!s["youtube.redirectHomepage"]) return;
  if (location.pathname === "/" && !location.search && !location.hash) {
    location.replace("https://www.youtube.com/feed/subscriptions");
  }
}

function applyTheaterMode(s) {
  if (!location.pathname.startsWith("/watch")) return;
  const page = document.querySelector("ytd-watch-flexy");
  if (!page) return;
  const isTheater = page.hasAttribute("theater");
  if (s["youtube.theaterMode"] === isTheater) return;
  const btn = document.querySelector(".ytp-size-button");
  if (btn) btn.click();
}

function applyAll(s) {
  injectStyles(buildCSS(s));
  hideElementsJS(s);
  redirectShortsPage(s);
  redirectHomePage(s);
  applyTheaterMode(s);
}

// Load settings, then start observing
browser.storage.sync.get(DEFAULTS).then((settings) => {
  applyAll(settings);

  const observer = new MutationObserver(() => applyAll(settings));
  observer.observe(document.documentElement, { childList: true, subtree: true });

  // React to settings changes without requiring a page reload
  browser.storage.onChanged.addListener((changes) => {
    for (const [key, { newValue }] of Object.entries(changes)) {
      settings[key] = newValue;
    }
    applyAll(settings);
  });
});
