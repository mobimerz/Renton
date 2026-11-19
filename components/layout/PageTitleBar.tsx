export type Crumb = { name: string; path: string };

/**
 * Page title bar (Phlox theme "Home › …" heading) — intentionally hidden sitewide.
 * Kept as a no-op so every page can still pass a title/crumbs without rendering the bar.
 */
export default function PageTitleBar(props: { title: string; crumbs?: Crumb[] }) {
  void props; // title/crumbs accepted but intentionally not rendered
  return null;
}
