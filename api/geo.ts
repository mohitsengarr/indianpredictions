/**
 * Vercel Edge Function — /api/geo
 *
 * Returns the visitor's geo data derived from Vercel's automatic IP headers.
 * Called once per session by the client to get geo context for personalization.
 *
 * Privacy: raw IP is never stored or returned. Only derived geo fields.
 */

export const config = { runtime: 'edge' };

export default function handler(request: Request) {
  const geo = {
    country: request.headers.get('x-vercel-ip-country') ?? '',
    region: request.headers.get('x-vercel-ip-country-region') ?? '',
    city: decodeURIComponent(request.headers.get('x-vercel-ip-city') ?? ''),
    timezone: request.headers.get('x-vercel-ip-timezone') ?? '',
  };

  return new Response(JSON.stringify(geo), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'private, max-age=3600', // Cache for 1 hour per user
      'Access-Control-Allow-Origin': '*',
    },
  });
}
