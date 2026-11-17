import { allPosts } from "@/lib/content";
import { SITE_URL, site } from "@/data/site";

/** RSS 2.0 feed of all 37 blog posts at /feed/ (replaces the WordPress feed). Built at build time. */
export const dynamic = "force-static";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const rfc822 = (iso: string) => new Date(iso).toUTCString();

export function GET() {
  const items = allPosts
    .map(({ meta }) => {
      const url = `${SITE_URL}/${meta.slug}/`;
      return `    <item>
      <title>${esc(meta.wpTitle)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${rfc822(meta.date)}</pubDate>
      <dc:creator><![CDATA[${meta.author}]]></dc:creator>
${meta.categories.map((c) => `      <category><![CDATA[${c.name}]]></category>`).join("\n")}
${meta.tags.map((t) => `      <category><![CDATA[${t.name}]]></category>`).join("\n")}
      <description><![CDATA[${meta.excerpt}]]></description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${esc(site.name)}</title>
    <atom:link href="${SITE_URL}/feed/" rel="self" type="application/rss+xml" />
    <link>${SITE_URL}</link>
    <description>Laptop, Desktop and Server Rental in Bangalore</description>
    <language>en-US</language>
    <lastBuildDate>${rfc822(allPosts[0].meta.modifiedTime ?? allPosts[0].meta.date)}</lastBuildDate>
${items}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
