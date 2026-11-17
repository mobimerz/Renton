import { NextResponse, type NextRequest } from "next/server";
import { wpIds } from "@/lib/wp-ids";

/**
 * WordPress shortlinks: /?p=<id> and /?page_id=<id> -> 301 to the clean slug, query removed.
 * (next.config redirects always pass the query string through, so this lives here.)
 */
export function proxy(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const id = searchParams.get("p") ?? searchParams.get("page_id");
  const slug = id !== null ? wpIds[id] : undefined;
  if (slug === undefined) return NextResponse.next();
  const url = request.nextUrl.clone();
  url.pathname = slug ? `/${slug}/` : "/";
  url.search = "";
  return NextResponse.redirect(url, 301);
}

export const config = {
  matcher: [
    { source: "/", has: [{ type: "query", key: "p" }] },
    { source: "/", has: [{ type: "query", key: "page_id" }] },
  ],
};
