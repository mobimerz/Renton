import sanitizeHtml from "sanitize-html";
import { requireAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { HOMEPAGE_KEY, HomepageContentModel } from "@/lib/models/HomepageContent";
import { getHomepageContent, homepageImageUrls } from "@/lib/homepage/content";
import { homepageErrors, homepageSchema, type HomepageContent } from "@/lib/homepage/schema";
import { deleteReplacedBlobs } from "@/lib/blob";
import { revalidateSiteContent } from "@/lib/revalidate";

/** Small formatting only: these snippets sit inside fixed homepage layouts. */
const clean = (html: string) =>
  sanitizeHtml(html, {
    allowedTags: ["p", "br", "strong", "b", "em", "i", "u", "a", "ul", "ol", "li"],
    allowedAttributes: { a: ["href", "target", "rel"] },
    allowedSchemes: ["http", "https", "mailto", "tel"],
  });

function sanitizeContent(c: HomepageContent): HomepageContent {
  return {
    ...c,
    hero: { ...c.hero, text: clean(c.hero.text) },
    rentalProducts: { ...c.rentalProducts, text: clean(c.rentalProducts.text) },
    whyChoose: { ...c.whyChoose, text: clean(c.whyChoose.text), boxes: c.whyChoose.boxes.map((b) => ({ ...b, text: clean(b.text) })) },
    homeFaq: { ...c.homeFaq, intro: clean(c.homeFaq.intro), columns: c.homeFaq.columns.map((col) => col.map((f) => ({ ...f, a: clean(f.a) }))) },
  };
}

/** GET /api/admin/homepage — current content (DB or defaults). */
export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  try {
    const { content, fromDb, updatedAt } = await getHomepageContent();
    return Response.json({ content, fromDb, updatedAt: updatedAt ?? null });
  } catch (err) {
    console.error("[admin/homepage] load failed:", err);
    return Response.json({ error: "Could not load the homepage content." }, { status: 500 });
  }
}

/** PUT /api/admin/homepage — replace the whole content (singleton upsert). */
export async function PUT(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }
  const parsed = homepageSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Please fix the highlighted fields.", errors: homepageErrors(parsed.error) }, { status: 422 });
  }

  try {
    const content = sanitizeContent(parsed.data);
    await connectDB();
    const before = await HomepageContentModel.findOne({ key: HOMEPAGE_KEY }).lean();
    const saved = await HomepageContentModel.findOneAndUpdate(
      { key: HOMEPAGE_KEY },
      { $set: { content }, $setOnInsert: { key: HOMEPAGE_KEY } },
      { upsert: true, new: true, lean: true },
    );
    const old = before ? homepageSchema.safeParse(before.content) : null;
    await deleteReplacedBlobs(homepageImageUrls(old?.success ? old.data : null), homepageImageUrls(content));
    revalidateSiteContent();
    return Response.json({ ok: true, updatedAt: saved?.updatedAt ?? null });
  } catch (err) {
    console.error("[admin/homepage] save failed:", err);
    return Response.json({ error: "Could not save the homepage. Please try again." }, { status: 500 });
  }
}
