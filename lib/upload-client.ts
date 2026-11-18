"use client";

import { upload } from "@vercel/blob/client";
import { IMAGE_TYPES, MAX_IMAGE_BYTES, blobPathname, formatBytes, type StoredImage, type UploadFolder } from "./upload-rules";

/**
 * Browser-side upload logic shared by <ImageUpload> and the blog editor's image button:
 * validate -> read dimensions -> upload straight to Vercel Blob (token from /api/admin/upload).
 */
export class UploadValidationError extends Error {}

export function validateImageFile(file: File): void {
  if (!(IMAGE_TYPES as readonly string[]).includes(file.type)) {
    throw new UploadValidationError(`"${file.name}" is not a supported image. Use JPG, PNG, WebP, GIF or SVG.`);
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new UploadValidationError(`"${file.name}" is ${formatBytes(file.size)}. The limit is ${formatBytes(MAX_IMAGE_BYTES)}.`);
  }
}

/** Natural size of an image file (0x0 if the browser can't tell, e.g. an SVG without width/height). */
export function readImageSize(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth || 0, height: img.naturalHeight || 0 });
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      resolve({ width: 0, height: 0 });
      URL.revokeObjectURL(url);
    };
    img.src = url;
  });
}

export async function uploadImage(
  file: File,
  folder: UploadFolder,
  opts: { onProgress?: (percentage: number) => void; signal?: AbortSignal } = {},
): Promise<StoredImage> {
  validateImageFile(file);
  const size = await readImageSize(file);
  try {
    const blob = await upload(blobPathname(folder, file.name), file, {
      access: "public",
      handleUploadUrl: "/api/admin/upload/",
      contentType: file.type,
      abortSignal: opts.signal,
      onUploadProgress: (e) => opts.onProgress?.(Math.round(e.percentage)),
    });
    return { url: blob.url, ...size };
  } catch (err) {
    // The token route answers with { error } JSON; @vercel/blob wraps it in its message.
    const msg = err instanceof Error ? err.message : String(err);
    const match = msg.match(/"error"\s*:\s*"([^"]+)"/);
    throw new Error(match ? match[1] : msg || "Upload failed.");
  }
}

/** Remove a Blob file that was uploaded in the form but never saved. Fire-and-forget. */
export function discardUpload(url: string): void {
  void fetch("/api/admin/upload/", {
    method: "DELETE",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ url }),
  }).catch(() => {});
}
