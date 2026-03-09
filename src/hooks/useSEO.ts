import { useEffect } from 'react';

interface SEOMeta {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  /** JSON-LD schema object(s) */
  schema?: object | object[];
}

const BASE_URL = 'https://indianpredictions.lovable.app';
const DEFAULT_IMAGE = 'https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/07c14fad-e803-4809-8654-86579cab78d8/id-preview-a8d4ee2e--5fc81140-cec5-43a7-b277-b2d8ba92190f.lovable.app-1771895603345.png';

function setMeta(name: string, content: string, attr: 'name' | 'property' = 'name') {
  let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setLink(rel: string, href: string) {
  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
}

function setSchema(schema: object | object[]) {
  const id = 'dynamic-schema-ld';
  let el = document.getElementById(id) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement('script');
    el.type = 'application/ld+json';
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(Array.isArray(schema) ? schema : [schema]);
}

export function useSEO({ title, description, keywords, canonical, ogImage, schema }: SEOMeta) {
  useEffect(() => {
    const fullTitle = `${title} | OpinionBazaar`;
    document.title = fullTitle;

    setMeta('description', description);
    if (keywords) setMeta('keywords', keywords);

    const url = canonical ? `${BASE_URL}${canonical}` : `${BASE_URL}${window.location.pathname}`;
    setLink('canonical', url);

    const image = ogImage ?? DEFAULT_IMAGE;

    // Open Graph
    setMeta('og:title', fullTitle, 'property');
    setMeta('og:description', description, 'property');
    setMeta('og:url', url, 'property');
    setMeta('og:image', image, 'property');

    // Twitter
    setMeta('twitter:title', fullTitle);
    setMeta('twitter:description', description);
    setMeta('twitter:image', image);

    // Structured data
    if (schema) setSchema(schema);

    return () => {
      // Restore default title on unmount
      document.title = "OpinionBazaar – India's Opinion Trading Platform";
    };
  }, [title, description, keywords, canonical, ogImage, schema]);
}
