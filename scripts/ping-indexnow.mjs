#!/usr/bin/env node
/**
 * ping-indexnow.mjs
 * Notifies IndexNow (Bing, Yandex, Naver, Seznam, and other participating
 * engines) that the site's URLs have changed, so fresh content is crawled in
 * minutes instead of waiting for the next scheduled crawl. Run after the data
 * scrapers regenerate the sitemap.
 *
 * No account or secret needed — IndexNow authenticates via a key file hosted
 * at the site root (public/<key>.txt), which must contain exactly the key.
 */

import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const HOST = 'www.indiapredictions.com';
const KEY = 'f5f417ea0737f0cd70ce4338d6e58795'; // matches public/<KEY>.txt
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

/** Pull <loc> URLs from the generated sitemap. */
function sitemapUrls() {
  const file = join(ROOT, 'public', 'sitemap.xml');
  if (!existsSync(file)) return [];
  const xml = readFileSync(file, 'utf-8');
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

async function main() {
  const urlList = sitemapUrls();
  if (urlList.length === 0) {
    console.log('No sitemap URLs found — nothing to submit to IndexNow.');
    return;
  }

  const body = { host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList };

  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  });

  // IndexNow returns 200 (accepted) or 202 (accepted, validation pending).
  if (res.ok || res.status === 202) {
    console.log(`IndexNow: submitted ${urlList.length} URLs (HTTP ${res.status}).`);
  } else {
    console.error(`IndexNow submit failed: HTTP ${res.status} ${(await res.text()).slice(0, 200)}`);
    // Non-fatal — don't fail the whole workflow over an indexing ping.
  }
}

main().catch((e) => { console.error('IndexNow ping error (non-fatal):', e.message); });
