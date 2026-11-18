import "server-only";
import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";
import { BLOG_STATUSES } from "@/lib/blog/schema";

const imageSchema = new Schema(
  {
    url: { type: String, required: true },
    width: { type: Number, default: 0 },
    height: { type: Number, default: 0 },
    alt: { type: String, default: "" },
  },
  { _id: false },
);

const blogSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, required: true, trim: true, lowercase: true, unique: true, index: true, maxlength: 100 },
    excerpt: { type: String, default: "" },
    content: { type: String, default: "" },
    featuredImage: { type: imageSchema, default: null },
    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
    author: { type: String, default: "" },
    tags: { type: [String], default: [] },
    status: { type: String, enum: BLOG_STATUSES, default: "draft", index: true },
    publishedAt: { type: Date, default: null, index: true },
  },
  { timestamps: true, collection: "blogs" },
);

blogSchema.index({ status: 1, publishedAt: -1 });

export type BlogDoc = InferSchemaType<typeof blogSchema> & { _id: mongoose.Types.ObjectId; createdAt: Date; updatedAt: Date };

// Reuse the compiled model across hot reloads / warm serverless invocations.
export const Blog: Model<BlogDoc> = (mongoose.models.Blog as Model<BlogDoc>) ?? mongoose.model<BlogDoc>("Blog", blogSchema);
