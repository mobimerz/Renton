"use client";

import { useState } from "react";

/** Tags as removable chips. Enter or comma adds a tag; Backspace on an empty field removes the last one. */
export default function TagInput({ id, value, onChange, max = 30 }: { id?: string; value: string[]; onChange: (tags: string[]) => void; max?: number }) {
  const [draft, setDraft] = useState("");

  function add(raw: string) {
    const parts = raw
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    if (!parts.length) return;
    const next = [...value];
    for (const p of parts) if (!next.some((t) => t.toLowerCase() === p.toLowerCase()) && next.length < max) next.push(p.slice(0, 60));
    onChange(next);
    setDraft("");
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5 rounded-md border border-slate-300 bg-white px-2 py-1.5 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-600/20">
      {value.map((tag) => (
        <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-slate-100 py-0.5 pr-1 pl-2.5 text-xs font-medium text-slate-700">
          {tag}
          <button
            type="button"
            onClick={() => onChange(value.filter((t) => t !== tag))}
            className="rounded-full px-1 text-slate-500 hover:bg-slate-200 hover:text-slate-800"
            aria-label={`Remove tag ${tag}`}
          >
            ×
          </button>
        </span>
      ))}
      <input
        id={id}
        value={draft}
        onChange={(e) => (e.target.value.includes(",") ? add(e.target.value) : setDraft(e.target.value))}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            add(draft);
          } else if (e.key === "Backspace" && !draft && value.length) {
            onChange(value.slice(0, -1));
          }
        }}
        onBlur={() => add(draft)}
        placeholder={value.length ? "" : "Type a tag and press Enter"}
        className="min-w-32 flex-1 border-0 bg-transparent px-1 py-1 text-sm focus:outline-none"
      />
    </div>
  );
}
