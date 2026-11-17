import type { Redirect } from "next/dist/lib/load-custom-routes";

/**
 * 301 redirects for WordPress URLs that no longer exist as pages.
 * All destinations end with "/" because trailingSlash is on.
 * statusCode 301 (not `permanent`, which sends 308) to match WordPress/Rank Math.
 */


export const redirects: Redirect[] = [
  // /?p=<id> and /?page_id=<id> are handled in proxy.ts (config redirects keep the query string).
  // Feeds: the site-wide feed is a real route at /feed/.
  { source: "/comments/feed", destination: "/feed/", statusCode: 301 },
  { source: "/category/blog/feed", destination: "/feed/", statusCode: 301 },
  { source: "/:slug/feed", destination: "/:slug/", statusCode: 301 },
  // Archive pagination never existed beyond page 1 on WordPress.
  { source: "/category/blog/page/:n", destination: "/category/blog/", statusCode: 301 },
  { source: "/blog/page/:n", destination: "/blog/", statusCode: 301 },
  { source: "/page/:n", destination: "/blog/", statusCode: 301 },
  // Unused categories, author and date archives.
  { source: "/category/:cat((?!blog$)[^/]+)", destination: "/blog/", statusCode: 301 },
  { source: "/author/:name*", destination: "/blog/", statusCode: 301 },
  // Tag archives (linked from post footers on WordPress) were not in the sitemap.
  { source: "/tag/:tag*", destination: "/blog/", statusCode: 301 },
  { source: "/:year(\\d{4})/:rest*", destination: "/blog/", statusCode: 301 },
  // Elementor header/footer template URLs (already 301 to / on WordPress).
  { source: "/elementor-hf/:path*", destination: "/", statusCode: 301 },
  // WordPress admin and system URLs.
  { source: "/wp-admin/:path*", destination: "/", statusCode: 301 },
  { source: "/wp-login.php", destination: "/", statusCode: 301 },
  { source: "/xmlrpc.php", destination: "/", statusCode: 301 },
  { source: "/wp-json/:path*", destination: "/", statusCode: 301 },
  // Old WordPress sitemap names -> Next.js sitemap.
  { source: "/sitemap_index.xml", destination: "/sitemap.xml", statusCode: 301 },
  { source: "/post-sitemap.xml", destination: "/sitemap.xml", statusCode: 301 },
  { source: "/category-sitemap.xml", destination: "/sitemap.xml", statusCode: 301 },
  { source: "/elementor-hf-sitemap.xml", destination: "/sitemap.xml", statusCode: 301 },
  { source: "/wp-sitemap.xml", destination: "/sitemap.xml", statusCode: 301 },
  // Uploaded files that were linked directly.
  { source: "/wp-content/uploads/:y/:m/:file", destination: "/images/:file", statusCode: 301 },
];
