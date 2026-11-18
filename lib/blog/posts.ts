import "server-only";
import { posts as mdxPosts } from "@/content/blog";
import { connectDB, withBuildFallback } from "@/lib/mongodb";
import { Blog, type BlogDoc } from "@/lib/models/Blog";
import { htmlToText } from "./sanitize";
import { isReservedSlug } from "./reserved";
import legacySizes from "@/data/legacy-image-sizes.json";

/** Intrinsic size of a /public image used by a legacy post (precomputed: scripts/legacy-image-sizes.mjs). */
export function legacyImageSize(src: string | undefined): { width: number; height: number } | undefined {
  const s = src ? (legacySizes as unknown as Record<string, [number, number]>)[src] : undefined;
  return s ? { width: s[0], height: s[1] } : undefined;
}

/**
 * One list of blog posts for the public site: the 37 legacy MDX posts + published MongoDB posts.
 * A published DB post with the same slug as an MDX post replaces it everywhere (shown once).
 */
type MdxPost = (typeof mdxPosts)[number];

export type PostImage = { url: string; width: number; height: number; alt: string };

export type ListedPost = {
  source: "mdx" | "db";
  slug: string;
  title: string;
  /** ISO date used for sorting and <time> */
  date: string;
  modified: string;
  /** "August 31, 2026" */
  dateText: string;
  excerpt: string;
  author: string;
  tags: string[];
  image?: PostImage;
  /** source "mdx" */
  mdx?: MdxPost;
  /** source "db": sanitised HTML body */
  html?: string;
  /** source "db" */
  metaTitle?: string;
  metaDescription?: string;
};

export const isDbConfigured = () => Boolean(process.env.MONGODB_URI);

export const formatDateText = (d: Date | string) =>
  new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "Asia/Kolkata" });

const words = (text: string, n: number) => {
  const w = text.split(/\s+/).filter(Boolean);
  return w.length > n ? w.slice(0, n).join(" ") + "…" : text;
};

function fromMdx(p: MdxPost): ListedPost {
  const m = p.meta;
  return {
    source: "mdx",
    slug: m.slug,
    title: m.wpTitle,
    date: m.date,
    modified: m.modifiedTime ?? m.modified ?? m.date,
    dateText: m.dateText,
    excerpt: m.excerpt,
    author: m.author,
    tags: m.tags.map((t) => t.name),
    image: m.image ? { url: m.image, width: legacyImageSize(m.image)?.width ?? 0, height: legacyImageSize(m.image)?.height ?? 0, alt: m.imageAlt ?? m.wpTitle } : undefined,
    mdx: p,
  };
}

type LeanBlog = Omit<BlogDoc, "_id"> & { _id: unknown };

export function fromDb(b: LeanBlog): ListedPost {
  const date = (b.publishedAt ?? b.createdAt).toISOString();
  const img = b.featuredImage;
  return {
    source: "db",
    slug: b.slug,
    title: b.title,
    date,
    modified: b.updatedAt.toISOString(),
    dateText: formatDateText(date),
    excerpt: b.excerpt || words(htmlToText(b.content ?? ""), 55),
    author: b.author || "Renton Technology",
    tags: b.tags ?? [],
    image: img?.url ? { url: img.url, width: img.width ?? 0, height: img.height ?? 0, alt: img.alt || b.title } : undefined,
    html: b.content ?? "",
    metaTitle: b.metaTitle ?? "",
    metaDescription: b.metaDescription ?? "",
  };
}

/**
 * Published DB posts, newest first. With no MONGODB_URI (e.g. a local build) the site simply
 * shows the MDX posts. If the database is configured but fails, this throws, so an ISR
 * regeneration keeps serving the previous page instead of caching a page without DB posts.
 */
export async function getPublishedDbPosts(): Promise<ListedPost[]> {
  if (!isDbConfigured()) return [];
  return withBuildFallback(queryPublishedDbPosts, () => [], "blog posts");
}

async function queryPublishedDbPosts(): Promise<ListedPost[]> {
  await connectDB();
  const docs = await Blog.find({ status: "published", publishedAt: { $ne: null, $lte: new Date() } })
    .sort({ publishedAt: -1 })
    .lean<LeanBlog[]>();
  return docs.filter((d) => !isReservedSlug(d.slug)).map(fromDb);
}

export async function getPublishedDbPost(slug: string): Promise<ListedPost | null> {
  if (!isDbConfigured() || isReservedSlug(slug)) return null;
  return withBuildFallback(
    async () => {
      await connectDB();
      const doc = await Blog.findOne({ slug, status: "published", publishedAt: { $ne: null, $lte: new Date() } }).lean<LeanBlog>();
      return doc ? fromDb(doc) : null;
    },
    () => null,
    `post ${slug}`,
  );
}

/**
 * The 37 legacy posts. Built lazily: the MDX files render <PostGrid>, which imports this module,
 * so reading `mdxPosts` at module load would hit a circular import.
 */
let legacyCache: ListedPost[] | undefined;
export const getLegacyPosts = (): ListedPost[] => (legacyCache ??= mdxPosts.map(fromMdx));
export const getLegacyPost = (slug: string) => getLegacyPosts().find((p) => p.slug === slug);

/** Every public post (DB wins on slug clashes), newest first. */
export async function getAllPosts(): Promise<ListedPost[]> {
  const db = await getPublishedDbPosts();
  const dbSlugs = new Set(db.map((p) => p.slug));
  return [...db, ...getLegacyPosts().filter((p) => !dbSlugs.has(p.slug))].sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
}

/** WordPress-style neighbours: "Previous Post" = older, "Next Post" = newer. */
export function neighboursIn(all: ListedPost[], slug: string): { prev?: ListedPost; next?: ListedPost } {
  const i = all.findIndex((p) => p.slug === slug);
  if (i === -1) return {};
  return { prev: all[i + 1], next: all[i - 1] };
}
