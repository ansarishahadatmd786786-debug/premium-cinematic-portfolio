import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import site from "./src/data/site.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const siteOrigin = site.canonical.replace(/\/$/, "");

function seoAssets(): Plugin {
  return {
    name: "portfolio-seo-assets",
    transformIndexHtml(html) {
      return html.split("__SITE_ORIGIN__").join(siteOrigin);
    },
    generateBundle() {
      const buildDate = new Date().toISOString().slice(0, 10);
      this.emitFile({
        type: "asset",
        fileName: "sitemap.xml",
        source: `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteOrigin}/</loc>
    <lastmod>${buildDate}</lastmod>
    <priority>1.0</priority>
  </url>
</urlset>
`,
      });
      this.emitFile({
        type: "asset",
        fileName: "robots.txt",
        source: `User-agent: *
Allow: /
Sitemap: ${siteOrigin}/sitemap.xml
`,
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), seoAssets()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
