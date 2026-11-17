/** Shapes of the `export const meta` objects in content/pages/*.mdx and content/blog/*.mdx */
export type BaseMeta = {
  slug: string;
  /** Elementor post ID on WordPress; its CSS lives at /elementor/post-<id>.css */
  elementorId: string;
  /** <title> exactly as on WordPress */
  title: string;
  description?: string;
  /** true when the description was written for the rebuild (none on WordPress) */
  newDescription?: boolean;
  ogImage?: string;
  ogImageAlt?: string;
  ogImageWidth?: number;
  ogImageHeight?: number;
  publishedTime?: string;
  modifiedTime?: string;
  /** Questions/answers from the page's accordions (FAQPage JSON-LD) */
  faqs?: { q: string; a: string }[];
  /** "full-width" = WordPress "Elementor Full Width" template (no theme wrapper) */
  template?: "full-width";
};

export type ElementorPageMeta = BaseMeta & {
  /** Title-bar heading */
  pageTitle: string;
};

export type Term = { name: string; slug: string };

export type PostMeta = BaseMeta & {
  /** Post title shown as the entry-title h1 ("" when the theme hid it on WordPress) */
  postTitle: string;
  /** WordPress post title (always set; used in lists and feeds) */
  wpTitle: string;
  /** ISO date with offset */
  date: string;
  /** e.g. "August 10, 2026" */
  dateText: string;
  modified?: string;
  wpId?: number;
  author: string;
  categories: Term[];
  tags: Term[];
  excerpt: string;
  /** Featured/first image of the post */
  image?: string;
  imageAlt?: string;
};
