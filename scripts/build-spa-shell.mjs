// Generates dist/client/index.html as a static SPA shell.
// Runs after `vite build` because the TanStack SPA prerender step fails
// when combined with the Nitro/Cloudflare adapter (looks for dist/server/server.js
// but Nitro emits dist/server/index.mjs). Cloudflare Pages serves dist/client/.
import { readdirSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const clientDir = "dist/client";
const assetsDir = join(clientDir, "assets");

if (!existsSync(assetsDir)) {
  console.error(`[spa-shell] ${assetsDir} not found — run 'vite build' first`);
  process.exit(1);
}

const files = readdirSync(assetsDir);
const entryJs = files.find((f) => /^index-[A-Za-z0-9_-]+\.js$/.test(f));
const entryCss = files.find((f) => /^styles-[A-Za-z0-9_-]+\.css$/.test(f));

if (!entryJs) {
  console.error("[spa-shell] could not find entry JS (assets/index-*.js)");
  process.exit(1);
}

const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Sri Durga Ji Food Industries — Premium Flour Mill (Maida, Suji, Atta, Wheat Bran)</title>
    <meta name="description" content="Premium flour manufacturer since 1992. Maida, Suji, Wheat Bran, Atta — bulk supply, dealer pricing and pan-India distribution from Ludhiana, Punjab." />
    <meta property="og:title" content="Sri Durga Ji Food Industries — Premium Flour Mill" />
    <meta property="og:description" content="Premium flour manufacturer since 1992. Maida, Suji, Wheat Bran, Atta — bulk supply, dealer pricing and pan-India distribution from Ludhiana, Punjab." />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />
${entryCss ? `    <link rel="stylesheet" href="/assets/${entryCss}" />\n` : ""}    <link rel="modulepreload" href="/assets/${entryJs}" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/assets/${entryJs}"></script>
  </body>
</html>
`;

writeFileSync(join(clientDir, "index.html"), html);
console.log(`[spa-shell] wrote ${clientDir}/index.html (entry=${entryJs}${entryCss ? `, css=${entryCss}` : ""})`);
