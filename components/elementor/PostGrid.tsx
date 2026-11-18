import "@/styles/wpr-grid.css";
import { getAllPosts } from "@/lib/blog/posts";
import PostGridClient, { type GridItem } from "./PostGridClient";

/**
 * Royal Elementor Addons post grid used on /blog/ (all posts, 12 per "page", Load More, filters).
 * Server part: builds the item data (excerpt cut to N words like the plugin) for the client grid.
 * Lists legacy MDX posts and published admin posts together, newest first.
 */
export type PostGridProps = {
  id?: string;
  cls: string;
  ulCls: string;
  filters: { label: string; liCls: string; active?: boolean }[];
  titleCls: string;
  dateCls: string;
  commentsCls: string;
  excerptCls: string;
  readMoreCls: string;
  readMoreBtnCls: string;
  dateSep?: string;
  perPage: number;
  maxPages: number;
  excerptWords: number;
  gutterH: number;
  gutterV: number;
  gutterHTablet: number;
  gutterHMobile: number;
  columns: number;
};

const cut = (text: string, words: number) => {
  const w = text.split(/\s+/).filter(Boolean);
  return w.length > words ? w.slice(0, words).join(" ") + "..." : text;
};

export default async function PostGrid(props: PostGridProps) {
  const items: GridItem[] = (await getAllPosts()).map((p) => ({
    slug: p.slug,
    title: p.title,
    date: p.dateText,
    excerpt: cut(p.excerpt, props.excerptWords),
  }));
  // WordPress capped Load More at maxPages; keep that, but never hide posts once there are more.
  const maxPages = Math.max(props.maxPages, Math.ceil(items.length / props.perPage));
  return <PostGridClient {...props} maxPages={maxPages} items={items} />;
}
