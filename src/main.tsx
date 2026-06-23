import "./index.css";

/**
 * Entry point.
 *
 * In the browser this hydrates the prerendered markup (or mounts a fresh root
 * if the route was not prerendered). At build time, vite-prerender-plugin
 * imports this module and calls the exported `prerender()` function once per
 * static route to produce real HTML for crawlers.
 */

const rootEl = () => document.getElementById("root")!;

// ── Client bootstrap ─────────────────────────────────────────────
// Only run in the browser. During prerender (Node) `window` is undefined and
// the plugin invokes `prerender()` instead.
if (typeof window !== "undefined") {
  void (async () => {
    const [{ createRoot, hydrateRoot }, { default: App }] = await Promise.all([
      import("react-dom/client"),
      import("./App.tsx"),
    ]);

    const el = rootEl();
    // If prerendered markup exists, hydrate it; otherwise mount fresh (SPA).
    if (el.hasChildNodes()) {
      hydrateRoot(el, <App />);
    } else {
      createRoot(el).render(<App />);
    }
  })();
}

// ── Build-time prerender ─────────────────────────────────────────
// Called by vite-prerender-plugin for each static route. Must return
// `{ html }`. The plugin sets `globalThis.location` to the route URL before
// calling us, but does not provide a DOM. We install just enough browser
// globals here (NOT in the components) so that BrowserRouter and the various
// `typeof window`/try-catch-guarded browser calls render cleanly to a string.
export async function prerender(data: { url: string }) {
  // Install browser-like globals BEFORE importing the app, so any module-level
  // or render-time access to window/document/history is satisfied.
  installPrerenderGlobals(data.url);

  const server = await import("react-dom/server");
  const App = (await import("./App.tsx")).default;

  let html = "";
  try {
    // The app's content pages are loaded via React.lazy(), so a synchronous
    // renderToString would only emit the Suspense fallback ("Loading..."). Use
    // the streaming renderer and wait for `allReady`, which resolves all
    // Suspense boundaries (lazy chunks) before we read the final HTML.
    html = await renderToStringWithSuspense(server, <App />);
  } catch (err) {
    // Never break the build: if a route can't render cleanly, fall back to an
    // empty shell so the SPA still takes over client-side for that route.
    console.warn(`[prerender] route ${data.url} fell back to SPA shell:`, err);
    html = "";
  }

  // Per-route <head> so each prerendered page ships its own title, canonical,
  // and (where relevant) JSON-LD in the STATIC HTML — useSEO only runs after
  // hydration, so without this every prerendered page would inherit the
  // homepage's title and canonical from index.html (bad for indexing).
  const head = await buildHead(data.url).catch(() => undefined);

  // NOTE: We deliberately do NOT return discovered `links`. Link auto-discovery
  // would pull in runtime-data-driven routes (/markets, /crypto, /analytics,
  // /insights, /events/*, etc.) that must stay client-rendered. The exact set
  // of routes to prerender is controlled explicitly via `additionalPrerenderRoutes`
  // in vite.config.ts (static pages + every /blog/<slug>).
  return { html, head };
}

const SITE = "https://www.indiapredictions.com";

/** JSON-LD as a head <script> element; escape `<` so it can't break out. */
function ldScript(obj: unknown) {
  return {
    type: "script",
    props: {
      type: "application/ld+json",
      children: JSON.stringify(obj).replace(/</g, "\\u003c"),
    },
  };
}

/**
 * Build per-route head data (title + canonical [+ description/JSON-LD]) for the
 * prerenderer. Data modules are imported lazily so they don't bloat the client
 * bundle — this only runs at build time.
 */
