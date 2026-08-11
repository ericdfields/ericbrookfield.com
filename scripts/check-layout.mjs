#!/usr/bin/env node
/**
 * Layout smoke check (BRO-2027 category safeguard).
 *
 * Every portfolio page ships with the same acceptance criterion: "no horizontal
 * scroll at 375px." Phase 1 checked it by eye; Phase 2 shipped a regression into
 * the branch (a `<pre>` inside a grid column, where `min-width: auto` floors the
 * track at the widest unbreakable child) that eyeballing the desktop render
 * would not have caught. This turns that criterion into a check.
 *
 * Usage:  node scripts/check-layout.mjs [baseUrl]
 * Assumes a server is already serving the built site (`astro preview`).
 */
import { chromium } from "playwright";

const BASE = process.argv[2] ?? "http://localhost:4321";

const ROUTES = [
    "/",
    "/work/",
    "/work/argus/",
    "/practice/",
    "/archive/",
    "/timeline/",
];

// 375 is the acceptance width; the other two are the "readable at" widths.
const VIEWPORTS = [
    { label: "375", width: 375, height: 812 },
    { label: "768", width: 768, height: 1024 },
    { label: "1440", width: 1440, height: 900 },
];

const browser = await chromium.launch();
const failures = [];

for (const route of ROUTES) {
    for (const vp of VIEWPORTS) {
        const context = await browser.newContext({
            viewport: { width: vp.width, height: vp.height },
        });
        const page = await context.newPage();
        const consoleErrors = [];
        page.on("pageerror", (err) => consoleErrors.push(String(err)));

        const response = await page.goto(BASE + route, {
            waitUntil: "networkidle",
        });
        if (!response || response.status() >= 400) {
            failures.push(`${route} @${vp.label}: HTTP ${response?.status()}`);
            await context.close();
            continue;
        }

        // Overflow is measured on the document, not on individual elements: a
        // `<pre>` that scrolls inside its own box is fine, a `<pre>` that widens
        // the page is not. Report the widest offenders so the fix is obvious.
        const result = await page.evaluate(() => {
            const doc = document.documentElement;
            const culprits = [...document.querySelectorAll("body *")]
                .filter((el) => {
                    const style = getComputedStyle(el);
                    if (style.position === "fixed") return false;
                    if (style.overflowX === "auto" || style.overflowX === "scroll") return false;
                    return el.getBoundingClientRect().right > doc.clientWidth + 1;
                })
                .slice(0, 5)
                .map((el) => {
                    const cls = typeof el.className === "string" ? el.className : "";
                    const right = Math.round(el.getBoundingClientRect().right);
                    return `${el.tagName.toLowerCase()}${cls ? "." + cls.trim().split(/\s+/).join(".") : ""} @${right}px`;
                });
            return { scrollWidth: doc.scrollWidth, clientWidth: doc.clientWidth, culprits };
        });

        if (result.scrollWidth > result.clientWidth) {
            failures.push(
                `${route} @${vp.label}: horizontal scroll (${result.scrollWidth} > ${result.clientWidth})` +
                    (result.culprits.length ? ` — ${result.culprits.join(", ")}` : ""),
            );
        }
        if (consoleErrors.length) {
            failures.push(`${route} @${vp.label}: page error — ${consoleErrors[0]}`);
        }

        await context.close();
    }
}

await browser.close();

if (failures.length) {
    console.error("Layout check failed:\n" + failures.map((f) => "  ✗ " + f).join("\n"));
    process.exit(1);
}

console.log(`Layout check passed: ${ROUTES.length} routes × ${VIEWPORTS.length} viewports, no horizontal scroll.`);
