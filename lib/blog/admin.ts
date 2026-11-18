import "server-only";
import { connectDB } from "@/lib/mongodb";
import { Blog, type BlogDoc } from "@/lib/models/Blog";
import { BLOG_STATUSES, type BlogStatus } from "./schema";

export type AdminBlogRow = {
  id: string;
  title: string;
  slug: string;
  status: BlogStatus;
  publishedAt: string | null;
  updatedAt: string;
};

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export async function listBlogsForAdmin(opts: { q?: string; status?: string } = {}): Promise<AdminBlogRow[]> {
  const filter: Record<string, unknown> = {};
  if (opts.status && (BLOG_STATUSES as readonly string[]).includes(opts.status)) filter.status = opts.status;
  const q = opts.q?.trim().slice(0, 100);
  if (q) filter.$or = [{ title: { $regex: escapeRegex(q), $options: "i" } }, { slug: { $regex: escapeRegex(q), $options: "i" } }];
  await connectDB();
  const docs = await Blog.find(filter, { title: 1, slug: 1, status: 1, publishedAt: 1, updatedAt: 1 })
    .sort({ updatedAt: -1 })
    .limit(500)
    .lean<Pick<BlogDoc, "_id" | "title" | "slug" | "status" | "publishedAt" | "updatedAt">[]>();
  return docs.map((d) => ({
    id: String(d._id),
    title: d.title,
    slug: d.slug,
    status: d.status as BlogStatus,
    publishedAt: d.publishedAt ? d.publishedAt.toISOString() : null,
    updatedAt: d.updatedAt.toISOString(),
  }));
}

export async function blogCounts(): Promise<{ total: number; published: number; draft: number }> {
  await connectDB();
  const [total, published] = await Promise.all([Blog.countDocuments(), Blog.countDocuments({ status: "published" })]);
  return { total, published, draft: total - published };
}

/** slug -> admin edit id, for every DB post (used by the legacy tab). */
export async function dbSlugMap(): Promise<Map<string, { id: string; status: BlogStatus }>> {
  await connectDB();
  const docs = await Blog.find({}, { slug: 1, status: 1 }).lean<Pick<BlogDoc, "_id" | "slug" | "status">[]>();
  return new Map(docs.map((d) => [d.slug, { id: String(d._id), status: d.status as BlogStatus }]));
}
