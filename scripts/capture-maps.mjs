/**
 * Static snapshots for the click-to-load Google Maps facade (components/MapFacade.tsx).
 *
 * For every Google Maps embed URL used on the site (content MDX + data/*.ts) this renders the real
 * embed in headless Chrome inside an oversized iframe and screenshots its centre, so the result is the
 * same map, zoom and pin with none of Google's corner UI. The facade shows it at native scale, centred,
 * which matches the live iframe at any width; the "Open in Maps" chip and attribution are drawn in HTML.
 *
 * Usage: node scripts/capture-maps.mjs   (needs Chrome; set CHROME_PATH if it's not in the default place)
 * Writes public/images/maps/<id>.webp, <id>@2x.webp and data/map-snapshots.json.
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import puppeteer from "puppeteer-core";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT = path.join(ROOT, "public/images/maps");
const CHROME = process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe";
// Largest map on the site is 1440x430 (Contact at full width); leave headroom for wide screens.
const W = 1920;
const H = 480;
const FRAME_W = W + 1000; // big enough that Google's corner UI falls outside the screenshot
const FRAME_H = H + 900;
const SM_W = 480;
const SM_H = 260;

function findUrls() {
  const files = [];
  const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).forEach((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : files.push(path.join(d, e.name))));
  walk(path.join(ROOT, "content"));
  walk(path.join(ROOT, "data"));
  const urls = new Set();
  for (const f of files.filter((f) => /\.(mdx|ts)$/.test(f)))
    for (const m of fs.readFileSync(f, "utf8").matchAll(/https:\/\/maps\.google\.com\/maps\?[^"'\s)]+/g)) urls.add(m[0]);
  return [...urls];
}

export const mapId = (url) => crypto.createHash("sha1").update(url).digest("hex").slice(0, 10);

const urls = findUrls();
fs.mkdirSync(OUT, { recursive: true });
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true });
const manifest = {};
for (const url of urls) {
  const id = mapId(url);
  const page = await browser.newPage();
  await page.setViewport({ width: W, height: H, deviceScaleFactor: 2 });
  await page.setContent(
    `<!doctype html><style>html,body{margin:0;overflow:hidden}iframe{position:absolute;border:0;width:${FRAME_W}px;height:${FRAME_H}px;left:${(W - FRAME_W) / 2}px;top:${(H - FRAME_H) / 2}px}</style><iframe src="${url.replace(/&/g, "&amp;")}"></iframe>`,
    { waitUntil: "networkidle0", timeout: 90000 },
  );
  await new Promise((r) => setTimeout(r, 4000)); // let label fade-ins finish
  const png = await page.screenshot({ type: "png" });
  await page.close();
  await sharp(png).webp({ quality: 72 }).toFile(path.join(OUT, `${id}@2x.webp`));
  await sharp(png).resize(W, H).webp({ quality: 78 }).toFile(path.join(OUT, `${id}.webp`));
  // small centre crop for maps that are never wider than ~480px (footer column: 392x250 at most)
  const sm = { left: W - SM_W, top: H - SM_H, width: SM_W * 2, height: SM_H * 2 }; // in 2x pixels
  await sharp(png).extract(sm).webp({ quality: 72 }).toFile(path.join(OUT, `${id}-sm@2x.webp`));
  await sharp(png).extract(sm).resize(SM_W, SM_H).webp({ quality: 78 }).toFile(path.join(OUT, `${id}-sm.webp`));
  manifest[url] = id;
  console.log(id, url.slice(0, 90));
}
await browser.close();
fs.writeFileSync(path.join(ROOT, "data/map-snapshots.json"), JSON.stringify({ width: W, height: H, smWidth: SM_W, smHeight: SM_H, maps: manifest }, null, 2) + "\n");
