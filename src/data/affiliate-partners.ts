/**
 * Legal fintech affiliate partners (Indian discount brokers / investing apps).
 *
 * To activate:
 *   1. Join each program's referral/affiliate scheme (Zerodha, Groww, Upstox,
 *      Angel One — all have one) and copy YOUR referral link.
 *   2. Paste it into `url` below.
 *   3. Set AFFILIATES_ENABLED = true.
 *
 * Only partners with a non-empty `url` render, so it's safe to flip on
 * incrementally. Links use rel="sponsored" + a visible disclosure (ASCI/FTC).
 */
export const AFFILIATES_ENABLED = false;

export interface AffiliatePartner {
  name: string;
  blurb: string;
  url: string; // your referral link — leave '' to hide this partner
  cta?: string;
}

export const BROKER_PARTNERS: AffiliatePartner[] = [
  { name: 'Zerodha', blurb: "India's largest discount broker — stocks, F&O & mutual funds.", url: '', cta: 'Open account' },
  { name: 'Groww', blurb: 'Beginner-friendly investing — stocks, mutual funds & US stocks.', url: '', cta: 'Start investing' },
  { name: 'Upstox', blurb: 'Low-cost trading & investing app.', url: '', cta: 'Open account' },
  { name: 'Angel One', blurb: 'Full-service broker with research & advisory.', url: '', cta: 'Open account' },
];
