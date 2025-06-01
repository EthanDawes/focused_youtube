const enforce = new Set([
    "behjadmmpafnpaeijfoioegdpcbpbhij", // Strict focused youtube (local & web store)
    "bphljigopmbjfmjbdeedhmeadmefcjbf", // Watchdog (local)
    "aeieaakfhkjhlaijcboomiokalopdlpc", // Watchdog (web store)
    "kpomkjpijklmdabpfgphmapbopjockgd", // Intentional Web (web store)
    "ejnaicioaeopejbifeboomfpcommcnng", // Intentional Web (local, not pinned so can change)
]);

chrome.management.onDisabled.addListener(info => {
    console.log(info.id);
    if (enforce.has(info.id))
        chrome.management.setEnabled(info.id, true);
});

chrome.runtime.onMessage.addListener((msg, _, sendResponse) => {
  if (msg === 'CHECK_ALLOWED_INCOGNITO_ACCESS') {
    chrome.extension.isAllowedIncognitoAccess().then(isAllowed => {
      sendResponse({ allowed: isAllowed });
    });
    return true; // keeps message channel open for async response
  }
});
