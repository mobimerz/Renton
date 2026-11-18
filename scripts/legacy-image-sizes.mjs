#!/usr/bin/env node
// Writes data/legacy-image-sizes.json: { "/images/x.jpg": [width, height] } for every image
// referenced by the legacy MDX posts' meta (image + ogImage). Read at runtime instead of
// probing /public (which is not available to serverless functions on Vercel).
//   node scripts/legacy-image-sizes.mjs
import fs from "node:fs";
import path from "node:path";
import { imageSize } from "image-size";

const dir = "content/blog";
const out = {};
for (const f of fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"))) {
  const src = fs.readFileSync(path.join(dir, f), "utf8");
  for (const m of src.matchAll(/"(?:image|ogImage)":\s*"([^"]+)"/g)) {
    const p = m[1];
    if (out[p] || !p.startsWith("/")) continue;
    try {
      const { width, height } = imageSize(fs.readFileSync(path.join("public", decodeURIComponent(p))));
      if (width && height) out[p] = [width, height];
    } catch {
      console.warn("missing:", p);
    }
  }
}
fs.writeFileSync("data/legacy-image-sizes.json", JSON.stringify(out, null, 0) + "\n");
console.log(`wrote ${Object.keys(out).length} sizes`);
