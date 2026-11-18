import { getAllPosts } from "@/lib/blog/posts";
import { SITE_URL, site } from "@/data/site";

/** RSS 2.0 feed of every blog post (legacy MDX + published admin posts) at /feed/. Revalidated when posts change. */
export const dynamic = "force-static";
export const revalidate = 3600;

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const cdata = (s: string) => s.replace(/]]>/g, "]]]]><![CDATA[>");
const rfc822 = (iso: string) => new Date(iso).toUTCString();

export async function GET() {
  const posts = await getAllPosts();
  const items = posts
    .map((p) => {
      const url = `${SITE_URL}/${p.slug}/`;
      const categories = p.mdx ? p.mdx.meta.categories.map((c) => c.name) : ["Blog"];
      return `    <item>
      <title>${esc(p.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${rfc822(p.date)}</pubDate>
      <dc:creator><![CDATA[${cdata(p.author)}]]></dc:creator>
${categories.map((c) => `      <category><![CDATA[${cdata(c)}]]></category>`).join("\n")}
${p.tags.map((t) => `      <category><![CDATA[${cdata(t)}]]></category>`).join("\n")}
      <description><![CDATA[${cdata(p.excerpt)}]]></description>
    </item>`;
    })
    .join("\n");

  const lastModified = posts.reduce((max, p) => (p.modified > max ? p.modified : max), posts[0]?.modified ?? new Date().toISOString());
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${esc(site.name)}</title>
    <atom:link href="${SITE_URL}/feed/" rel="self" type="application/rss+xml" />
    <link>${SITE_URL}</link>
    <description>Laptop, Desktop and Server Rental in Bangalore</description>
    <language>en-US</language>
    <lastBuildDate>${rfc822(lastModified)}</lastBuildDate>
${items}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
