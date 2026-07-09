// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { remarkFixImagePaths } from "./src/utils/remark-fix-image-paths.mjs";
import { legacyHtmlRedirects } from "./src/redirects.mjs";

// https://astro.build/config
export default defineConfig({
  site: "https://ericbrookfield.com",
  // @astrojs/sitemap emits a static sitemap-index.xml (+ sitemap-0.xml) at
  // build time — GitHub Pages serves them as-is. robots.txt (public/robots.txt)
  // points crawlers at the index. See BRO-972.
  //
  // legacyHtmlRedirects writes a real `.html` redirect file for every legacy
  // Jekyll post URL so inbound backlinks stop hitting 404s and pass their link
  // equity through (BRO-992, audit F5). Real files (not Astro's `redirects`
  // config, which emits `foo.html/index.html` directories) so the exact
  // no-trailing-slash `.html` URL resolves directly on GitHub Pages.
  integrations: [sitemap(), legacyHtmlRedirects()],
  markdown: {
    remarkPlugins: [remarkFixImagePaths],
  },
});
