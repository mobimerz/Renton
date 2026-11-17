import { posts } from "@/content/blog";
import { elementorPages } from "@/content/pages";
import type { PostMeta } from "./posts-types";

/** All blog posts, newest first. */
export const allPosts = posts;

export const getPost = (slug: string) => posts.find((p) => p.meta.slug === slug);

export const getElementorPage = (slug: string) =>
  (elementorPages as Record<string, (typeof elementorPages)[keyof typeof elementorPages]>)[slug];

/** WordPress-style neighbours: "Previous Post" = older, "Next Post" = newer. */
export function neighbours(slug: string): { prev?: PostMeta; next?: PostMeta } {
  const i = posts.findIndex((p) => p.meta.slug === slug);
  return { prev: posts[i + 1]?.meta, next: posts[i - 1]?.meta };
}
