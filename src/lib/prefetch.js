
'use strict';

let prefetched = new Set();
let prefetchObserver;
let preconnectObserver;
let mutationObserver;
let lastUrl = location.href;

const conn = navigator.connection;
const saveData = conn && (conn.saveData || (conn.effectiveType || '').includes('2g'));
const prefetchLimit = conn && conn.effectiveType ? (/2g/.test(conn.effectiveType) ? 2 : /3g/.test(conn.effectiveType) ? 4 : 6) : 6;
const PREFETCH_DELAY = 1000;

let inflight = 0;
let queue = [];
let to;

const isMobile = conn && conn.type === 'cellular';

const SCHEME_REGEX = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;
const isExternal = url => url.startsWith('http') && !url.includes(location.origin);

const canPrefetch = link => {
  if (saveData) return false;
  if (!link || !link.href || link.href.startsWith('mailto:') || link.href.startsWith('tel:')) return false;
  if (link.hasAttribute('download')) return false;

  const { origin, pathname, search, hash } = new URL(link.href, location.href);
  if (origin !== location.origin) return false;
  if (prefetched.has(pathname + search)) return false;

  return true;
};

const prefetch = url => {
  prefetched.add(url);
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = url;
  document.head.appendChild(link);
  if (window.__prefetchStats) window.__prefetchStats.total++;
};

const prefetcher = url => {
  if (inflight >= prefetchLimit) {
    queue.push(url);
    if(window.__prefetchStats) window.__prefetchStats.queued++;
  } else {
    inflight++;
    prefetch(url);
    setTimeout(() => {
      inflight--;
      if (queue.length) {
        prefetcher(queue.shift());
        if(window.__prefetchStats) window.__prefetchStats.queued--;
      }
    }, PREFETCH_DELAY);
  }
};

const intersectionCallback = (entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const link = entry.target;
      if (prefetchObserver) prefetchObserver.unobserve(link);
      if (canPrefetch(link)) {
        prefetcher(link.href);
      }
    }
  });
};

const observe = () => {
  if (!prefetchObserver) {
    prefetchObserver = new IntersectionObserver(intersectionCallback, {
      rootMargin: (isMobile ? 1.5 : 0.75) * innerHeight + 'px',
    });
  }
  document.querySelectorAll('a[href]').forEach(link => {
    if (canPrefetch(link)) {
      prefetchObserver.observe(link);
    }
  });
};

const mutationCallback = () => {
  if(to) clearTimeout(to);
  to = setTimeout(observe, 500);
};

const init = () => {
  if (window.__prefetchStats) {
      window.__prefetchStats = { total: 0, queued: 0, saved: 0 };
  } else {
    Object.defineProperty(window, '__prefetchStats', {
        value: { total: 0, queued: 0, saved: 0 },
        writable: true,
        configurable: true
    });
  }

  mutationObserver = new MutationObserver(mutationCallback);
  mutationObserver.observe(document, { childList: true, subtree: true });

  const onHistoryChange = () => {
    requestIdleCallback(() => {
      if (lastUrl !== location.href) {
        prefetched.clear();
        if (prefetchObserver) prefetchObserver.disconnect();
        observe();
        lastUrl = location.href;
      }
    });
  };

  const originalPushState = history.pushState;
  history.pushState = function(...args) {
    originalPushState.apply(this, args);
    onHistoryChange();
  };

  const originalReplaceState = history.replaceState;
  history.replaceState = function(...args) {
    originalReplaceState.apply(this, args);
    onHistoryChange();
  };

  window.addEventListener('popstate', onHistoryChange);

  if (document.readyState !== 'complete') {
    window.addEventListener('load', observe);
  } else {
    observe();
  }
};

init();
