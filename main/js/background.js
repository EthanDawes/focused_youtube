// Strict focused youtube (local, pinned). Replaces watchdog. See `philosophy.md`
const watchdogId = "bphljigopmbjfmjbdeedhmeadmefcjbf";

// Strict focused youtube (web store)
const selfWebstoreId = "behjadmmpafnpaeijfoioegdpcbpbhij";

const enforce = new Set([
    // pinned means the `key` manifest value is set so the id can't change.
    selfWebstoreId, 
    watchdogId,
    "kpomkjpijklmdabpfgphmapbopjockgd", // Intentional Web (web store)
    "ejnaicioaeopejbifeboomfpcommcnng", // Intentional Web (local, NOT pinned so CAN change)
    "gjmolpoegdndgefehdjnfonmahjcefhi", // Incognito Blocker (local, pinned)
]);

chrome.management.onDisabled.addListener(info => {
    console.log(info.id);
    if (enforce.has(info.id))
        chrome.management.setEnabled(info.id, true);
});

chrome.management.onUninstalled.addListener(info => {
    if (enforce.has(info.id))
        chrome.management.uninstallSelf()
});

function extensionInstalled(id) {
  return chrome.management.get(id)
    .then(() => true)
    .catch(() => false)
}

chrome.runtime.onMessage.addListener((msg, _, sendResponse) => {
  if (msg === 'CHECK_ALLOWED_INCOGNITO_ACCESS') {
    chrome.extension.isAllowedIncognitoAccess().then(isAllowed => {
      sendResponse({ allowed: isAllowed });
    });
    return true; // keeps message channel open for async response
  } else if (msg == 'CHECK_SUPERVISOR_INSTALLED') {
    (async () => {
      const watchdogInstalled = await extensionInstalled(watchdogId);
      const selfWebstoreInstalled = await extensionInstalled(selfWebstoreId);
      sendResponse({ watchdogInstalled, selfWebstoreInstalled });
    })();
    return true;
  }
});
