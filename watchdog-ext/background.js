const enforce = new Set([
    // pinned means the `key` manifest value is set so the id can't change.
    "behjadmmpafnpaeijfoioegdpcbpbhij", // Strict focused youtube (local & web store)
    "bphljigopmbjfmjbdeedhmeadmefcjbf", // Watchdog (local, pinned, too small and doesn't change often to publish to web store)
    "kpomkjpijklmdabpfgphmapbopjockgd", // Intentional Web (web store)
    "ejnaicioaeopejbifeboomfpcommcnng", // Intentional Web (local, NOT pinned so CAN change)
    "gjmolpoegdndgefehdjnfonmahjcefhi", // Incognito Blocker (local, pinned)
]);

chrome.management.onDisabled.addListener(info => {
    console.log(info.id);
    if (enforce.has(info.id))
        chrome.management.setEnabled(info.id, true);
});
