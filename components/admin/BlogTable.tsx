"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "./ui";
import ConfirmDialog from "./ConfirmDialog";
import type { AdminBlogRow } from "@/lib/blog/admin";

const fmt = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" }) : "—";

/** Posts table (cards on mobile) with Edit and Delete (with confirmation). */
export default function BlogTable({ rows, legacySlugs }: { rows: AdminBlogRow[]; legacySlugs: string[] }) {
  const router = useRouter();
  const [toDelete, setToDelete] = useState<AdminBlogRow | null>(null);
  const [deleting, setDeleting] = useState(false);
  const legacy = new Set(legacySlugs);

  async function confirmDelete() {
    if (!toDelete) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/blogs/${toDelete.id}/`, { method: "DELETE" });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Could not delete the post.");
      toast.success(`Deleted "${toDelete.title}"`);
      setToDelete(null);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not delete the post.");
    } finally {
      setDeleting(false);
    }
  }

  const badges = (r: AdminBlogRow) => (
    <span className="flex flex-wrap gap-1">
      <Badge tone={r.status === "published" ? "green" : "slate"}>{r.status === "published" ? "Published" : "Draft"}</Badge>
      {legacy.has(r.slug) && <Badge tone="amber">Overrides legacy post</Badge>}
    </span>
  );

  const actions = (r: AdminBlogRow) => (
    <span className="flex justify-end gap-1">
      {r.status === "published" && (
        <a href={`/${r.slug}/`} target="_blank" rel="noreferrer" className="rounded-md px-2.5 py-1.5 text-sm text-slate-600 hover:bg-slate-100">
          View
        </a>
      )}
      <Link href={`/admin/blogs/${r.id}/edit/`} className="rounded-md px-2.5 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-50">
        Edit
      </Link>
      <button type="button" onClick={() => setToDelete(r)} className="rounded-md px-2.5 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50">
        Delete
      </button>
    </span>
  );

  return (
    <>
      {/* Desktop table */}
      <div className="hidden overflow-x-auto rounded-lg border border-slate-200 bg-white md:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs tracking-wide text-slate-500 uppercase">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Published</th>
              <th className="px-4 py-3 font-medium">Updated</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50">
                <td className="max-w-md px-4 py-3">
                  <Link href={`/admin/blogs/${r.id}/edit/`} className="font-medium text-slate-900 hover:text-blue-700">
                    {r.title}
                  </Link>
                  <div className="truncate text-xs text-slate-500">/{r.slug}/</div>
                </td>
                <td className="px-4 py-3">{badges(r)}</td>
                <td className="px-4 py-3 whitespace-nowrap text-slate-600">{fmt(r.publishedAt)}</td>
                <td className="px-4 py-3 whitespace-nowrap text-slate-600">{fmt(r.updatedAt)}</td>
                <td className="px-4 py-3">{actions(r)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <ul className="space-y-3 md:hidden">
        {rows.map((r) => (
          <li key={r.id} className="rounded-lg border border-slate-200 bg-white p-4">
            <Link href={`/admin/blogs/${r.id}/edit/`} className="font-medium text-slate-900">
              {r.title}
            </Link>
            <div className="mt-0.5 truncate text-xs text-slate-500">/{r.slug}/</div>
            <div className="mt-2">{badges(r)}</div>
            <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
              <span>Updated {fmt(r.updatedAt)}</span>
              {actions(r)}
            </div>
          </li>
        ))}
      </ul>

      <ConfirmDialog
        open={!!toDelete}
        title="Delete this post?"
        confirmLabel="Delete post"
        loading={deleting}
        onCancel={() => setToDelete(null)}
        onConfirm={() => void confirmDelete()}
      >
        <p>
          <strong>{toDelete?.title}</strong> and its uploaded images will be permanently deleted. This cannot be undone.
        </p>
        {toDelete && legacy.has(toDelete.slug) && <p className="mt-2">The original legacy post will show at /{toDelete.slug}/ again.</p>}
      </ConfirmDialog>
    </>
  );
}
