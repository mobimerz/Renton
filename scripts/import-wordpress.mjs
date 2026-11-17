#!/usr/bin/env node
/**
 * One-off WordPress -> MDX importer for Elementor-built pages and blog posts.
 *
 *   node scripts/import-wordpress.mjs
 *
 * Reads the crawled HTML in docs/audit-data/raw/html (crawled 2026-11-17) and writes:
 *   content/pages/<slug>.mdx   (Elementor pages: service pages, careers, privacy, terms)
 *   content/blog/<slug>.mdx    (the 37 blog posts)
 *   content/blog/index.ts      (static list of post modules + metadata, used by /blog/, /feed/ ...)
 *   public/elementor/post-<id>.css  (each page's own Elementor CSS, transitions stripped)
 *
 * Text widgets become Markdown so copy stays editable; other widgets become components from
 * components/elementor/* that render Elementor-compatible markup, so the page's original
 * Elementor CSS (sizes, colours, spacing, breakpoints) applies unchanged.
 */
import fs from "node:fs";
import path from "node:path";
import { JSDOM } from "jsdom";
import TurndownService from "turndown";
import { gfm } from "turndown-plugin-gfm";
import { imageSize } from "image-size";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "..");
const RAW = path.join(ROOT, "docs/audit-data/raw");
const AUDIT = path.join(ROOT, "docs/audit-data");
const BASE = "https://www.renton.org.in/";
const HEADER_FOOTER_IDS = new Set(["8942", "9216"]);

const PAGES = [
  "laptop-rental-services",
  "laptop-rental-in-electronic-city",
  "annual-maintenance-contract-services",
  "careers",
  "privacy-policy",
  "terms-and-conditions",
  "blog",
];
const posts = JSON.parse(fs.readFileSync(path.join(AUDIT, "posts.json"), "utf8"));

/** Meta descriptions written for URLs that had none on WordPress (approved 2026-11-17). */
const NEW_DESCRIPTIONS = {
  careers:
    "Careers at Renton Technologies, Electronic City: apply for our 90-day digital growth and marketing internship and explore current job openings in Bangalore.",
  "privacy-policy":
    "Read the Renton Technologies LLP privacy policy: what information we collect, how we use and protect it, and your rights when using our IT services and rentals.",
  "terms-and-conditions":
    "Terms and conditions for renting IT equipment from Renton Technologies LLP: rental period, payments, use, damage, data sanitization, delivery and cancellations.",
  "it-asset-disposal-in-electronic-city":
    "Secure IT asset disposal in Electronic City: certified data erasure and safe retirement of laptops, desktops, servers and storage devices for your business.",
  "why-renting-it-equipment-is-the-smartest-decision":
    "Why renting IT equipment is the smartest business decision in 2026: save capital, stay up to date, scale quickly and cut maintenance with Renton Technologies.",
};

/* ------------------------------------------------------------------ helpers */

const SIZE_RE = /-\d+x\d+(\.[a-zA-Z]+)$/;
function localImg(src) {
  if (!src) return src;
  const sized = decodeURIComponent(src.split("?")[0].split("/").pop()).replace(/‑/g, "-");
  // A few images were served as hard-cropped WordPress sizes; keep those when a local crop exists.
  if (SIZE_RE.test(sized) && fs.existsSync(path.join(ROOT, "public/images", sized))) return "/images/" + sized;
  return "/images/" + sized.replace(SIZE_RE, "$1");
}
function localHref(h) {
  if (!h) return h;
  for (const b of [BASE, "https://renton.org.in/", "http://www.renton.org.in/", "http://renton.org.in/"]) {
    if (h.startsWith(b)) {
      if (h.includes("/wp-content/uploads/")) return localImg(h);
      return "/" + h.slice(b.length);
    }
  }
  return h;
}
/** Real pixel size of a local image (the live <img> width/height attributes describe a resized copy). */
function dims(localSrc, fallbackW, fallbackH) {
  try {
    const { width, height } = imageSize(fs.readFileSync(path.join(ROOT, "public", decodeURIComponent(localSrc))));
    return { width, height };
  } catch {
    return { width: fallbackW ? parseInt(fallbackW) : undefined, height: fallbackH ? parseInt(fallbackH) : undefined };
  }
}
const keepClass = (c) =>
  (c.startsWith("elementor-") || c.startsWith("e-") || c === "e-con" || c === "e-flex" || c === "e-grid") &&
  !["elementor-invisible", "elementor-widget-empty"].includes(c);
