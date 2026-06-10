/**
 * Geo Context — Provides visitor geo data across the app.
 *
 * On mount, calls /api/geo (Vercel edge function) to get country/region/timezone.
 * Falls back to timezone detection if API fails.
 * Caches result in sessionStorage to avoid repeated calls.
 */

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export interface GeoData {
  country: string;   // "IN", "US", etc.
  region: string;    // "MH", "TN", "KA" (state code)
  city: string;      // "Mumbai", "Chennai"
  timezone: string;  // "Asia/Kolkata"
  isIndia: boolean;
  regionName: string; // "Maharashtra", "Tamil Nadu"
}

const INDIAN_STATES: Record<string, string> = {
  AP: 'Andhra Pradesh', AR: 'Arunachal Pradesh', AS: 'Assam', BR: 'Bihar',
  CT: 'Chhattisgarh', GA: 'Goa', GJ: 'Gujarat', HR: 'Haryana',
  HP: 'Himachal Pradesh', JH: 'Jharkhand', KA: 'Karnataka', KL: 'Kerala',
  MP: 'Madhya Pradesh', MH: 'Maharashtra', MN: 'Manipur', ML: 'Meghalaya',
  MZ: 'Mizoram', NL: 'Nagaland', OR: 'Odisha', PB: 'Punjab',
  RJ: 'Rajasthan', SK: 'Sikkim', TN: 'Tamil Nadu', TG: 'Telangana',
  TR: 'Tripura', UP: 'Uttar Pradesh', UT: 'Uttarakhand', WB: 'West Bengal',
  AN: 'Andaman & Nicobar', CH: 'Chandigarh', DL: 'Delhi', DN: 'Dadra & Nagar Haveli',
  DD: 'Daman & Diu', JK: 'Jammu & Kashmir', LA: 'Ladakh', LD: 'Lakshadweep',
  PY: 'Puducherry',
};

const DEFAULT_GEO: GeoData = {
  country: '',
  region: '',
  city: '',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone ?? '',
  isIndia: false,
  regionName: '',
};

const CACHE_KEY = 'ip_geo_data';

const GeoContext = createContext<GeoData>(DEFAULT_GEO);

export function GeoProvider({ children }: { children: ReactNode }) {
  const [geo, setGeo] = useState<GeoData>(() => {
    // Restore from sessionStorage if available
    try {
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) return JSON.parse(cached) as GeoData;
    } catch { /* ignore */ }
    return DEFAULT_GEO;
  });

  useEffect(() => {
    // Skip if already resolved
    if (geo.country) return;

    const controller = new AbortController();
    fetch('/api/geo', { signal: controller.signal })
      .then(r => r.json())
      .then((data: { country: string; region: string; city: string; timezone: string }) => {
        const resolved: GeoData = {
          country: data.country,
          region: data.region,
          city: data.city,
          timezone: data.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
          isIndia: data.country === 'IN',
          regionName: INDIAN_STATES[data.region] ?? data.region,
        };
        setGeo(resolved);
        try { sessionStorage.setItem(CACHE_KEY, JSON.stringify(resolved)); } catch { /* ignore */ }
      })
      .catch((err: unknown) => {
        // Aborted fetch (unmount / StrictMode double-invoke) is not a failure —
        // don't write the timezone-guess fallback into sessionStorage.
        if ((err as { name?: string } | null)?.name === 'AbortError') return;
        // Fallback: detect India from timezone
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const likelyIndia = tz === 'Asia/Kolkata' || tz === 'Asia/Calcutta';
        const fallback: GeoData = {
          ...DEFAULT_GEO,
          timezone: tz,
          isIndia: likelyIndia,
          country: likelyIndia ? 'IN' : '',
        };
        setGeo(fallback);
        try { sessionStorage.setItem(CACHE_KEY, JSON.stringify(fallback)); } catch { /* ignore */ }
      });

    return () => controller.abort();
  }, [geo.country]);

  return <GeoContext.Provider value={geo}>{children}</GeoContext.Provider>;
}

export function useGeo(): GeoData {
  return useContext(GeoContext);
}

export default GeoContext;
