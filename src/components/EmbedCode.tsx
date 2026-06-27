import { useState } from 'react';
import { Code2, Check, Copy } from 'lucide-react';

const SITE = 'https://www.indiapredictions.com';

/**
 * "Embed this market" panel. Outputs an <iframe> (the live card) PLUS a visible
 * attribution <a> link — the <a> is what actually counts as a backlink in the
 * publisher's HTML, so we keep it in the snippet and ask people not to remove it.
 */
export default function EmbedCode({ marketId, title }: { marketId: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const safeTitle = title.replace(/"/g, "'");

  const snippet =
`<iframe src="${SITE}/embed/${marketId}" width="100%" height="240" style="border:0;max-width:380px;width:100%" title="${safeTitle} — live odds | India Predictions" loading="lazy"></iframe>
<p style="font:12px/1.4 system-ui,sans-serif;margin:6px 0 0"><a href="${SITE}/market/${marketId}" target="_blank" rel="noopener">Live odds via India Predictions</a></p>`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked — the code is selectable in the box below */
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <Code2 className="w-4 h-4 text-primary shrink-0" />
          <h3 className="font-display font-bold text-sm">Embed this market</h3>
        </div>
        <button
          onClick={copy}
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:brightness-110 transition-all active:scale-95 shrink-0"
        >
          {copied ? <><Check className="w-3.5 h-3.5" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy embed code</>}
        </button>
      </div>
      <p className="text-[11px] text-muted-foreground mb-2">
        Drop this live odds card into any article — it updates automatically. Please keep the attribution link.
      </p>
      <pre className="text-[10px] leading-relaxed bg-muted/60 border border-border rounded-lg p-2.5 overflow-x-auto text-muted-foreground whitespace-pre-wrap break-all select-all">{snippet}</pre>
    </div>
  );
}