const classes = (el) => [...el.classList].filter(keepClass).join(" ");
const jsxStr = (s) => JSON.stringify(s ?? "");
const textOf = (el) => (el?.textContent ?? "").replace(/\s+/g, " ").trim();

const EMOJI = { "✅": "2705", "✔": "2714", "\u{1F4DE}": "1f4de", "\u{1F310}": "1f310", "\u{1F4CD}": "1f4cd", "\u{1F449}": "1f449" };
// (?<!char=") so an already-converted <Emoji char="…" /> is never converted again
const EMOJI_RE = new RegExp(`(?<!char=")(${Object.keys(EMOJI).join("|")})\\uFE0F?`, "gu");

/** Escape characters that MDX would otherwise treat as JSX/expressions. */
const escapeMdx = (s) => s.replace(/[{}]/g, (m) => "\\" + m).replace(/</g, "&lt;").replace(/>/g, "&gt;");
const withEmoji = (s) => s.replace(EMOJI_RE, (_m, ch) => `<Emoji char="${ch}" />`);

/* ------------------------------------------------------------- turndown */

const td = new TurndownService({
  headingStyle: "atx",
  bulletListMarker: "-",
  emDelimiter: "*",
  strongDelimiter: "**",
  // WordPress keeps empty spacer blocks (<p>&nbsp;</p>, <div>&nbsp;</div>); they render as a blank line.
  blankReplacement: (_content, node) => {
    const tag = node.nodeName.toLowerCase();
    if ((tag === "p" || tag === "div") && /\u00a0/.test(node.textContent)) return `\n\n<${tag}>{"\\u00a0"}</${tag}>\n\n`;
    return node.isBlock ? "\n\n" : "";
  },
});
td.use(gfm);
td.escape = (s) => TurndownService.prototype.escape.call(td, s).replace(/[{}]/g, (m) => "\\" + m).replace(/</g, "&lt;").replace(/>/g, "&gt;");
td.addRule("link", {
  filter: "a",
  replacement(content, node) {
    const href = localHref(node.getAttribute("href") || "");
    if (!href) return content;
    const url = href.replace(/\s/g, "%20").replace(/\(/g, "%28").replace(/\)/g, "%29");
    // New-tab links use the title "_blank" as a marker (see mdx-components.tsx); raw <a> JSX at the
    // start of a line would turn the paragraph into a block element and drop its <p>.
    if (node.getAttribute("target") === "_blank") return `[${content}](${url} "_blank")`;
    return `[${content}](${url})`;
  },
});
td.addRule("image", {
  filter: "img",
  replacement(_c, node) {
    const alt = node.getAttribute("alt") || "";
    if (node.classList.contains("emoji")) return `<Emoji char=${jsxStr(alt)} />`;
    const src = localImg(node.getAttribute("data-src") || node.getAttribute("src"));
    const { width: w, height: h } = dims(src, node.getAttribute("width"), node.getAttribute("height"));
    return `<InlineImage src=${jsxStr(src)} alt=${jsxStr(alt)}${w ? ` width={${w}}` : ""}${h ? ` height={${h}}` : ""} />`;
  },
});
/**
 * Tables stay as (JSX) HTML: Markdown tables would drop the <p> tags inside cells and turn the first
 * row into <th>, both of which change the layout compared with WordPress.
 */
