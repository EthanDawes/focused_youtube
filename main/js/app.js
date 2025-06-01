(function() {
  document.body.style.display = "block";

  let currentUrl = window.location.href;

  // API key borrowed from https://crxcavator.io/source/jedeklblgiihonnldgldeagmbkhlblek/1.0.0?file=content.js&platform=Chrome
  // YT stores its key in `ytcfg.get("WEB_PLAYER_CONTEXT_CONFIGS")["WEB_PLAYER_CONTEXT_CONFIG_ID_KEVLAR_WATCH"]["innertubeApiKey"]`. However, it doesn't have the correct permissions
  const apiKey = "AIzaSyCLtPIDnh66lUXv440RfC09ztaQekc2KxA";
  // now that I know how to exec js in main ctx, looked into using native api requests, but google uses wierd token (https://gist.github.com/eyecatchup/2d700122e24154fdc985b7071ec7764a) might just be easier to continue. Plus, searching all global vars yielded nothing

  let cleanUpFYClasses = () => {
    document.body.classList.forEach(className => {
      if(className.startsWith("fy-")) {
        document.body.classList.remove(className);
      }
    });
  }

  const initFY = () => {
	  chrome.runtime.sendMessage('CHECK_ALLOWED_INCOGNITO_ACCESS', res => {
	  if (!res.allowed) {
		initHomePage("Incognito access is required for strict blocking");
		return;
	  }
	});
    cleanUpFYClasses();

    if (location.pathname === "/feed/subscriptions") {
      setTimeout(initSubscriptions, 2000);
    }
    else if (location.pathname.startsWith("/feed") || location.pathname === "/playlist" || location.pathname.startsWith("/embed")
        || location.pathname.startsWith("/howyoutubeworks") || location.pathname.startsWith("/copyright_complaint_form")
        || location.pathname.startsWith("/account") || location.pathname.startsWith("/email_unsubscribe")) {
      // do nothing, exempt
    }
    else if (location.pathname === "/watch" || location.pathname.startsWith("/live") || location.pathname.startsWith("/clip")) {
      if (isBannedChannel())
        initHomePage();
      else
        initWatchPage();
    }
    else if (location.pathname.startsWith("/shorts")) {
      location.replace(location.href.replace("shorts/", "watch?v="));
    }
    else if (location.pathname.startsWith("/@") || location.pathname.startsWith("/channel/") || location.pathname.startsWith("/c/")) {  // is channel
      const splitPathname = location.pathname.split('/');
      if (!['videos', 'playlists', 'releases'].includes(splitPathname.at(-1))) {
        splitPathname[location.pathname[1] === '@' ? 2 : 3] = 'videos';
        location.replace(splitPathname.join('/'));
      }

      if (isBannedChannel()) {
        initHomePage();
      }
      // disallow viewing channels from google or with no browser history (common workaround using ctrl click)
      else if ((document.referrer && new URL(document.referrer).hostname === "www.google.com") || history.length === 1) {
        initHomePage();
      }
    }
    else {
      initHomePage();
    }
  }

  const initWatchPage = () => {
    document.body.classList.add("fy-watch-page");
  }

  const initResultsPage = () => {
    document.body.classList.add("fy-results-page");
  }

  function initSubscriptions() {
    const removeCDATA = str => str.replace("<![CDATA[", "").replace("]]>", "");

    const now = new Date().getTime();
    const container = document.createElement("div");
    container.classList.add("playlist-container");
    document.querySelector("ytd-shelf-renderer").prepend(container);
    const playlists = [
      "PL-uopgYBi65HwiiDR9Y23lomAkGr9mm-S",  // Helluva boss
      "PLNYkxOF6rcIDfz8XEA3loxY32tYh7CI3m",  // What's new in Chrome
      "PLNYkxOF6rcIBDSojZWBv4QJNoT4GNYzQD",  // What's new in DevTools
      "PLFt_AvWsXl0ehjAfLFsp1PGaatzAwo0uK",  // Sebastian Lague Coding Adventures
      "PLFt_AvWsXl0dPhqVsKt1Ni_46ARyiCGSq",  // Sebastian Lague how computers work
      "PLnKtcw5mIGURKWPPnJP-wIBD_kdH74EIO",  // Pixel updates
      "PLtY71Sv1CZtCu1bT5nkU2laNl5USA-y0i",  // My school spirit
      "PL0vfts4VzfNiI1BsIK5u7LpPaIDKMJIDN",  // Fireship 100 seconds
      "PLxyDPFsnfrbl1sCoZrgD_-7OQYA9h9o9h",  // Lackadaisy
      "PLaHHpDSEtBWNcGluMk--beDjzriSsp-f7",  // Atlas and the Stars
      // "OLAK5uy_l7V5rVd1ESx0tPtiFFkjinoX-yWZXj8KI",  // Spellcasting TODO: artist playlists. This doesn't work b/c all songs have 'added' = today and appear non-chronologically (by popularity)
    ];
    for (const playlist of playlists) {
      fetch(`https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${playlist}&key=${apiKey}`)
        .then(response => response.json())
        .then(({items}) => {
          for (const {snippet, contentDetails} of items) {
            const data = {
              thumbnail: snippet.thumbnails.high.url,
              added: new Date(snippet.publishedAt).getTime(),
              publish: new Date(contentDetails.videoPublishedAt),
              link: "https://www.youtube.com/watch?v=" + snippet.resourceId.videoId,
              title: snippet.title,
              // Unused properties
              description: snippet.description,
              channel: snippet.videoOwnerChannelTitle, // channelTitle is the playlist owner?
              //TODO: view count
            };
            if (data.added < now - 6.048e+8) continue;  // Skip adding if older than a week. Use `continue` instead of `break` b/c if len(playlists) < 5, it seems videos are arranged chronologically ascending instead of descending, so knowing that the first video is too old will provide no useful information about the 2nd
            container.appendChild(createVideoRenderer(data));
          }
        });
    }
  }

  function createVideoRenderer({thumbnail, link, title}) {
    const container = document.createElement("div");
    container.classList.add("video-renderer");

    const img = document.createElement("img");
    img.src = thumbnail;
    img.classList.add("thumbnail");
    container.appendChild(img);

    const titleDiv = document.createElement("div");
    titleDiv.innerText = title;
    titleDiv.classList.add("title-div");
    container.appendChild(titleDiv);

    const a = document.createElement("a");
    a.href = link;
    a.appendChild(container);
    return a;
  }

  const initHomePage = (customMsg = "Page is disallowed") => {
    document.body.replaceChildren();  // Using innerHTML violates CSP
    requestAnimationFrame(() => alert(customMsg));  // Wait to prevent freezing with content on screen
    history.back();
  }

  const observeDOM = (function() {
    const MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    const eventListenerSupported = window.addEventListener;

    return function(obj, callback) {
      if(MutationObserver) {
        let obs = new MutationObserver(function(mutations, observer) {
          if(mutations[0].addedNodes.length || mutations[0].removedNodes.length) {
            callback();
          }
        });

        obs.observe(obj, {
          childList: true,
          subtree: true
        });
      } else if(eventListenerSupported) {
        obj.addEventListener("DOMNodeInserted", callback, false);
        obj.addEventListener("DOMNodeRemoved", callback, false);
      }
    };
  })();

  initFY();

  observeDOM(document.body, function(){
    if(currentUrl !== window.location.href) {
      currentUrl = window.location.href;

      initFY();
    } else if (window.location.pathname === "/results") {  // Disallow ctrl-clicking on results page
      for (const anchor of document.getElementsByTagName("a"))
        anchor.onclick = ev => ev.preventDefault();
    }
  });

  // https://gist.github.com/dgp/1b24bf2961521bd75d6c
  const catIds = {
      "-1": "Unknown",
      31: "Anime/Animation",
      40: "Sci-Fi/Fantasy",
      22: "People & Blogs",
      2: "Autos & Vehicles",
      30: "Movies",
      1: "Film & Animation",
      21: "Videoblogging",
      27: "Education",
      10: "Music",
      19: "Travel & Events",
      15: "Pets & Animals",
      39: "Horror",
      36: "Drama",
      32: "Action/Adventure",
      43: "Shows",
      17: "Sports",
      37: "Family",
      35: "Documentary",
      42: "Shorts",
      26: "Howto & Style",
      18: "Short Movies",
      24: "Entertainment",
      28: "Science & Technology",
      20: "Gaming",
      38: "Foreign",
      25: "News & Politics",
      23: "Comedy",
      29: "Nonprofits & Activism",
      41: "Thriller",
      44: "Trailers",
      34: "Comedy",
      33: "Classics"
    };
    const allowedOverrides = new Set(["school", "stem", "tutorial", "news", "friend"]);
    const disallowedReasons = {
        gay: "go to the lgbtq center you queer!",
        furry: "have you practiced drawing today? òwó",
        sad: "go talk to people!",
        "brain off": "give a fish a hug and talk it out! 🦈",
        bored: "exercise!",
        sleepy: "take a nap!",
    };

  function getQueryVariable(variable) {
    const query = window.location.search.substring(1);
    const vars = query.split('&');
    for (let i = 0; i < vars.length; i++) {
      const pair = vars[i].split('=');
      if (decodeURIComponent(pair[0]) === variable) {
        return decodeURIComponent(pair[1]);
      }
    }
    return undefined;
  }
  
  function isBannedChannel() {
    const problematicChannels = new Set(["fern-tv", "VinceVintage", "MentourPilot", "GreenDotAviation", "LegalEagle", "thechadx2", "kurtisconner", "drewisgooden", "Danny-Gonzalez", "hoogyoutube", "fish_381", "BrandonRogers", "mkbhd", "Mrwhosetheboss", "CGPGrey", "neoexplains", "kurzgesagt"]);

    /*
    problem: channel URLs prefixed with /@ and /channel have different identifiers. Solutions:
    1. Accessing fields on ytInitialData. Changed since last checked, cannot count on being consistent. (requires "world": "MAIN" in manifest)
    2. document.querySelector("yt-content-metadata-view-model").innerText; channelName.substring(1, channelName.indexOf('\n'));
       Undefined until fully loaded, could cause flickering from resultant delay
    3. forbid /channel and use URL pathname (prior implementation)
    4. Regex search all the script tags. Can sometimes false-positive if forbidden channel appears in recommendations (current implementation)
    */
    const re = /"canonicalBaseUrl":"\/\@([^"]+)"/;
    return Array.from(document.getElementsByTagName("script")).some(elem => problematicChannels.has(re.exec(elem?.innerText)?.[1]));
  }

  function randomNumbers(count) {
    let a = "";
    for (let i=0; i<count; i++)
      a += Math.floor(Math.random() * 10);
    return a;
  }

  async function getVideoElem() {
    const maxRetry = 8;  // 4 seconds
    for (let retry = 0; retry < maxRetry; retry++) {
      const playerElem = document.querySelector("video");
      if (playerElem) return playerElem;
      await new Promise(res => window.setTimeout(res, 500));
    }
    document.documentElement.innerHTML = "Failed to block video after 4 seconds, reload the page";
  }

  // Thank you https://stackoverflow.com/questions/24297929/javascript-to-listen-for-url-changes-in-youtube-html5-player for investigating YT events
  // This won't fire in embedded videos, which is probably best
  window.addEventListener('yt-page-data-updated', checkVidCat);
  async function checkVidCat() {
    const videoId = getQueryVariable("v");
    if (!videoId) return;
    // Contained within ytd-player, but there's only 1 video element & specifying causes video to be shown briefly so it's omitted
    const playerElem = await getVideoElem();
    playerElem.style.opacity = "0";
    const videoMetadata = await (await fetch(`https://youtube.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet&key=${apiKey}`)).json();
    // Optional chaining in case rate limit exceeded
    const videoCatId = Number.parseInt(videoMetadata.items?.[0]?.snippet?.categoryId ?? "-1");
    const videoCat = catIds[videoCatId];
    if (!([35, 27, 25, 28, 29]).includes(videoCatId)) {
      if (document.visibilityState === "hidden") return;
      // Not in allowed category, ask for manual confirmation
      document.querySelector(".ytp-play-button").click();  // Pause video
      const categoryOrActivity = prompt('Video category "' + videoCat + '" is not allowed. Override? (reasons include reward, quality content, '
                                        + Array.from(allowedOverrides).join(", ") + ", " + Object.keys(disallowedReasons).join(", ") + ")");

      if (categoryOrActivity) {
        const disallowedReason = disallowedReasons[categoryOrActivity];
        if (allowedOverrides.has(categoryOrActivity)) {
          playerElem.style.opacity = "100%";
        } else if (disallowedReason) {
          alert(disallowedReason);
        } else if (categoryOrActivity === "reward") {
          const now = new Date().getTime();
          const lastReward = localStorage.lastReward ?? 0;
          const diff = now - lastReward;
          const hour = 36e5;
          if (diff > hour) {
            if (prompt("what have you done to deserve this reward?")) {
              localStorage.lastReward = now;
              playerElem.style.opacity = "100%";
            }
          } else {
            alert("you've already used your reward within the past hour");
          }
        }
      }

      document.querySelector(".ytp-play-button").click();  // Play video. My attempt to abstract this failed
    } else {
      console.log(videoCat, "is allowed");
      playerElem.style.opacity = "100%";
    }
  }
})();
