import { ChevronDown } from "./Icons";
import type { FaqItem } from "@/lib/content";

/** Accessible accordion built on <details>, works without JavaScript. */
export default function FaqList({ items }: { items: FaqItem[] }) {
  return (
    <div className="divide-y divide-line overflow-hidden rounded-[var(--radius-card)] border border-line bg-white">
      {items.map((f) => (
        <details key={f.category + f.id} className="group">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6 px-6 py-5 text-left font-medium text-ink hover:bg-mist/50 [&::-webkit-details-marker]:hidden">
            <span>{f.q}</span>
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
  );
}
