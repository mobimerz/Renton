import type { Metadata } from "next";
import Link from "next/link";
import DbNotice from "@/components/admin/DbNotice";
import { Card, LinkButton, PageHeader } from "@/components/admin/ui";
import { blogCounts, listBlogsForAdmin, type AdminBlogRow } from "@/lib/blog/admin";
import { isDbConfigured, getLegacyPosts } from "@/lib/blog/posts";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  let counts = { total: 0, published: 0, draft: 0 };
  let recent: AdminBlogRow[] = [];
  let dbError = false;
  if (isDbConfigured()) {
    try {
      [counts, recent] = await Promise.all([blogCounts(), listBlogsForAdmin()]);
      recent = recent.slice(0, 5);
    } catch (err) {
      console.error("[admin] dashboard load failed:", err);
      dbError = true;
    }
  }

  const stats = [
    { label: "Total posts", value: counts.total, href: "/admin/blogs/" },
    { label: "Published", value: counts.published, href: "/admin/blogs/?status=published" },
    { label: "Drafts", value: counts.draft, href: "/admin/blogs/?status=draft" },
    { label: "Legacy posts (MDX)", value: getLegacyPosts().length, href: "/admin/blogs/?tab=legacy" },
  ];

  return (
    <>
      <PageHeader title="Dashboard" description="Manage the Renton website content." actions={<LinkButton href="/admin/blogs/new/">+ New post</LinkButton>} />

      {(!isDbConfigured() || dbError) && (
        <div className="mb-6">
          <DbNotice error={dbError} />
        </div>
      )}

      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm hover:border-blue-300">
            <div className="text-xs font-medium tracking-wide text-slate-500 uppercase">{s.label}</div>
            <div className="mt-1 text-3xl font-semibold text-slate-900 tabular-nums">{s.value}</div>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Card title="Recently edited posts" actions={<Link href="/admin/blogs/" className="text-sm font-medium text-blue-700 hover:underline">All posts →</Link>}>
          {recent.length ? (
            <ul className="divide-y divide-slate-100">
              {recent.map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-3 py-2.5">
                  <Link href={`/admin/blogs/${r.id}/edit/`} className="truncate text-sm font-medium text-slate-800 hover:text-blue-700">
                    {r.title}
                  </Link>
                  <span className={`shrink-0 text-xs ${r.status === "published" ? "text-green-700" : "text-slate-500"}`}>
                    {r.status === "published" ? "Published" : "Draft"}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">No admin posts yet.</p>
          )}
        </Card>

        <Card title="Quick links">
          <div className="flex flex-col gap-2">
            <LinkButton href="/admin/blogs/new/">Write a new post</LinkButton>
            <LinkButton href="/admin/homepage/" variant="secondary">
              Edit homepage
            </LinkButton>
            <LinkButton href="/admin/blogs/?tab=legacy" variant="secondary">
              Recreate a legacy post
            </LinkButton>
            <a href="/" target="_blank" rel="noreferrer" className="pt-1 text-center text-sm font-medium text-blue-700 hover:underline">
              View website ↗
            </a>
          </div>
        </Card>
      </div>
    </>
  );
}
