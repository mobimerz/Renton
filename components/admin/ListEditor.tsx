"use client";

/**
 * Repeatable list of items with add, remove and move up/down (services, testimonials, FAQs…).
 * Items are edited through renderItem; the parent owns the array.
 */
export default function ListEditor<T>({
  items,
  onChange,
  renderItem,
  newItem,
  itemLabel,
  addLabel = "Add item",
  min = 0,
  max = 50,
}: {
  items: T[];
  onChange: (items: T[]) => void;
  renderItem: (item: T, update: (patch: Partial<T>) => void, index: number) => React.ReactNode;
  newItem: () => T;
  itemLabel: (item: T, index: number) => string;
  addLabel?: string;
  min?: number;
  max?: number;
}) {
  const move = (from: number, to: number) => {
    const next = [...items];
    const [it] = next.splice(from, 1);
    next.splice(to, 0, it);
    onChange(next);
  };
  const ctl = "rounded px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200 disabled:opacity-30 disabled:hover:bg-transparent";

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="rounded-md border border-slate-200 bg-slate-50/60">
          <div className="flex items-center justify-between gap-2 border-b border-slate-200 px-3 py-2">
            <span className="truncate text-sm font-medium text-slate-700">
              {i + 1}. {itemLabel(item, i) || "Untitled"}
            </span>
            <span className="flex shrink-0 gap-0.5">
              <button type="button" className={ctl} onClick={() => move(i, i - 1)} disabled={i === 0} aria-label="Move up">
                ↑
              </button>
              <button type="button" className={ctl} onClick={() => move(i, i + 1)} disabled={i === items.length - 1} aria-label="Move down">
                ↓
              </button>
              <button
                type="button"
                className={`${ctl} text-red-600 hover:bg-red-50`}
                onClick={() => onChange(items.filter((_, j) => j !== i))}
                disabled={items.length <= min}
                aria-label="Remove"
              >
                Remove
              </button>
            </span>
          </div>
          <div className="space-y-3 p-3">{renderItem(item, (patch) => onChange(items.map((it, j) => (j === i ? { ...it, ...patch } : it))), i)}</div>
        </div>
      ))}
      {items.length < max && (
        <button
          type="button"
          onClick={() => onChange([...items, newItem()])}
          className="w-full rounded-md border border-dashed border-slate-300 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50"
        >
          + {addLabel}
        </button>
      )}
    </div>
  );
}