const TABLE_TAGS = new Set(["table", "thead", "tbody", "tfoot", "tr", "td", "th", "caption", "p", "strong", "b", "em", "i", "u", "br", "a", "ul", "ol", "li", "span", "sup", "sub"]);
function tableJsx(node) {
  if (node.nodeType === 3) return escapeMdx(node.nodeValue.replace(/\s+/g, " "));
  if (node.nodeType !== 1) return "";
  const tag = node.nodeName.toLowerCase();
  const kids = [...node.childNodes].map(tableJsx).join("");
  if (!TABLE_TAGS.has(tag) || tag === "span") return kids;
  if (tag === "br") return "<br />";
  const a = [];
  if (tag === "a" && node.getAttribute("href")) a.push(`href=${jsxStr(localHref(node.getAttribute("href")))}`);
  for (const [k, j] of [["colspan", "colSpan"], ["rowspan", "rowSpan"]]) if (node.getAttribute(k)) a.push(`${j}={${parseInt(node.getAttribute(k))}}`);
  return `<${tag}${a.length ? " " + a.join(" ") : ""}>${kids}</${tag}>`;
}
td.addRule("table", {
  filter: "table",
  // emoji are converted once, later, by htmlToMd()
  replacement: (_c, node) => `\n\n${tableJsx(node)}\n\n`,
});
/** Two lists back to back must stay two lists (Markdown would merge them into one "loose" list). */
td.addRule("listBreak", {
  filter: (node) => (node.nodeName === "UL" || node.nodeName === "OL") && /^(UL|OL)$/.test(node.nextElementSibling?.nodeName ?? ""),
  replacement: (content, node) => {
    const parentIsLi = node.parentNode.nodeName === "LI";
    return (parentIsLi ? "\n" : "\n\n") + content.replace(/\n+$/, "") + "\n\n{/* list break */}\n\n";
  },
});
/** A <br> at the very start or end of a block still adds a line on WordPress; Markdown would drop it. */
td.addRule("edgeBr", {
  filter: (node) => {
    if (node.nodeName !== "BR") return false;
    const blank = (n) => n && n.nodeType === 3 && !n.nodeValue.trim();
    let next = node.nextSibling;
    while (blank(next)) next = next.nextSibling;
    let prev = node.previousSibling;
    while (blank(prev)) prev = prev.previousSibling;
    return !next || !prev;
  },
  replacement: () => "<br />",
});
td.addRule("underline", { filter: ["u"], replacement: (c) => `<u>${c}</u>` });
td.addRule("supsub", { filter: ["sup", "sub"], replacement: (c, n) => `<${n.nodeName.toLowerCase()}>${c}</${n.nodeName.toLowerCase()}>` });
/** Inline font sizes (a few posts) change wrapping on phones, so they are kept. */
td.addRule("inlineFontSize", {
  filter: (node) => ["SPAN", "STRONG"].includes(node.nodeName) && /font-size\s*:/i.test(node.getAttribute("style") || ""),
  replacement: (content, node) => {
    const size = (node.getAttribute("style").match(/font-size\s*:\s*([^;]+)/i) || [])[1]?.trim();
    const tag = node.nodeName.toLowerCase();
    // {""} keeps a line that starts with this tag inside its paragraph (MDX would otherwise treat it as a block)
    return `{""}<${tag} style={{ fontSize: ${jsxStr(size)} }}>${content}</${tag}>`;
  },
});
td.addRule("span", { filter: ["span", "font"], replacement: (c) => c });
td.remove(["script", "style", "noscript", "iframe"]);

function htmlToMd(html) {
  let md = td.turndown(html || "");
  md = withEmoji(md);
  // Non-breaking spaces are kept: they decide where lines wrap, as on WordPress.
  return md.trim();
}

/* ---------------------------------------------------------- serialisers */

