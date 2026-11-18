import "server-only";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { Blog, type BlogDoc } from "@/lib/models/Blog";
import { deleteReplacedBlobs } from "@/lib/blob";
import { revalidateSiteContent } from "@/lib/revalidate";
import { blogInputSchema, fieldErrors, type BlogFormValues } from "./schema";
import { isReservedSlug, reservedSlugMessage } from "./reserved";
import { imageUrlsIn, sanitizeBlogHtml } from "./sanitize";

/** Result shape shared by the create and update API routes. */
export type SaveResult =
  | { ok: true; id: string; status: number }
  | { ok: false; status: number; error: string; errors?: Record<string, string> };

type LeanBlog = Omit<BlogDoc, "_id"> & { _id: mongoose.Types.ObjectId };

export function toFormValues(b: LeanBlog): BlogFormValues {
  return {
    id: String(b._id),
    title: b.title,
    slug: b.slug,
    excerpt: b.excerpt ?? "",
    content: b.content ?? "",
    featuredImage: b.featuredImage?.url
      ? { url: b.featuredImage.url, width: b.featuredImage.width ?? 0, height: b.featuredImage.height ?? 0, alt: b.featuredImage.alt ?? "" }
      : null,
    metaTitle: b.metaTitle ?? "",
    metaDescription: b.metaDescription ?? "",
    author: b.author ?? "",
    tags: b.tags ?? [],
    status: b.status as BlogFormValues["status"],
    publishedAt: b.publishedAt ? b.publishedAt.toISOString() : null,
  };
}

export const isObjectId = (id: string) => mongoose.isValidObjectId(id) && /^[a-f\d]{24}$/i.test(id);

const imagesOf = (b: { featuredImage?: { url?: string | null } | null; content?: string | null } | null) =>
  b ? [b.featuredImage?.url, ...imageUrlsIn(b.content)] : [];

/** Validate + save a post (create when id is undefined). Deletes replaced Blob images and revalidates the site. */
export async function saveBlog(body: unknown, id?: string): Promise<SaveResult> {
  const parsed = blogInputSchema.safeParse(body);
  if (!parsed.success) return { ok: false, status: 422, error: "Please fix the highlighted fields.", errors: fieldErrors(parsed.error) };
  const data = parsed.data;

  if (isReservedSlug(data.slug)) {
    return { ok: false, status: 422, error: reservedSlugMessage(data.slug), errors: { slug: reservedSlugMessage(data.slug) } };
  }

  await connectDB();

  const existing = id ? await Blog.findById(id).lean<LeanBlog>() : null;
  if (id && !existing) return { ok: false, status: 404, error: "This post no longer exists." };

  const clash = await Blog.findOne({ slug: data.slug, ...(id ? { _id: { $ne: id } } : {}) }, { _id: 1, title: 1 }).lean<{ title: string }>();
  if (clash) {
    const msg = `Another post ("${clash.title}") already uses this slug.`;
    return { ok: false, status: 409, error: msg, errors: { slug: msg } };
  }

  const content = sanitizeBlogHtml(data.content);
  // First publish without a date: publish now. Drafts keep whatever date they had.
  const publishedAt = data.publishedAt ? new Date(data.publishedAt) : data.status === "published" ? new Date() : null;

  const doc = {
    ...data,
    content,
    publishedAt,
    featuredImage: data.featuredImage?.url ? data.featuredImage : null,
    tags: [...new Set(data.tags.map((t) => t.trim()).filter(Boolean))],
  };

  let savedId: string;
  try {
    if (existing) {
      await Blog.updateOne({ _id: existing._id }, { $set: doc }, { runValidators: true });
      savedId = String(existing._id);
    } else {
      const created = await Blog.create(doc);
      savedId = String(created._id);
    }
  } catch (err) {
    if ((err as { code?: number }).code === 11000) {
      return { ok: false, status: 409, error: "Another post already uses this slug.", errors: { slug: "Another post already uses this slug." } };
    }
    throw err;
  }

  await deleteReplacedBlobs(imagesOf(existing), imagesOf(doc));
  revalidateSiteContent();
  return { ok: true, id: savedId, status: existing ? 200 : 201 };
}

/** Delete a post, its Blob images, and revalidate. Returns false when it didn't exist. */
export async function deleteBlog(id: string): Promise<boolean> {
  await connectDB();
  const existing = await Blog.findByIdAndDelete(id).lean<LeanBlog>();
  if (!existing) return false;
  await deleteReplacedBlobs(imagesOf(existing), []);
  revalidateSiteContent();
  return true;
}
