import { Snow } from "./Icons";

/** Endless scrolling band of words (pauses on hover, static with reduced motion). */
export default function Marquee({ items }: { items: string[] }) {
  const row = (hidden?: boolean) => (
    <ul className="flex shrink-0 items-center gap-10 pr-10" aria-hidden={hidden}>
      {items.map((it, i) => (
        <li key={i} className="flex items-center gap-10 whitespace-nowrap">
          <span>{it}</span>
          <Snow width={22} height={22} className="text-ember-bright" />
        </li>
      ))}
    </ul>
  );
  return (
    <div className="overflow-hidden border-y border-white/10 bg-ink py-5 text-xl font-bold uppercase tracking-wide text-white sm:text-2xl">
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused] motion-reduce:animate-none">
        {row()}
        {row(true)}
      </div>
    </div>
  );
}
