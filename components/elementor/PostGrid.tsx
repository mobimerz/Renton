import "@/styles/wpr-grid.css";
import { posts as allPosts } from "@/content/blog";
import PostGridClient, { type GridItem } from "./PostGridClient";

/**
 * Royal Elementor Addons post grid used on /blog/ (all posts, 12 per "page", Load More, filters).
 * Server part: builds the item data (excerpt cut to N words like the plugin) for the client grid.
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

export default function PostGrid(props: PostGridProps) {
  const items: GridItem[] = allPosts.map(({ meta }) => ({
    slug: meta.slug,
    title: meta.wpTitle,
    date: meta.dateText,
    excerpt: cut(meta.excerpt, props.excerptWords),
  }));
  return <PostGridClient {...props} items={items} />;
}
