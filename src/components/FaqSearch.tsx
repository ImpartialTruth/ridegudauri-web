"use client";

import { useMemo, useState } from "react";
import type { FaqItem } from "@/lib/content";
import { ChevronDown, Search } from "./Icons";

export default function FaqSearch({
  items,
  labels,
}: {
  items: FaqItem[];
  labels: { search: string; all: string; noResults: string };
}) {
  const categories = useMemo(() => [...new Set(items.map((i) => i.category))], [items]);
  const [cat, setCat] = useState<string | null>(null);
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return items.filter(
      (i) =>
        (!cat || i.category === cat) &&
        (!needle || i.q.toLowerCase().includes(needle) || i.a.some((a) => a.toLowerCase().includes(needle))),
    );
  }, [items, cat, q]);

  const pretty = (c: string) => c.charAt(0) + c.slice(1).toLowerCase();

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2" role="group">
          {[null, ...categories].map((c) => (
            <button
              key={c ?? "all"}
              type="button"
              aria-pressed={cat === c}
              onClick={() => setCat(c)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                cat === c ? "border-ink bg-ink text-white" : "border-field bg-white text-ink hover:border-ink"
              }`}
            >
              {c ? pretty(c) : labels.all}
            </button>
          ))}
        </div>
        <label className="relative block md:w-80">
          <span className="sr-only">{labels.search}</span>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-stone" />
          <input type="search" className="field !rounded-full !pl-11" placeholder={labels.search} value={q} onChange={(e) => setQ(e.target.value)} />
        </label>
      </div>

      <div className="mt-8">
        {filtered.length === 0 ? (
          <p className="rounded-[var(--radius-card)] bg-white p-8 text-center text-stone">{labels.noResults}</p>
        ) : (
          <div className="divide-y divide-line overflow-hidden rounded-[var(--radius-card)] border border-line bg-white">
            {filtered.map((f) => (
              <details key={f.category + f.id} className="group">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 px-6 py-5 text-left font-medium text-ink hover:bg-mist/50 [&::-webkit-details-marker]:hidden">
                  <span>
                    {!cat && <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-glacier">{pretty(f.category)}</span>}
                    {f.q}
                  </span>
                  <ChevronDown className="mt-0.5 shrink-0 text-stone transition-transform group-open:rotate-180" />
                </summary>
                <div className="space-y-3 px-6 pb-6 leading-relaxed text-stone">
                  {f.a.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </details>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
