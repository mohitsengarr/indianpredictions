import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
import { componentTagger } from "lovable-tagger";
import { vitePrerenderPlugin } from "vite-prerender-plugin";

// ── Static routes to prerender ───────────────────────────────────
// Only content-driven routes that don't depend on runtime data. Dynamic
// data routes (/markets, /crypto, /analytics, /insights, /events/*,
// /portfolio, /wallet, /profile) are intentionally left as normal SPA.
const STATIC_ROUTES = ["/", "/about", "/blog", "/terms", "/privacy", "/disclaimer"];

/**
 * Read blog post slugs straight from the source data file so each /blog/<slug>
 * route gets prerendered too. We parse it textually (rather than importing the
 * TS module from a config that may run before transpilation) to keep this
 * robust at config-eval time. If parsing fails we simply prerender no posts —
 * the build still succeeds and those routes fall back to the SPA.
 */
function blogPostRoutes(): string[] {
  try {
    const src = fs.readFileSync(
      path.resolve(__dirname, "./src/data/blog-posts.ts"),
      "utf-8",
    );
    const slugs = new Set<string>();
    const re = /slug:\s*['"]([^'"]+)['"]/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(src)) !== null) slugs.add(m[1]);
    return Array.from(slugs).map((s) => `/blog/${s}`);
  } catch {
    return [];
  }
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    // Prerender static content routes to real HTML at build time so AI
    // crawlers (GPTBot/ClaudeBot/PerplexityBot) and search engines get
    // content instead of an empty <div id="root">.
    vitePrerenderPlugin({
      renderTarget: "#root",
      prerenderScript: path.resolve(__dirname, "./src/main.tsx"),
      additionalPrerenderRoutes: [...STATIC_ROUTES, ...blogPostRoutes()],
    }),
    // Force the build process to exit after the bundle (and prerendering)
    // is fully written. Importing the whole app during prerender leaves open
    // event-loop handles (timers/observers), so `vite build` finishes writing
    // every file but never exits — locally it hangs at 0% CPU, and on Vercel
    // the build is killed on timeout (deployment marked ERROR) despite all
    // files being generated. This runs last (post) so prerendering is done.
    mode !== "development" && {
      name: "force-exit-after-build",
      closeBundle: {
        order: "post" as const,
        sequential: true,
        handler() {
          // Flush stdout, then exit cleanly; hard fallback in case flush stalls.
          process.stdout.write("", () => process.exit(0));
          setTimeout(() => process.exit(0), 800).unref?.();
        },
      },
    },
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
