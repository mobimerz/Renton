#!/usr/bin/env node
/**
 * Copies the current hardcoded homepage content (data/home.ts) into MongoDB, so the admin
 * starts from exactly what the website shows today.
 *
 *   node scripts/seed-homepage.mjs           # only if no homepage document exists yet
 *   node scripts/seed-homepage.mjs --force   # overwrite the existing document
 *
 * Reads MONGODB_URI from .env.local / .env (or the shell). Needs Node 22.18+ (TypeScript
 * type stripping) because it imports the .ts content files directly.
 */
import nextEnv from "@next/env";
import mongoose from "mongoose";

nextEnv.loadEnvConfig(process.cwd());
const force = process.argv.includes("--force");

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI is not set (add it to .env.local).");
  process.exit(1);
}

const { hero, rentalProducts, whyChoose, testimonials, homeFaq } = await import("../data/home.ts");
const { homepageSchema } = await import("../lib/homepage/schema.ts");

const parsed = homepageSchema.safeParse({
  hero,
  rentalProducts,
  whyChoose,
  testimonials: { ...testimonials, items: testimonials.items.map((t) => ({ ...t, img: t.img ?? null })) },
  homeFaq,
});
if (!parsed.success) {
  console.error("data/home.ts does not match the homepage schema:", parsed.error.issues);
  process.exit(1);
}

await mongoose.connect(uri, { serverSelectionTimeoutMS: 15_000 });
try {
  const col = mongoose.connection.collection("homepagecontent");
  const existing = await col.findOne({ key: "homepage" });
  if (existing && !force) {
    console.log(`A homepage document already exists (last updated ${existing.updatedAt?.toISOString?.() ?? "unknown"}). Nothing changed.`);
    console.log("Run with --force to overwrite it with the original content from data/home.ts.");
  } else {
    const now = new Date();
    await col.updateOne(
      { key: "homepage" },
      { $set: { content: parsed.data, updatedAt: now }, $setOnInsert: { key: "homepage", createdAt: now } },
      { upsert: true },
    );
    console.log(existing ? "Homepage content overwritten (--force)." : "Homepage content seeded.");
    console.log("Note: the live site picks this up on its next revalidation (within an hour), or right away after any save in /admin/homepage.");
  }
} finally {
  await mongoose.disconnect();
}
