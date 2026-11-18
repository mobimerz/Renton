import "server-only";
import { hero, homeFaq, rentalProducts, testimonials, whyChoose } from "@/data/home";
import { connectDB, withBuildFallback } from "@/lib/mongodb";
import { HOMEPAGE_KEY, HomepageContentModel } from "@/lib/models/HomepageContent";
import { homepageSchema, type HomepageContent } from "./schema";

/** The content that is hardcoded in data/home.ts (day-one content, and the fallback). */
export function defaultHomepageContent(): HomepageContent {
  return homepageSchema.parse({
    hero,
    rentalProducts,
    whyChoose,
    testimonials: { ...testimonials, items: testimonials.items.map((t) => ({ ...t, img: t.img ?? null })) },
    homeFaq,
  });
}

/**
 * Homepage content for the public page: the MongoDB document if there is one, otherwise the
 * hardcoded defaults. If the database is configured but fails, this throws so ISR keeps the
 * previous page rather than silently reverting to the defaults.
 */
export async function getHomepageContent(): Promise<{ content: HomepageContent; fromDb: boolean; updatedAt?: Date }> {
  if (!process.env.MONGODB_URI) return { content: defaultHomepageContent(), fromDb: false };
  return withBuildFallback(loadFromDb, () => ({ content: defaultHomepageContent(), fromDb: false }), "homepage");
}

async function loadFromDb(): Promise<{ content: HomepageContent; fromDb: boolean; updatedAt?: Date }> {
  await connectDB();
  const doc = await HomepageContentModel.findOne({ key: HOMEPAGE_KEY }).lean();
  if (!doc) return { content: defaultHomepageContent(), fromDb: false };
  const parsed = homepageSchema.safeParse(doc.content);
  if (!parsed.success) {
    console.error("[homepage] stored content is invalid, using defaults:", parsed.error.issues.slice(0, 3));
    return { content: defaultHomepageContent(), fromDb: false };
  }
  return { content: parsed.data, fromDb: true, updatedAt: doc.updatedAt };
}

/** Every image URL in the content (for deleting replaced Blob files). */
export function homepageImageUrls(c: HomepageContent | null | undefined): string[] {
  if (!c) return [];
  return [c.hero.image.src, ...c.rentalProducts.slides.map((s) => s.src), ...c.testimonials.items.map((t) => t.img?.src ?? "")].filter(Boolean);
}
