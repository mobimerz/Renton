/**
 * Image upload rules shared by the browser (ImageUpload) and the server (/api/admin/upload).
 * Change them here only.
 */
export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"] as const;
export const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "gif", "svg"] as const;
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB

/** Top-level folders in the Blob store. The client picks one; the server only accepts these. */
export const UPLOAD_FOLDERS = ["blog", "blog-content", "homepage"] as const;
export type UploadFolder = (typeof UPLOAD_FOLDERS)[number];

/** Vercel Blob public URLs: https://<store>.public.blob.vercel-storage.com/<pathname> */
export const BLOB_HOST_SUFFIX = ".public.blob.vercel-storage.com";

export function isBlobUrl(url: string | null | undefined): url is string {
  if (!url) return false;
  try {
    const u = new URL(url);
    return u.protocol === "https:" && u.hostname.endsWith(BLOB_HOST_SUFFIX);
  } catch {
    return false;
  }
}

/** An uploaded image as stored in MongoDB. width/height are 0 when unknown (e.g. some SVGs). */
export type StoredImage = { url: string; width: number; height: number };

export const formatBytes = (n: number) => (n < 1024 * 1024 ? `${Math.round(n / 1024)} KB` : `${(n / 1024 / 1024).toFixed(1)} MB`);

/** Safe Blob pathname: <folder>/<slugified-name>.<ext>  (Vercel adds a random suffix). */
export function blobPathname(folder: UploadFolder, fileName: string): string {
  const dot = fileName.lastIndexOf(".");
  const ext = (dot > -1 ? fileName.slice(dot + 1) : "").toLowerCase();
  const base = (dot > -1 ? fileName.slice(0, dot) : fileName)
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "-")
    .slice(0, 60) || "image";
  return `${folder}/${base}.${ext || "jpg"}`;
}
