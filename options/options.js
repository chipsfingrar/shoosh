const DEFAULTS = {
  "youtube.hideShorts": true,
  "youtube.hideRecommendations": true,
  "youtube.hideComments": true,
  "youtube.redirectHomepage": true,
  "youtube.theaterMode": false,
};

const toast = document.getElementById("toast");
let toastTimer;

function showToast() {
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 1800);
}

function applySettings(settings) {
  for (const [key, value] of Object.entries(settings)) {
    const el = document.getElementById(key);
    if (el) el.checked = value;
  }
}

// Load saved settings (fall back to defaults for any missing key)
browser.storage.sync.get(DEFAULTS).then(applySettings);

// Save on every toggle change
document.querySelectorAll(".toggle input").forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    const key = checkbox.id;
    browser.storage.sync.set({ [key]: checkbox.checked }).then(showToast);
  });
});
