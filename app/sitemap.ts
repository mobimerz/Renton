import type { MetadataRoute } from "next";
import { SITE_URL } from "@/data/site";
import { pages } from "@/data/pages";
import { allPosts } from "@/lib/content";
import { elementorPages } from "@/content/pages";

/**
 * /sitemap.xml — every indexable URL (the WordPress sitemap only listed posts and the category;
 * pages are included here too). URLs keep the trailing slash used on WordPress.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const url = (p: string) => `${SITE_URL}${p}`;
  const handBuilt = [
    { path: "/", lastModified: "2026-09-28T11:26:20+05:30", priority: 1 },
    ...Object.values(pages).map((p) => ({ path: p.path, lastModified: p.modifiedTime, priority: 0.8 })),
  ];
  const elementor = Object.values(elementorPages).map(({ meta }) => ({
    path: `/${meta.slug}/`,
    lastModified: meta.modifiedTime,
    priority: 0.8,
  }));
  return [
    ...handBuilt.map((p) => ({ url: url(p.path), lastModified: p.lastModified, changeFrequency: "monthly" as const, priority: p.priority })),
    ...elementor.map((p) => ({ url: url(p.path), lastModified: p.lastModified, changeFrequency: "monthly" as const, priority: p.priority })),
    { url: url("/category/blog/"), lastModified: allPosts[0].meta.modifiedTime, changeFrequency: "weekly", priority: 0.5 },
    ...allPosts.map(({ meta }) => ({
      url: url(`/${meta.slug}/`),
      lastModified: meta.modifiedTime ?? meta.date,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
