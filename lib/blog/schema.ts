import { z } from "zod";

/**
 * Blog post input, validated in the admin form (client) and again in the API (server).
 * Content is HTML produced by the TipTap editor (sanitised again on the server).
 */
export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** "Laptop Rental: A Guide!" -> "laptop-rental-a-guide" */
export function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s-]+/g, "-")
    .slice(0, 100)
    .replace(/-+$/g, "");
}

const imageSchema = z.object({
  url: z.string().trim().min(1).max(2000),
  width: z.number().int().min(0).max(20000),
  height: z.number().int().min(0).max(20000),
  alt: z.string().trim().max(200).optional().default(""),
});

export const BLOG_STATUSES = ["draft", "published"] as const;
export type BlogStatus = (typeof BLOG_STATUSES)[number];

export const blogInputSchema = z.object({
  title: z.string().trim().min(1, "Title is required.").max(200, "Keep the title under 200 characters."),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required.")
    .max(100, "Keep the slug under 100 characters.")
    .regex(SLUG_PATTERN, "Use only lowercase letters, numbers and single dashes (e.g. laptop-rental-guide)."),
  excerpt: z.string().trim().max(600, "Keep the excerpt under 600 characters.").optional().default(""),
  content: z.string().max(500_000, "The content is too long.").optional().default(""),
  featuredImage: imageSchema.nullable().optional().default(null),
  metaTitle: z.string().trim().max(120, "Keep the meta title under 120 characters.").optional().default(""),
  metaDescription: z.string().trim().max(320, "Keep the meta description under 320 characters.").optional().default(""),
  author: z.string().trim().max(100).optional().default(""),
  tags: z.array(z.string().trim().min(1).max(60)).max(30, "Use at most 30 tags.").optional().default([]),
  status: z.enum(BLOG_STATUSES),
  /** ISO string; set automatically on first publish when empty. */
  publishedAt: z.string().datetime({ offset: true }).nullable().optional().default(null),
});

export type BlogInput = z.input<typeof blogInputSchema>;
export type BlogData = z.output<typeof blogInputSchema>;

/** What the admin form edits (also what GET /api/admin/blogs/[id] returns). */
export type BlogFormValues = BlogData & { id?: string };

export const DEFAULT_AUTHOR = "Renton Technology";

/** Turns zod issues into { field: message } for the form. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    out[key] ??= issue.message;
  }
  return out;
}
