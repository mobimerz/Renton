import "server-only";
import { revalidatePath } from "next/cache";

/**
 * After blog or homepage content changes: mark every page (post pages, /blog/ grid, archive,
 * prev/next links, homepage) plus the feed and sitemap as stale. Each regenerates on its next
 * visit, so this is cheap even though it is broad.
 */
export function revalidateSiteContent(): void {
  revalidatePath("/", "layout");
  revalidatePath("/feed");
  revalidatePath("/sitemap.xml");
}
