// Build-time redirects for the legacy `.html` post URLs (BRO-992, audit F5).
//
// Every blog post was originally published under a Jekyll-style URL ending in
// `.html` (e.g. /2023/01/20/robots-sunflowers.html). The current Astro routes
// serve the extensionless, trailing-slash form (/2023/01/20/robots-sunflowers/),
// so every one of the old `.html` URLs now 404s — wasting the link equity from
// inbound backlinks (e.g. /2023/01/20/robots-sunflowers.html carries an active
// external link).
//
// GitHub Pages supports no server-side redirects, so we emit a static HTML stub
// at each legacy path with an instant `<meta http-equiv="refresh">` and a
// `<link rel="canonical">` to the live URL. Google treats an instant
// meta-refresh as a 301. We write a REAL file (dist/.../slug.html) rather than
// use Astro's `redirects` config — that config emits a `slug.html/index.html`
// directory, so the exact no-trailing-slash `.html` URL the backlinks use would
// only resolve via GitHub Pages' directory-slash handling. A real file resolves
// the exact URL directly.

import { readdirSync, readFileSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BLOG_DIR = join(__dirname, "content", "blog");

/** Recursively collect every `.md` file under a directory. */
function walkMarkdown(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkMarkdown(full));
    else if (entry.isFile() && entry.name.endsWith(".md")) out.push(full);
  }
  return out;
}

/**
 * Map each legacy `/YYYY/MM/DD/slug.html` path to its live route
 * `/YYYY/MM/DD/slug/` (the extensionless, trailing-slash canonical form).
 * @returns {Record<string, string>}
 */
export function buildPostRedirects() {
  /** @type {Record<string, string>} */
  const redirects = {};

  for (const file of walkMarkdown(BLOG_DIR)) {
    const raw = readFileSync(file, "utf8");
    const match = raw.match(/^url:\s*(\S+)\s*$/m);
    if (!match) continue;

    const oldUrl = match[1].replace(/^["']|["']$/g, "");
    if (!/^\/\d{4}\/\d{2}\/\d{2}\/[^/]+\.html$/.test(oldUrl)) continue;

    redirects[oldUrl] = oldUrl.replace(/\.html$/, "/");
  }

  return redirects;
}

const SITE = "https://ericbrookfield.com";

/** Minimal redirect stub: instant meta-refresh + canonical to the live URL. */
function redirectHtml(liveUrl) {
  const abs = `${SITE}${liveUrl}`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Redirecting…</title>
<meta http-equiv="refresh" content="0; url=${liveUrl}">
<meta name="robots" content="noindex">
<link rel="canonical" href="${abs}">
</head>
<body>
<p>This page has moved to <a href="${liveUrl}">${abs}</a>.</p>
</body>
</html>
`;
}

/**
 * Astro integration: after the build, write a real `.html` redirect file for
 * every legacy post URL into the output directory.
 * @returns {import('astro').AstroIntegration}
 */
export function legacyHtmlRedirects() {
  return {
    name: "legacy-html-redirects",
    hooks: {
      "astro:build:done": async ({ dir, logger }) => {
        const outDir = fileURLToPath(dir);
        const redirects = buildPostRedirects();
        let count = 0;
        for (const [oldUrl, liveUrl] of Object.entries(redirects)) {
          const filePath = join(outDir, oldUrl.replace(/^\//, ""));
          await mkdir(dirname(filePath), { recursive: true });
          await writeFile(filePath, redirectHtml(liveUrl), "utf8");
          count += 1;
        }
        logger.info(`Wrote ${count} legacy .html redirect stub(s)`);
      },
    },
  };
}
