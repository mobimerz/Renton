import { elementorPages } from "@/content/pages";

/**
 * Slugs a database post can never use. Blog posts live at /<slug>/, the same URL space as
 * the 6 Elementor pages, the fixed routes, public folders and WordPress redirect sources.
 * (Overriding a legacy MDX *post* is allowed on purpose; that is not in this list.)
 */
const FIXED = [
  // app routes
  "about", "contact", "products", "services", "blog", "category", "feed", "admin", "api",
  "sitemap.xml", "robots.txt",
  // public/ folders and Next internals
  "images", "elementor", "_next", "favicon.ico",
  // WordPress URLs handled by redirects (lib/redirects.ts)
  "page", "author", "tag", "comments", "wp-admin", "wp-content", "wp-includes", "wp-json",
  "wp-login.php", "xmlrpc.php", "wp-sitemap.xml", "sitemap_index.xml", "post-sitemap.xml",
  "category-sitemap.xml", "elementor-hf", "elementor-hf-sitemap.xml",
];

// Lazy: content/pages renders <PostGrid>, which imports this module (circular import at load time).
let reserved: ReadonlySet<string> | undefined;
export const getReservedSlugs = (): ReadonlySet<string> => (reserved ??= new Set([...FIXED, ...Object.keys(elementorPages)]));

export function isReservedSlug(slug: string): boolean {
  // WordPress date archives (/2026/...) redirect to /blog/.
  return getReservedSlugs().has(slug) || /^\d{4}$/.test(slug);
}

export function reservedSlugMessage(slug: string): string {
  return elementorPages[slug as keyof typeof elementorPages]
    ? `"${slug}" is the URL of an existing website page. Choose a different slug.`
    : `"${slug}" is reserved by the website (it is used by another page or system URL). Choose a different slug.`;
}
