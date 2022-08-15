(function() {
  document.body.style.display = "block";

  let currentUrl = window.location.href;

  let cleanUpFYClasses = () => {
    document.body.classList.forEach(className => {
      if(className.startsWith("fy-")) {
        document.body.classList.remove(className);
      }
    });
  }

  const initFY = () => {
    cleanUpFYClasses();

    if(window.location.pathname === "/" || window.location.pathname === "/feed/subscriptions") {
      initHomePage();
    } else if(window.location.pathname === "/results") {
      initResultsPage();
    } else if(window.location.pathname === "/watch") {
      initWatchPage();
    }
  }

  const initWatchPage = () => {
    document.body.classList.add("fy-watch-page");
  }

  const initResultsPage = () => {
    document.body.classList.add("fy-results-page");
  }

  const initHomePage = () => {
    const search = (event) => {
      event.preventDefault();

      const query = anchor.querySelector(".search-form__text-input").value;
      window.location.href = "https://www.youtube.com/results?search_query=" + encodeURIComponent(query);
    }

    document.body.classList.add("fy-home-page");

    const body = document.querySelector("body");
    const anchor = document.createElement("div");
    anchor.id = "mega-app";

    body.innerHTML = "";
    document.body.appendChild(anchor);

    anchor.innerHTML = `
      <div class="focused-youtube">
        <div class="focused-youtube__logo">
        </div>

        <div class="focused-youtube__body">
          <form class="focused-youtube__form search-form" action="#">
            <input class="search-form__text-input" type="text" placeholder="Search" />
            <button class="search-form__submit"></button>
          </form>
        </div>
      </div>
    `;

    anchor.querySelector(".search-form").onsubmit = search;
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
    }
  });

  // Thank you https://stackoverflow.com/questions/24297929/javascript-to-listen-for-url-changes-in-youtube-html5-player for investigating YT events
  window.addEventListener("popstate", () => console.log("popstate"));
  window.addEventListener('load', function () {
    console.log('load');
  });
  document.addEventListener('spfdone', function() {
    console.log("spfdone");
  });
  window.addEventListener('yt-page-data-updated', () => {
    console.log("page data updated");
    checkVidCat();
  });
  document.addEventListener('transitionend', function(e) {
    if (e.target.id === 'progress')
        console.log("transitionend");
  });
  //checkVidCat();
  function checkVidCat() {
    console.log("ETHAN says: Script injected!")
    const s = document.createElement('script');
    s.src = chrome.runtime.getURL('js/content-script.js');
    (document.head||document.documentElement).appendChild(s);
    // s.onload = function() {
    //   s.remove();
    // };
  }
})();
