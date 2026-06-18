// Build step for the Priority Designer site.
//
// The site is authored as classic (non-module) .jsx files that share globals
// across <script> tags — exactly how @babel/standalone used to run them in the
// browser. To preserve that semantics WITHOUT shipping Babel or doing runtime
// transpilation, we concatenate each page's sources in their original load
// order into one string, transpile + minify that string once, and emit a
// single classic script per page in dist/. (Do NOT switch to esbuild bundling
// via import/export — the sources rely on shared global scope, not modules.)

import * as esbuild from "esbuild";
import { readFile, writeFile, mkdir } from "node:fs/promises";

const OUT = "dist";

// Per-page source groupings, mirroring the old `type="text/babel"` tags.
// The dev-only tweaks panel (tweaks-panel.jsx + tweaks.jsx) is intentionally
// dropped from the production index bundle.
const PAGES = {
  index:        ["data.jsx", "usmap.jsx", "sections.jsx", "app.jsx"],
  about:        ["data.jsx", "sections.jsx", "about-app.jsx"],
  blog:         ["data.jsx", "sections.jsx", "blog-app.jsx"],
  contact:      ["data.jsx", "sections.jsx", "contact-app.jsx"],
  discontinued: ["data.jsx", "sections.jsx", "discontinued-app.jsx"],
  portfolio:    ["data.jsx", "sections.jsx", "portfolio-app.jsx"],
  materials:    ["data.jsx", "sections.jsx", "materials-app.jsx"],
};

async function buildPage(name, files) {
  // Each source is wrapped in a bare sloppy-mode block `{ … }`. This replicates
  // exactly how @babel/standalone ran each text/babel script in its own
  // global-eval scope:
  //   • `function`/`var` declarations are hoisted out of the block to the
  //     shared script scope (Annex B.3.3) — so components defined in one file
  //     (e.g. EthosEcho in sections.jsx) stay visible to the others, just like
  //     the old implicit global-leak.
  //   • `const`/`let`/`class` stay block-local — so the repeated
  //     `const { useState, useEffect, useRef } = React;` in multiple files no
  //     longer collide.
  // No source declares "use strict", so sloppy-mode semantics apply.
  const parts = [];
  for (const f of files) {
    const src = await readFile(f, "utf8");
    parts.push(`/* ${f} */\n{\n${src}\n}`);
  }
  const combined = parts.join("\n");
  const result = await esbuild.transform(combined, {
    loader: "jsx",
    minify: true,
    target: "es2019",
    // Classic-script output: no IIFE/module wrapper, so top-level
    // const/function declarations stay visible to the rest of the script
    // (matching the prior cross-script global-sharing behaviour).
    format: undefined,
    legalComments: "none",
  });
  await writeFile(`${OUT}/${name}.js`, result.code);
  return result.code.length;
}

async function buildCss() {
  const css = await readFile("styles.css", "utf8");
  const result = await esbuild.transform(css, {
    loader: "css",
    minify: true,
    legalComments: "none",
  });
  await writeFile(`${OUT}/styles.css`, result.code);
  return result.code.length;
}

async function buildAll() {
  await mkdir(OUT, { recursive: true });
  const tasks = Object.entries(PAGES).map(async ([name, files]) => {
    const bytes = await buildPage(name, files);
    console.log(`  dist/${name}.js  ${(bytes / 1024).toFixed(1)} KB`);
  });
  tasks.push(
    buildCss().then((b) => console.log(`  dist/styles.css  ${(b / 1024).toFixed(1)} KB`)),
  );
  await Promise.all(tasks);
}

const watch = process.argv.includes("--watch");

await buildAll();
console.log("build complete.");

if (watch) {
  const { watch: fsWatch } = await import("node:fs");
  console.log("watching for changes…");
  let timer = null;
  const rebuild = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      buildAll().then(() => console.log("rebuilt.")).catch((e) => console.error(e));
    }, 100);
  };
  for (const f of [...new Set(Object.values(PAGES).flat()), "styles.css"]) {
    fsWatch(f, rebuild);
  }
}
