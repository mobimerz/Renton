import "server-only";
import sanitizeHtml from "sanitize-html";

/**
 * Allow-list for blog HTML from the TipTap editor. Anything else (scripts, styles, event
 * handlers, iframes) is stripped before it is stored or shown on the public site.
 */
export function sanitizeBlogHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: ["p", "br", "h2", "h3", "h4", "strong", "b", "em", "i", "u", "s", "a", "ul", "ol", "li", "blockquote", "img", "hr", "code", "pre"],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt", "width", "height"],
      ol: ["start"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedSchemesByTag: { img: ["https", "http"] },
    allowProtocolRelative: false,
    transformTags: {
      // External links open safely; internal links stay as they are.
      a: (tagName, attribs) => {
        const href = attribs.href ?? "";
        const external = /^https?:\/\//i.test(href) && !/^https?:\/\/(www\.)?renton\.org\.in/i.test(href);
        const attrs: Record<string, string> = external ? { href, target: "_blank", rel: "noopener noreferrer" } : { href };
        return { tagName, attribs: attrs };
      },
      h1: "h2", // one h1 per page: the post title
    },
  });
}

/** Every <img src> in a post body (used to delete removed inline images from Blob). */
export function imageUrlsIn(html: string | null | undefined): string[] {
  if (!html) return [];
  return [...html.matchAll(/<img[^>]+src="([^"]+)"/gi)].map((m) => m[1].replace(/&amp;/g, "&"));
}

/** Plain text of an HTML string, collapsed to single spaces. */
export function htmlToText(html: string): string {
  return sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} })
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}
