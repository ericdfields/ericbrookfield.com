// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { remarkFixImagePaths } from "./src/utils/remark-fix-image-paths.mjs";

// https://astro.build/config
export default defineConfig({
  site: "https://ericbrookfield.com",
  // @astrojs/sitemap emits a static sitemap-index.xml (+ sitemap-0.xml) at
  // build time — GitHub Pages serves them as-is. robots.txt (public/robots.txt)
  // points crawlers at the index. See BRO-972.
  integrations: [sitemap()],
  markdown: {
    remarkPlugins: [remarkFixImagePaths],
  },
});
