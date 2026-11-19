import "server-only";
import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

/**
 * A single document per admin email that holds:
 *  - passwordHash: the current password (bcrypt) once it has been changed via the
 *    "forgot password" flow. While null the login falls back to the ADMIN_PASSWORD env var.
 *  - resetTokenHash / resetExpires: a pending password-reset request (the raw token is
 *    emailed, only its SHA-256 is stored here) and when it expires.
 */
const adminAuthSchema = new Schema(
  {
    email: { type: String, required: true, trim: true, lowercase: true, unique: true, index: true, maxlength: 200 },
    passwordHash: { type: String, default: null },
    resetTokenHash: { type: String, default: null },
    resetExpires: { type: Date, default: null },
  },
  { timestamps: true, collection: "admin_auth" },
);

export type AdminAuthDoc = InferSchemaType<typeof adminAuthSchema> & {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export const AdminAuth: Model<AdminAuthDoc> =
  (mongoose.models.AdminAuth as Model<AdminAuthDoc>) ?? mongoose.model<AdminAuthDoc>("AdminAuth", adminAuthSchema);
