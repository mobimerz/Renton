import "server-only";
import { del } from "@vercel/blob";
import { isBlobUrl } from "./upload-rules";

/**
 * Deletes images from Vercel Blob. Only touches URLs in our Blob store (old /images/... files
 * from the WordPress import are never deleted). Never throws: a failed delete leaves an orphan
 * file, which is better than failing the save that triggered it.
 */
export async function deleteBlobs(urls: (string | null | undefined)[]): Promise<void> {
  const targets = [...new Set(urls.filter(isBlobUrl))];
  if (targets.length === 0) return;
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.warn("[blob] BLOB_READ_WRITE_TOKEN missing, not deleting", targets);
    return;
  }
  try {
    await del(targets);
  } catch (err) {
    console.error("[blob] delete failed:", targets, err);
  }
}

/** After a save: delete every old Blob image that is no longer referenced. */
export async function deleteReplacedBlobs(before: (string | null | undefined)[], after: (string | null | undefined)[]): Promise<void> {
  const kept = new Set(after.filter(Boolean));
  await deleteBlobs(before.filter((u) => u && !kept.has(u)));
}
