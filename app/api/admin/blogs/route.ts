import { requireAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Blog } from "@/lib/models/Blog";
import { saveBlog } from "@/lib/blog/save";
import { BLOG_STATUSES } from "@/lib/blog/schema";

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** GET /api/admin/blogs?q=&status=draft|published — list (no content field). */
export async function GET(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get("q") ?? "").trim().slice(0, 100);
    const status = searchParams.get("status");
    const filter: Record<string, unknown> = {};
    if (status && (BLOG_STATUSES as readonly string[]).includes(status)) filter.status = status;
    if (q) filter.$or = [{ title: { $regex: escapeRegex(q), $options: "i" } }, { slug: { $regex: escapeRegex(q), $options: "i" } }];
    await connectDB();
    const blogs = await Blog.find(filter, { content: 0 }).sort({ updatedAt: -1 }).limit(500).lean();
    return Response.json({ blogs });
  } catch (err) {
    console.error("[admin/blogs] list failed:", err);
    return Response.json({ error: "Could not load posts." }, { status: 500 });
  }
}

/** POST /api/admin/blogs — create. */
export async function POST(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }
  try {
    const result = await saveBlog(body);
    return result.ok
      ? Response.json({ id: result.id }, { status: result.status })
      : Response.json({ error: result.error, errors: result.errors }, { status: result.status });
  } catch (err) {
    console.error("[admin/blogs] create failed:", err);
    return Response.json({ error: "Could not save the post. Please try again." }, { status: 500 });
  }
}
