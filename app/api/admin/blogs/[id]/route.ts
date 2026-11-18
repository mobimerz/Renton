import { requireAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Blog } from "@/lib/models/Blog";
import { deleteBlog, isObjectId, saveBlog, toFormValues } from "@/lib/blog/save";

type Ctx = { params: Promise<{ id: string }> };

const notFound = () => Response.json({ error: "Post not found." }, { status: 404 });

/** GET /api/admin/blogs/:id */
export async function GET(_request: Request, { params }: Ctx) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  const { id } = await params;
  if (!isObjectId(id)) return notFound();
  try {
    await connectDB();
    const blog = await Blog.findById(id).lean();
    return blog ? Response.json({ blog: toFormValues(blog) }) : notFound();
  } catch (err) {
    console.error("[admin/blogs] get failed:", err);
    return Response.json({ error: "Could not load the post." }, { status: 500 });
  }
}

/** PUT /api/admin/blogs/:id — full update. */
export async function PUT(request: Request, { params }: Ctx) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  const { id } = await params;
  if (!isObjectId(id)) return notFound();
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }
  try {
    const result = await saveBlog(body, id);
    return result.ok
      ? Response.json({ id: result.id }, { status: result.status })
      : Response.json({ error: result.error, errors: result.errors }, { status: result.status });
  } catch (err) {
    console.error("[admin/blogs] update failed:", err);
    return Response.json({ error: "Could not save the post. Please try again." }, { status: 500 });
  }
}

/** DELETE /api/admin/blogs/:id — also deletes its Blob images. */
export async function DELETE(_request: Request, { params }: Ctx) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  const { id } = await params;
  if (!isObjectId(id)) return notFound();
  try {
    return (await deleteBlog(id)) ? Response.json({ ok: true }) : notFound();
  } catch (err) {
    console.error("[admin/blogs] delete failed:", err);
    return Response.json({ error: "Could not delete the post. Please try again." }, { status: 500 });
  }
}
