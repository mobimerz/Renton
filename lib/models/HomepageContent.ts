import "server-only";
import mongoose, { Schema, type Model } from "mongoose";

/**
 * Singleton: exactly one document with key "homepage". `content` is validated with zod
 * (lib/homepage/schema.ts) before every write, so it is stored as a plain object.
 */
const homepageContentSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, default: "homepage" },
    content: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true, collection: "homepagecontent", minimize: false },
);

export type HomepageContentDoc = { _id: mongoose.Types.ObjectId; key: string; content: unknown; createdAt: Date; updatedAt: Date };

export const HOMEPAGE_KEY = "homepage";

export const HomepageContentModel: Model<HomepageContentDoc> =
  (mongoose.models.HomepageContent as Model<HomepageContentDoc>) ?? mongoose.model<HomepageContentDoc>("HomepageContent", homepageContentSchema);
