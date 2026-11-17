import { wpEmoji } from "@/lib/emoji";

/** Renders HTML copied from WordPress text-editor widgets (trusted, sanitised at import time). */
export default function RichText({
  html,
  className = "",
  as: Tag = "div",
}: {
  html: string;
  className?: string;
  as?: "div" | "section" | "article";
}) {
  return <Tag className={`rich ${className}`} dangerouslySetInnerHTML={{ __html: wpEmoji(html) }} />;
}