async function buildHead(url: string) {
  const path = url.split(/[?#]/)[0];
  const canonical = path === "/" ? `${SITE}/` : `${SITE}${path.replace(/\/$/, "")}`;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const elements = new Set<any>();
  elements.add({ type: "link", props: { rel: "canonical", href: canonical } });
  elements.add({ type: "meta", props: { property: "og:url", content: canonical } });

  const STATIC_TITLES: Record<string, string> = {
    "/": "India Prediction Markets — Live Odds for Cricket, Elections & Economy",
    "/about": "About India Predictions – Methodology & Data Sources",
    "/blog": "Blog – India Prediction Market Analysis & Education",
    "/terms": "Terms of Service – India Predictions",
    "/privacy": "Privacy Policy – India Predictions",
    "/disclaimer": "Risk Disclaimer – India Predictions",
  };

  let title = STATIC_TITLES[path] ?? "India Predictions";

  if (path === "/digest") {
    const digest = (await import("./data/digest.json")).default as {
      weekOf: string; summary: string; generatedAt: string;
      items: { title: string; probability: number }[];
    };
    const weekLabel = new Date(digest.weekOf).toLocaleDateString("en-IN", {
      day: "numeric", month: "long", year: "numeric",
    });
    title = `India Prediction Market Digest — Week of ${weekLabel}`;
    elements.add({ type: "meta", props: { name: "description", content: digest.summary.slice(0, 155) } });
    elements.add(ldScript({
      "@context": "https://schema.org", "@type": "Article",
      headline: title, description: digest.summary,
      datePublished: digest.generatedAt, dateModified: digest.generatedAt,
      author: { "@type": "Organization", name: "India Predictions", url: SITE },
      publisher: { "@type": "Organization", name: "India Predictions", url: SITE },
      mainEntityOfPage: `${SITE}/digest`,
    }));
    elements.add(ldScript({
      "@context": "https://schema.org", "@type": "Dataset",
      name: `India Prediction Market Probabilities — Week of ${weekLabel}`,
      description: "Crowd-sourced implied probabilities for the most-watched India prediction-market questions.",
      creator: { "@type": "Organization", name: "India Predictions" },
      dateModified: digest.generatedAt, isAccessibleForFree: true,
      variableMeasured: digest.items.map((i) => ({ "@type": "PropertyValue", name: i.title, value: `${i.probability}%` })),
    }));
  } else if (["/cricket", "/elections", "/economy", "/bollywood"].includes(path)) {
    const { getCategoryHub } = await import("./data/category-hubs");
    const hub = getCategoryHub(path.slice(1));
    if (hub) {
      title = hub.title;
      elements.add({ type: "meta", props: { name: "description", content: hub.metaDescription } });
    }
  } else if (path.startsWith("/blog/")) {
    const { BLOG_POSTS } = await import("./data/blog-posts");
    const slug = path.slice("/blog/".length);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const post = (BLOG_POSTS as any[]).find((p) => p.slug === slug);
    if (post) {
      title = post.title;
      if (post.excerpt) elements.add({ type: "meta", props: { name: "description", content: String(post.excerpt).slice(0, 155) } });
      elements.add(ldScript({
        "@context": "https://schema.org", "@type": "Article",
        headline: post.title, description: post.excerpt ?? post.title,
        datePublished: post.publishedAt, dateModified: post.publishedAt,
        author: { "@type": "Organization", name: "India Predictions", url: SITE },
        publisher: { "@type": "Organization", name: "India Predictions", url: SITE },
        mainEntityOfPage: canonical,
      }));
    }
  }

  return { title, elements };
}

/**
 * Render a React element to a complete HTML string, waiting for all Suspense
 * boundaries (and therefore React.lazy code-split pages) to resolve. Uses the
 * Web-streams renderer (`renderToReadableStream`) and its `allReady` promise.
 * Falls back to the synchronous `renderToString` if the streaming API is not
 * available for some reason.
 */
async function renderToStringWithSuspense(
  server: typeof import("react-dom/server"),
  element: JSX.Element,
): Promise<string> {
  const toReadable = (server as Record<string, unknown>)
    .renderToReadableStream as
    | ((el: JSX.Element) => Promise<ReadableStream<Uint8Array>> & { allReady?: Promise<void> })
    | undefined;

  if (typeof toReadable === "function") {
    const stream = await toReadable(element);
    // Wait for every Suspense boundary to finish (lazy chunks loaded).
    const anyStream = stream as ReadableStream<Uint8Array> & { allReady?: Promise<void> };
    if (anyStream.allReady) await anyStream.allReady;

    const reader = stream.getReader();
    const decoder = new TextDecoder();
    let out = "";
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      out += decoder.decode(value, { stream: true });
    }
    out += decoder.decode();
    return out;
  }

  // Fallback: synchronous render (will not resolve lazy boundaries).
  return server.renderToString(element);
}

/**
 * Install minimal browser-like globals into the Node prerender environment.
 * The plugin already provides `globalThis.location`; we wire `window`,
 * `document`, `history`, storage, and a couple of observers around it so the
 * existing (unmodified) components render without throwing. None of this ships
 * to the client — it only runs inside the `prerender()` path during build.
 */
function installPrerenderGlobals(url: string) {
  const g = globalThis as Record<string, unknown>;

  const loc = (g.location as Record<string, unknown>) ?? {};
  // Ensure pathname/search/href reflect the current route.
  try {
    const u = new URL(url, "http://localhost");
    loc.href = u.href;
    loc.pathname = u.pathname;
    loc.search = u.search;
    loc.hash = u.hash;
    loc.origin = u.origin;
    loc.protocol = u.protocol;
    loc.host = u.host;
    loc.hostname = u.hostname;
    loc.port = u.port;
    loc.assign = () => {};
    loc.replace = () => {};
    loc.reload = () => {};
  } catch {
    /* ignore */
  }
  g.location = loc;

  const noopStorage = (() => {
    const store = new Map<string, string>();
    return {
      getItem: (k: string) => (store.has(k) ? store.get(k)! : null),
      setItem: (k: string, v: string) => void store.set(k, String(v)),
      removeItem: (k: string) => void store.delete(k),
      clear: () => store.clear(),
      key: (i: number) => Array.from(store.keys())[i] ?? null,
      get length() {
        return store.size;
      },
    };
  })();

  const history = {
    state: null,
    length: 1,
    scrollRestoration: "auto",
    pushState: () => {},
    replaceState: () => {},
    go: () => {},
    back: () => {},
    forward: () => {},
  };

  // A permissive DOM-element stub: any unknown property resolves to a no-op
  // function, so calls like `documentElement.getAttribute(...)` (next-themes),
  // `classList.add(...)`, `style.setProperty(...)`, etc. never throw during the
  // string render. Known numeric props return 0 and `style`/`classList` return
  // their own permissive stubs.
  const makeEl = (): unknown => {
    const numericProps = new Set([
      "scrollHeight",
      "clientHeight",
      "scrollTop",
      "offsetHeight",
      "offsetWidth",
      "scrollWidth",
      "clientWidth",
    ]);
    const target: Record<string, unknown> = {
      nodeType: 1,
      tagName: "DIV",
      style: new Proxy(
        { setProperty: () => {}, removeProperty: () => {}, getPropertyValue: () => "" },
        { get: (t, p) => (p in t ? (t as Record<string, unknown>)[p as string] : "") },
      ),
      classList: { add: () => {}, remove: () => {}, toggle: () => {}, contains: () => false },
      dataset: {},
      children: [],
      childNodes: [],
      attributes: [],
      getAttribute: () => null,
      setAttribute: () => {},
      removeAttribute: () => {},
      hasAttribute: () => false,
      appendChild: (c: unknown) => c,
      removeChild: (c: unknown) => c,
      insertBefore: (c: unknown) => c,
      addEventListener: () => {},
      removeEventListener: () => {},
      contains: () => false,
      cloneNode: () => makeEl(),
      querySelector: () => null,
      querySelectorAll: () => [],
    };
    return new Proxy(target, {
      get(t, prop: string) {
        if (prop in t) return (t as Record<string, unknown>)[prop];
        if (numericProps.has(prop)) return 0;
        // Unknown access defaults to a no-op callable (also usable as a value).
        return () => undefined;
      },
    });
  };

  const documentStub = {
    documentElement: makeEl(),
    head: makeEl(),
    body: makeEl(),
    visibilityState: "visible",
    createElement: () => {
      const el = makeEl() as Record<string, unknown>;
      el.relList = { supports: () => false };
      return el;
    },
    createTextNode: () => makeEl(),
    getElementById: () => null,
    getElementsByTagName: () => [],
    querySelector: () => null,
    querySelectorAll: () => [],
    addEventListener: () => {},
    removeEventListener: () => {},
  };

  const win = {
    location: loc,
    history,
    document: documentStub,
    navigator: { userAgent: "prerender", sendBeacon: () => false },
    localStorage: noopStorage,
    sessionStorage: noopStorage,
    scrollY: 0,
    innerHeight: 0,
    innerWidth: 1024,
    matchMedia: () => ({
      matches: false,
      media: "",
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
    }),
    addEventListener: () => {},
    removeEventListener: () => {},
    requestAnimationFrame: (cb: FrameRequestCallback) => {
      cb(0);
      return 0;
    },
    cancelAnimationFrame: () => {},
    getComputedStyle: () => ({ getPropertyValue: () => "" }),
    IntersectionObserver: class {
      observe() {}
      unobserve() {}
      disconnect() {}
      takeRecords() {
        return [];
      }
    },
    ResizeObserver: class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  };

  // react-router's createBrowserHistory reads `document.defaultView` to find
  // the window (and then `.history`). Wire it up so BrowserRouter renders.
  (documentStub as Record<string, unknown>).defaultView = win;

  // Expose on globalThis (don't clobber things the plugin already set up).
  g.window = win;
  if (!g.document) g.document = documentStub;
  if (!g.history) g.history = history;
  if (!g.navigator) g.navigator = win.navigator;
  if (!g.localStorage) g.localStorage = noopStorage;
  if (!g.sessionStorage) g.sessionStorage = noopStorage;
  if (!g.matchMedia) g.matchMedia = win.matchMedia;
  if (!g.IntersectionObserver) g.IntersectionObserver = win.IntersectionObserver;
  if (!g.ResizeObserver) g.ResizeObserver = win.ResizeObserver;
  if (!g.requestAnimationFrame) g.requestAnimationFrame = win.requestAnimationFrame;
  if (!g.cancelAnimationFrame) g.cancelAnimationFrame = win.cancelAnimationFrame;
  if (!g.getComputedStyle) g.getComputedStyle = win.getComputedStyle;
}
