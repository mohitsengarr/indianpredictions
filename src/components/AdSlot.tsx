import { useEffect } from 'react';

// Set VITE_ADSENSE_CLIENT (e.g. "ca-pub-1234567890123456") in Vercel after your
// AdSense site is approved. Until then this renders nothing — zero UI impact.
const CLIENT = (import.meta.env as Record<string, string | undefined>).VITE_ADSENSE_CLIENT;

/**
 * Google AdSense slot. Renders only when VITE_ADSENSE_CLIENT is configured, so
 * the layout is unaffected until ads are switched on. Keep density low while
 * SEO traffic is still ramping — too many ads can hurt rankings and UX.
 */
export default function AdSlot({ slot, className = '', format = 'auto' }: { slot: string; className?: string; format?: string }) {
  useEffect(() => {
    if (!CLIENT) return;
    if (!document.querySelector('script[data-adsense]')) {
      const s = document.createElement('script');
      s.async = true;
      s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${CLIENT}`;
      s.crossOrigin = 'anonymous';
      s.setAttribute('data-adsense', '1');
      document.head.appendChild(s);
    }
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch {
      /* adsbygoogle not ready yet — it retries on next render */
    }
  }, []);

  if (!CLIENT) return null;

  return (
    <ins
      className={`adsbygoogle block ${className}`}
      style={{ display: 'block' }}
      data-ad-client={CLIENT}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive="true"
    />
  );
}
