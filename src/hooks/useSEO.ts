import { useEffect, useMemo } from 'react';

interface SEOMeta {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  /** JSON-LD schema object(s) */
  schema?: object | object[];
  /** When true, emit <meta name="robots" content="noindex,follow"> */
  noindex?: boolean;
}

const BASE_URL = 'https://www.indiapredictions.com';
const DEFAULT_IMAGE = 'https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/07c14fad-e803-4809-8654-86579cab78d8/id-preview-a8d4ee2e--5fc81140-cec5-43a7-b277-b2d8ba92190f.lovable.app-1771895603345.png';
const SEO_ATTR = 'data-seo-managed';

/** Sets a meta tag and returns a restore function: removes the tag if this call
 *  created it, otherwise restores the previous content. */
function setMeta(name: string, content: string, attr: 'name' | 'property' = 'name'): () => void {
  let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
  if (!el) {
    const created = document.createElement('meta');
    created.setAttribute(attr, name);
    created.setAttribute(SEO_ATTR, 'true');
    created.setAttribute('content', content);
    document.head.appendChild(created);
    return () => { created.remove(); };
  }
  const prev = el.getAttribute('content');
  el.setAttribute('content', content);
  el.setAttribute(SEO_ATTR, 'true');
  const existing = el;
  return () => {
    if (prev !== null) existing.setAttribute('content', prev);
    else existing.removeAttribute('content');
  };
}

/** Sets a link tag and returns a restore function (same semantics as setMeta). */
function setLink(rel: string, href: string): () => void {
  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    const created = document.createElement('link');
    created.rel = rel;
    created.setAttribute(SEO_ATTR, 'true');
    created.href = href;
    document.head.appendChild(created);
    return () => { created.remove(); };
  }
  const prev = el.getAttribute('href');
  el.href = href;
  el.setAttribute(SEO_ATTR, 'true');
  const existing = el;
  return () => {
    if (prev !== null) existing.setAttribute('href', prev);
    else existing.removeAttribute('href');
  };
}

function setSchema(schema: object | object[]) {
  const id = 'dynamic-schema-ld';
  let el = document.getElementById(id) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement('script');
    el.type = 'application/ld+json';
    el.id = id;
    el.setAttribute(SEO_ATTR, 'true');
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(Array.isArray(schema) ? schema : [schema]);
}

function cleanupSEOMeta() {
  document.querySelectorAll(`[${SEO_ATTR}]`).forEach((el) => {
    if (el.id !== 'dynamic-schema-ld') {
      el.removeAttribute(SEO_ATTR);
    }
  });
  const schemaEl = document.getElementById('dynamic-schema-ld');
  if (schemaEl) schemaEl.remove();
}

export function useSEO({ title, description, keywords, canonical, ogImage, schema, noindex }: SEOMeta) {
  const schemaStr = useMemo(() => (schema ? JSON.stringify(schema) : ''), [schema]);

  useEffect(() => {
    const fullTitle = `${title} | India Predictions`;
    document.title = fullTitle;

    const restores: Array<() => void> = [];

    restores.push(setMeta('description', description));
    if (keywords) restores.push(setMeta('keywords', keywords));
    if (noindex) restores.push(setMeta('robots', 'noindex,follow'));

    const url = canonical ? `${BASE_URL}${canonical}` : `${BASE_URL}${window.location.pathname}`;
    restores.push(setLink('canonical', url));

    const image = ogImage ?? DEFAULT_IMAGE;

    // Open Graph
    restores.push(setMeta('og:title', fullTitle, 'property'));
    restores.push(setMeta('og:description', description, 'property'));
    restores.push(setMeta('og:url', url, 'property'));
    restores.push(setMeta('og:image', image, 'property'));

    // Twitter
    restores.push(setMeta('twitter:title', fullTitle));
    restores.push(setMeta('twitter:description', description));
    restores.push(setMeta('twitter:image', image));

    // Structured data
    if (schemaStr) setSchema(JSON.parse(schemaStr));

    return () => {
      document.title = "India Predictions – Live Prediction Market Odds";
      // Remove tags this run created and restore previous values on tags it mutated.
      restores.forEach((restore) => restore());
      cleanupSEOMeta();
    };
  }, [title, description, keywords, canonical, ogImage, schemaStr, noindex]);
}
