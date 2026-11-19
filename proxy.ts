import { NextResponse, type NextRequest } from "next/server";
import { wpIds } from "@/lib/wp-ids";
import { SESSION_COOKIE, verifySession } from "@/lib/auth/session";

/** Admin pages that must stay reachable without a session. */
const PUBLIC_ADMIN_PATHS = new Set([
  "/admin/login",
  "/admin/login/",
  "/admin/forgot",
  "/admin/forgot/",
  "/admin/reset",
  "/admin/reset/",
]);

/** The sign-in page: an already-signed-in visitor is sent straight to the dashboard. */
const LOGIN_PATHS = new Set(["/admin/login", "/admin/login/"]);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/admin" || pathname.startsWith("/admin/") || pathname.startsWith("/api/admin/")) {
    return adminGuard(request);
  }
  return wordpressShortlinks(request);
}

/**
 * /admin/* and /api/admin/*: require a valid admin session cookie.
 * Pages redirect to /admin/login/?next=…, API routes answer 401 JSON.
 * (Every admin route handler checks the session again; this is the first layer.)
 */
async function adminGuard(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const session = await verifySession(request.cookies.get(SESSION_COOKIE)?.value);
  const isApi = pathname.startsWith("/api/");

  if (PUBLIC_ADMIN_PATHS.has(pathname)) {
    // Already signed in: skip the login form (but still allow forgot/reset).
    if (session && LOGIN_PATHS.has(pathname)) return NextResponse.redirect(new URL("/admin/", request.url));
    return withNoIndex(NextResponse.next());
  }

  if (!session) {
    if (isApi) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const login = new URL("/admin/login/", request.url);
    login.searchParams.set("next", pathname + search);
    return NextResponse.redirect(login);
  }
  return withNoIndex(NextResponse.next());
}

function withNoIndex(res: NextResponse) {
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  return res;
}

/**
 * WordPress shortlinks: /?p=<id> and /?page_id=<id> -> 301 to the clean slug, query removed.
 * (next.config redirects always pass the query string through, so this lives here.)
 */
function wordpressShortlinks(request: NextRequest) {
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
    "/admin",
    "/admin/:path*",
    "/api/admin/:path*",
  ],
};
