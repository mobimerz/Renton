import type { Metadata } from "next";
import Link from "next/link";
import BlogTable from "@/components/admin/BlogTable";
import DbNotice from "@/components/admin/DbNotice";
import { Badge, Button, Input, LinkButton, PageHeader, Select } from "@/components/admin/ui";
import { dbSlugMap, listBlogsForAdmin, type AdminBlogRow } from "@/lib/blog/admin";
import { formatDateText, isDbConfigured, getLegacyPosts } from "@/lib/blog/posts";

export const metadata: Metadata = { title: "Blogs" };

type Props = { searchParams: Promise<{ tab?: string; q?: string; status?: string }> };

export default async function BlogsPage({ searchParams }: Props) {
  const { tab, q = "", status = "" } = await searchParams;
  const legacyTab = tab === "legacy";
  const legacySlugs = getLegacyPosts().map((p) => p.slug);

  let rows: AdminBlogRow[] = [];
  let slugMap = new Map<string, { id: string; status: string }>();
  let dbError = false;
  if (isDbConfigured()) {
    try {
      if (legacyTab) slugMap = await dbSlugMap();
      else rows = await listBlogsForAdmin({ q, status });
    } catch (err) {
      console.error("[admin/blogs] page load failed:", err);
      dbError = true;
    }
  }

  const tabCls = (active: boolean) =>
    `-mb-px border-b-2 px-3 py-2 text-sm font-medium ${active ? "border-blue-700 text-blue-700" : "border-transparent text-slate-600 hover:text-slate-900"}`;

  return (
    <>
      <PageHeader title="Blogs" description="Write, edit and publish blog posts." actions={<LinkButton href="/admin/blogs/new/">+ New post</LinkButton>} />

      <nav className="mb-5 flex gap-2 border-b border-slate-200" aria-label="Blog lists">
        <Link href="/admin/blogs/" className={tabCls(!legacyTab)} aria-current={!legacyTab ? "page" : undefined}>
          Posts
        </Link>
        <Link href="/admin/blogs/?tab=legacy" className={tabCls(legacyTab)} aria-current={legacyTab ? "page" : undefined}>
          Legacy posts (MDX) <span className="text-slate-400">{getLegacyPosts().length}</span>
        </Link>
      </nav>

      {!isDbConfigured() || dbError ? (
        <div className="mb-5">
          <DbNotice error={dbError} />
        </div>
      ) : null}

      {legacyTab ? (
        <LegacyList slugMap={slugMap} />
      ) : (
        <>
          <form className="mb-4 flex flex-wrap gap-2" role="search">
            <Input name="q" defaultValue={q} placeholder="Search title or slug…" className="w-full sm:w-72" aria-label="Search posts" />
            <Select name="status" defaultValue={status} className="w-full sm:w-44" aria-label="Filter by status">
              <option value="">All statuses</option>
              <option value="published">Published</option>
              <option value="draft">Drafts</option>
            </Select>
            <Button type="submit" variant="secondary">
              Filter
            </Button>
            {(q || status) && (
              <LinkButton href="/admin/blogs/" variant="ghost">
                Clear
              </LinkButton>
            )}
          </form>

          {rows.length ? (
            <BlogTable rows={rows} legacySlugs={legacySlugs} />
          ) : (
            isDbConfigured() &&
            !dbError && (
              <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-600">
                {q || status ? "No posts match this filter." : "No posts yet. Create your first post, or recreate a legacy post from the Legacy tab."}
              </div>
            )
          )}
        </>
      )}
    </>
  );
}

/** Read-only list of the 37 MDX posts, each with "Recreate in admin". */
function LegacyList({ slugMap }: { slugMap: Map<string, { id: string; status: string }> }) {
  return (
    <>
      <p className="mb-4 text-sm text-slate-600">
        These posts came from WordPress and are stored as code (read-only here). To edit one, recreate it in the admin: the new post uses the same URL and replaces the
        legacy version once it is published.
      </p>
      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs tracking-wide text-slate-500 uppercase">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {getLegacyPosts().map((p) => {
              const db = slugMap.get(p.slug);
              return (
                <tr key={p.slug} className="hover:bg-slate-50">
                  <td className="max-w-lg px-4 py-3">
                    <div className="font-medium text-slate-900">{p.title}</div>
                    <div className="truncate text-xs text-slate-500">/{p.slug}/</div>
                    {db && (
                      <div className="mt-1">
                        <Badge tone={db.status === "published" ? "amber" : "slate"}>
                          {db.status === "published" ? "Replaced by an admin post" : "Admin draft exists"}
                        </Badge>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-slate-600">{p.dateText || formatDateText(p.date)}</td>
                  <td className="px-4 py-3">
                    <span className="flex justify-end gap-1 whitespace-nowrap">
                      <a href={`/${p.slug}/`} target="_blank" rel="noreferrer" className="rounded-md px-2.5 py-1.5 text-sm text-slate-600 hover:bg-slate-100">
                        View
                      </a>
                      {db ? (
                        <Link href={`/admin/blogs/${db.id}/edit/`} className="rounded-md px-2.5 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-50">
                          Edit admin version
                        </Link>
                      ) : (
                        <Link
                          href={`/admin/blogs/new/?from=${encodeURIComponent(p.slug)}`}
                          className="rounded-md px-2.5 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-50"
                        >
                          Recreate in admin
                        </Link>
                      )}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