// MDX: nested JSX is not indented, otherwise a closing tag after a list is read as part of the list.
const ind = (_n) => "";
const attrs = (o) =>
  Object.entries(o)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    // JSX string attributes can't contain escapes, so values with quotes/backslashes/newlines become expressions
    .map(([k, v]) => (typeof v === "string" && !/["\\\n]/.test(v) ? `${k}=${jsxStr(v)}` : `${k}={${JSON.stringify(v)}}`))
    .join(" ");

const FA = (i) => {
  const cls = [...(i?.classList ?? [])];
  const name = cls.find((c) => c.startsWith("fa-") && c !== "fa-fw");
  const style = cls.includes("fab") ? "brands" : cls.includes("far") ? "regular" : "solid";
  return name ? `${style}:${name.slice(3)}` : undefined;
};

function widget(el, d, report) {
  const type = (el.getAttribute("data-widget_type") || "").split(".")[0];
  const id = el.getAttribute("data-id");
  const cls = classes(el);
  const c = el.querySelector(":scope > .elementor-widget-container") || el;
  const base = { id, cls };
  report.types[type] = (report.types[type] || 0) + 1;

  switch (type) {
    case "heading": {
      const h = c.querySelector(".elementor-heading-title") || c.firstElementChild;
      const a = h?.querySelector("a");
      return `${ind(d)}<Heading ${attrs({ ...base, tag: h?.tagName.toLowerCase(), titleCls: [...(h?.classList ?? [])].join(" "), href: a ? localHref(a.getAttribute("href")) : undefined })}>${withEmoji(escapeMdx(textOf(h)))}</Heading>`;
    }
    case "text-editor": {
      const md = htmlToMd(c.innerHTML);
      return `${ind(d)}<Text ${attrs(base)}>\n\n${md}\n\n${ind(d)}</Text>`;
    }
    case "image": {
      const img = c.querySelector("img");
      if (!img) return `${ind(d)}<Widget ${attrs({ ...base, type })} />`;
      const a = c.querySelector("a");
      const cap = c.querySelector("figcaption");
      const src = localImg(img.getAttribute("data-src") || img.getAttribute("src"));
      return `${ind(d)}<Image ${attrs({
        ...base,
        src,
        alt: img.getAttribute("alt") || "",
        ...dims(src, img.getAttribute("width"), img.getAttribute("height")),
        href: a ? localHref(a.getAttribute("href")) : undefined,
        caption: cap ? textOf(cap) : undefined,
      })} />`;
    }
    case "button": {
      const a = c.querySelector("a, button");
      const icon = c.querySelector(".elementor-button-icon i");
      return `${ind(d)}<Button ${attrs({
        ...base,
        text: textOf(c.querySelector(".elementor-button-text") || a),
        href: a?.getAttribute("href") ? localHref(a.getAttribute("href")) : undefined,
        btnCls: [...(a?.classList ?? [])].join(" "),
        icon: FA(icon),
        iconAlign: c.querySelector(".elementor-button-icon") ? (c.querySelector(".elementor-align-icon-right, .elementor-button-icon-right") ? "right" : "left") : undefined,
      })} />`;
    }
    case "accordion":
    case "toggle": {
      const items = [...c.querySelectorAll(type === "accordion" ? ".elementor-accordion-item" : ".elementor-toggle-item")];
      const first = items[0]?.querySelector(".elementor-tab-title");
      const iconWrap = first?.querySelector(".elementor-accordion-icon, .elementor-toggle-icon");
      const closed = FA(iconWrap?.querySelector(".elementor-accordion-icon-closed i, .elementor-toggle-icon-closed i"));
      const opened = FA(iconWrap?.querySelector(".elementor-accordion-icon-opened i, .elementor-toggle-icon-opened i"));
      const iconAlign = iconWrap ? ([...iconWrap.classList].find((x) => /icon-(left|right)$/.test(x))?.split("-").pop() ?? "left") : undefined;
      const Comp = type === "accordion" ? "Accordion" : "Toggle";
      const kids = items
        .map((it) => {
          const t = it.querySelector(".elementor-tab-title");
          const q = textOf(t.querySelector(".elementor-accordion-title, .elementor-toggle-title") || t);
          const body = it.querySelector(".elementor-tab-content");
          return `${ind(d + 1)}<Item title={${JSON.stringify(q)}}>\n\n${htmlToMd(body?.innerHTML)}\n\n${ind(d + 1)}</Item>`;
        })
        .join("\n");
      return `${ind(d)}<${Comp} ${attrs({ ...base, titleTag: first?.tagName.toLowerCase(), closedIcon: closed, openedIcon: opened, iconAlign })}>\n${kids}\n${ind(d)}</${Comp}>`;
    }
    case "image-box": {
      const img = c.querySelector("img");
      const t = c.querySelector(".elementor-image-box-title");
      const desc = c.querySelector(".elementor-image-box-description");
      const a = c.querySelector("a");
      return `${ind(d)}<ImageBox ${attrs({
        ...base,
        src: img ? localImg(img.getAttribute("data-src") || img.getAttribute("src")) : undefined,
        alt: img?.getAttribute("alt") ?? undefined,
        width: img?.getAttribute("width") ? parseInt(img.getAttribute("width")) : undefined,
        height: img?.getAttribute("height") ? parseInt(img.getAttribute("height")) : undefined,
        title: textOf(t),
        titleTag: t?.tagName.toLowerCase(),
        href: a ? localHref(a.getAttribute("href")) : undefined,
      })}>${desc ? htmlToMd(desc.innerHTML).replace(/\n+/g, " ") : ""}</ImageBox>`;
    }
    case "social-icons": {
      const items = [...c.querySelectorAll("a.elementor-social-icon")].map((a) => ({
        href: a.getAttribute("href"),
        label: textOf(a.querySelector(".elementor-screen-only")) || undefined,
        icon: FA(a.querySelector("i")),
        // a few icons are custom uploaded SVGs instead of Font Awesome
        svg: !a.querySelector("i") && a.querySelector("svg") ? sanitize(a.querySelector("svg").outerHTML) : undefined,
        cls: [...a.classList].join(" "),
      }));
      return `${ind(d)}<SocialIcons ${attrs({ ...base, items })} />`;
    }
    case "icon-list": {
      const ul = c.querySelector("ul");
      const items = [...c.querySelectorAll("li")].map((li) => ({
        text: textOf(li.querySelector(".elementor-icon-list-text")),
        href: li.querySelector("a") ? localHref(li.querySelector("a").getAttribute("href")) : undefined,
        icon: FA(li.querySelector("i")),
      }));
      return `${ind(d)}<IconList ${attrs({ ...base, ulCls: [...(ul?.classList ?? [])].join(" "), items })} />`;
    }
    case "google_maps": {
      const f = c.querySelector("iframe");
      return `${ind(d)}<Map ${attrs({ ...base, src: f?.getAttribute("src"), title: f?.getAttribute("title") || f?.getAttribute("aria-label") })} />`;
    }
    case "wpr-grid": {
      // Royal Elementor Addons post grid (/blog/): keep the exact class names its page CSS targets.
      const item = c.querySelector("article.wpr-grid-item");
      const cls_ = (sel) => [...(item?.querySelector(sel)?.classList ?? [])].join(" ");
      const ul = c.querySelector(".wpr-grid-filters");
      const filters = [...(ul?.querySelectorAll(":scope > li") ?? [])].map((li) => {
        const sp = li.querySelector("span, a");
        return { label: textOf(sp), liCls: [...li.classList].join(" "), active: sp?.classList.contains("wpr-active-filter") || undefined };
      });
      const pg = c.querySelector(".wpr-grid-pagination");
      const settings = JSON.parse(c.querySelector(".wpr-grid")?.getAttribute("data-settings") || "{}");
      return `${ind(d)}<PostGrid ${attrs({
        ...base,
        ulCls: [...(ul?.classList ?? [])].join(" "),
        filters,
        titleCls: cls_(".wpr-grid-item-title"),
        dateCls: cls_(".wpr-grid-item-date"),
        commentsCls: cls_(".wpr-grid-item-comments"),
        excerptCls: cls_(".wpr-grid-item-excerpt"),
        readMoreCls: cls_(".wpr-grid-item-read-more"),
        readMoreBtnCls: [...(item?.querySelector(".wpr-grid-item-read-more a")?.classList ?? [])].join(" "),
        dateSep: textOf(item?.querySelector(".wpr-grid-item-date .wpr-grid-extra-text-right")) || undefined,
        perPage: c.querySelectorAll("article.wpr-grid-item").length,
        maxPages: pg ? parseInt(pg.getAttribute("data-pages")) : 1,
        excerptWords: 19,
        gutterH: settings.gutter_hr,
        gutterV: settings.gutter_vr,
        gutterHTablet: settings.gutter_hr_tablet,
        gutterHMobile: settings.gutter_hr_mobile,
        columns: parseInt(settings.columns_desktop || "3"),
      })} />`;
    }
    case "divider":
    case "spacer":
      return `${ind(d)}<Widget ${attrs({ ...base, type, html: c.innerHTML.replace(/\s+/g, " ").trim() })} />`;
    default: {
      // Rare third-party widgets (hfe-infocard, eael-cta-box): keep their markup so their CSS still applies.
      report.raw.push(type);
      return `${ind(d)}<Widget ${attrs({ ...base, type, html: sanitize(c.innerHTML) })} />`;
    }
  }
}

function sanitize(html) {
  const dom = new JSDOM(`<div id="r">${html}</div>`);
  const r = dom.window.document.getElementById("r");
  r.querySelectorAll("script,style,noscript").forEach((x) => x.remove());
  r.querySelectorAll("*").forEach((el) => {
    for (const a of [...el.attributes]) {
      if (a.name.startsWith("on") || a.name === "style" || a.name.startsWith("data-")) el.removeAttribute(a.name);
    }
    if (el.tagName === "A" && el.getAttribute("href")) el.setAttribute("href", localHref(el.getAttribute("href")));
    if (el.tagName === "IMG") {
      el.setAttribute("src", localImg(el.getAttribute("data-src") || el.getAttribute("src")));
      el.removeAttribute("srcset");
      el.removeAttribute("sizes");
      el.setAttribute("loading", "lazy");
    }
    if (el.tagName === "I" && FA(el)) {
      const span = dom.window.document.createElement("span");
      span.setAttribute("data-fa", FA(el));
      el.replaceWith(span);
    }
  });
  return r.innerHTML.replace(/\s+/g, " ").trim();
}

function children(el, d, report) {
  const out = [];
  for (const ch of el.children) {
    const cl = ch.classList;
    if (ch.hasAttribute("data-widget_type")) out.push(widget(ch, d, report));
    else if (cl.contains("elementor-section")) out.push(section(ch, d, report));
    else if (cl.contains("e-con")) out.push(container(ch, d, report));
    else if (cl.contains("elementor-column")) out.push(column(ch, d, report));
    else out.push(...children(ch, d, report).filter(Boolean));
  }
  return out.filter(Boolean);
}
function section(el, d, report) {
  const cols = [...el.querySelectorAll(":scope > .elementor-container > .elementor-column")];
  const inner = el.querySelector(":scope > .elementor-container");
  return `${ind(d)}<Section ${attrs({ id: el.getAttribute("data-id"), cls: classes(el), containerCls: classes(inner), overlay: !!el.querySelector(":scope > .elementor-background-overlay") || undefined })}>\n${cols.map((c) => column(c, d + 1, report)).join("\n")}\n${ind(d)}</Section>`;
}
function column(el, d, report) {
  const wrap = el.querySelector(":scope > .elementor-widget-wrap");
  const kids = wrap ? children(wrap, d + 1, report) : [];
  return `${ind(d)}<Column ${attrs({ id: el.getAttribute("data-id"), cls: classes(el), wrapCls: wrap ? classes(wrap) : undefined })}>\n${kids.join("\n")}\n${ind(d)}</Column>`;
}
function container(el, d, report) {
  const inner = el.querySelector(":scope > .e-con-inner");
  const kids = children(inner || el, d + 1, report);
  return `${ind(d)}<Container ${attrs({ id: el.getAttribute("data-id"), cls: classes(el), boxed: inner ? true : undefined })}>\n${kids.join("\n")}\n${ind(d)}</Container>`;
}

/* ----------------------------------------------------------------- main */

const summary = JSON.parse(fs.readFileSync(path.join(AUDIT, "_summary.json"), "utf8"));
const seoOf = (slug) => JSON.parse(fs.readFileSync(path.join(AUDIT, (slug || "home").replace(/\//g, "__") + ".json"), "utf8"));

function importOne(slug, kind) {
  const html = fs.readFileSync(path.join(RAW, "html", slug + ".html"), "utf8");
  const dom = new JSDOM(html);
  const doc = dom.window.document;
  doc.getElementById("masthead")?.remove();
  doc.getElementById("colophon")?.remove();
  const root = [...doc.querySelectorAll("[data-elementor-type]")].find((e) => !HEADER_FOOTER_IDS.has(e.getAttribute("data-elementor-id")));
  const elementorId = root.getAttribute("data-elementor-id");
  const report = { types: {}, raw: [] };
  const body = children(root, 0, report).join("\n\n");
  // FAQ content for FAQPage structured data (every accordion/toggle on the page)
  const faqs = [...root.querySelectorAll(".elementor-accordion-item, .elementor-toggle-item")]
    .map((it) => ({
      q: textOf(it.querySelector(".elementor-accordion-title, .elementor-toggle-title")),
      a: textOf(it.querySelector(".elementor-tab-content")),
    }))
    .filter((f) => f.q && f.a);

  // copy + clean the page's Elementor CSS
  const cssSrc = path.join(RAW, "css", `post-${elementorId}.css`);
  if (fs.existsSync(cssSrc)) {
    const css = fs
      .readFileSync(cssSrc, "utf8")
      .replace(/https?:\/\/www\.renton\.org\.in\/wp-content\/uploads\/\d{4}\/\d{2}\//g, "/images/")
      .replace(/transition:[^;}]*;?/g, "")
      .replace(/[^{}]+\{\s*\}/g, "");
    fs.mkdirSync(path.join(ROOT, "public/elementor"), { recursive: true });
    fs.writeFileSync(path.join(ROOT, "public/elementor", `post-${elementorId}.css`), css);
  }

  const seo = seoOf(slug);
  const og = seo.og || {};
  const meta = {
    slug,
    elementorId,
    title: seo.title,
    description: seo.description || NEW_DESCRIPTIONS[slug] || undefined,
    newDescription: !seo.description && NEW_DESCRIPTIONS[slug] ? true : undefined,
    ogImage: og["og:image"] ? localImg(og["og:image"]) : undefined,
    ogImageAlt: og["og:image:alt"] || undefined,
    ogImageWidth: og["og:image:width"] ? parseInt(og["og:image:width"]) : undefined,
    ogImageHeight: og["og:image:height"] ? parseInt(og["og:image:height"]) : undefined,
    publishedTime: og["article:published_time"] || undefined,
    modifiedTime: og["article:modified_time"] || og["og:updated_time"] || undefined,
    faqs: faqs.length ? faqs : undefined,
  };

  // "Elementor Full Width" template: no theme wrapper, title, meta or post navigation
  if (doc.body.classList.contains("elementor-template-full-width")) meta.template = "full-width";

  if (kind === "page") {
    const ph = doc.querySelector(".page-header .page-title");
    meta.pageTitle = textOf(ph);
  } else {
    const p = posts.find((x) => x.slug === slug);
    const header = doc.querySelector(".entry-header .entry-title");
    // Empty when the theme hides the title for this post (2 posts on the live site)
    meta.postTitle = textOf(header);
    meta.wpTitle = new JSDOM(`<p>${p?.title?.rendered ?? ""}</p>`).window.document.body.textContent.trim();
    meta.date = doc.querySelector(".entry-info time")?.getAttribute("datetime");
    meta.dateText = textOf(doc.querySelector(".entry-info time"));
    meta.modified = p ? p.modified + "+05:30" : undefined;
    meta.wpId = p?.id;
    meta.author = textOf(doc.querySelector(".entry-info .author a"));
    meta.categories = [...doc.querySelectorAll(".entry-info .entry-tax a")].map((a) => ({ name: textOf(a), slug: a.getAttribute("href").replace(/\/$/, "").split("/").pop() }));
    meta.tags = [...doc.querySelectorAll("footer.entry-meta .entry-tax a")].map((a) => ({ name: textOf(a), slug: a.getAttribute("href").replace(/\/$/, "").split("/").pop() }));
    const ex = new JSDOM(`<div>${p?.excerpt?.rendered ?? ""}</div>`).window.document.body.textContent.replace(/\s+/g, " ").trim();
    meta.excerpt = ex.replace(/\s*\[&hellip;\]|\s*\[…\]$/, "");
    const firstImg = root.querySelector("img:not(.emoji)");
    meta.image = firstImg ? localImg(firstImg.getAttribute("data-src") || firstImg.getAttribute("src")) : meta.ogImage;
    meta.imageAlt = firstImg?.getAttribute("alt") || meta.postTitle;
  }

  const out =
    `{/* Imported from ${BASE}${slug}/ on 2026-11-17 by scripts/import-wordpress.mjs. Copy is verbatim; edit freely. */}\n\n` +
    `export const meta = ${JSON.stringify(JSON.parse(JSON.stringify(meta)), null, 2)};\n\n` +
    body +
    "\n";
  const dir = path.join(ROOT, "content", kind === "page" ? "pages" : "blog");
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, slug + ".mdx"), out);
  return { slug, meta, report };
}

const results = [];
for (const s of PAGES) results.push(importOne(s, "page"));
for (const p of posts) results.push(importOne(p.slug, "post"));

// static index of posts, newest first
const blog = results.filter((r) => r.meta.postTitle !== undefined).sort((a, b) => (a.meta.date < b.meta.date ? 1 : -1));
const idx =
  `// Generated by scripts/import-wordpress.mjs — static imports so every post is bundled and prerendered.\n` +
  `import type { PostMeta } from "@/lib/posts-types";\n\n` +
  blog.map((r, i) => `import P${i}, { meta as M${i} } from "./${r.slug}.mdx";`).join("\n") +
  `\n\nexport const posts = [\n${blog.map((_r, i) => `  { meta: M${i} as PostMeta, Content: P${i} },`).join("\n")}\n];\n`;
fs.writeFileSync(path.join(ROOT, "content/blog/index.ts"), idx);
const pidx =
  `// Generated by scripts/import-wordpress.mjs\nimport type { ElementorPageMeta } from "@/lib/posts-types";\n\n` +
  PAGES.map((s, i) => `import P${i}, { meta as M${i} } from "./${s}.mdx";`).join("\n") +
  `\n\nexport const elementorPages = {\n${PAGES.map((s, i) => `  ${JSON.stringify(s)}: { meta: M${i} as ElementorPageMeta, Content: P${i} },`).join("\n")}\n};\n`;
fs.writeFileSync(path.join(ROOT, "content/pages/index.ts"), pidx);

const allTypes = {};
for (const r of results) for (const [k, v] of Object.entries(r.report.types)) allTypes[k] = (allTypes[k] || 0) + v;
console.log("imported", results.length, "files; widget types:", allTypes);
console.log("raw widgets:", [...new Set(results.flatMap((r) => r.report.raw))]);
