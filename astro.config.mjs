// @ts-check
import { defineConfig } from "astro/config";
import { remarkFixImagePaths } from "./src/utils/remark-fix-image-paths.mjs";

// https://astro.build/config
export default defineConfig({
  markdown: {
    remarkPlugins: [remarkFixImagePaths],
  },
});
