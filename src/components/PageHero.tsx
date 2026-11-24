import Image from "next/image";
import Link from "next/link";
import MountainDivider from "./MountainDivider";

interface Props {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  image: string;
  crumbs?: { href: string; label: string }[];
  children?: React.ReactNode;
  tall?: boolean;
}

/** Dark photo banner used at the top of inner pages (header sits on top of it). */
export default function PageHero({ title, eyebrow, subtitle, image, crumbs, children, tall }: Props) {
  return (
    <section className={`relative isolate flex items-end overflow-hidden bg-ink text-white ${tall ? "min-h-[70vh]" : "min-h-[46vh] sm:min-h-[52vh]"}`}>
      <Image src={image} alt="" fill priority sizes="100vw" className="-z-10 animate-ken-burns object-cover motion-reduce:animate-none" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/55 to-ink/25" />
      <div className="container-x pb-20 pt-32 sm:pb-28">
        {crumbs && (
          <nav aria-label="Breadcrumb" className="mb-4 text-sm text-white/70">
            <ol className="flex flex-wrap items-center gap-2">
              {crumbs.map((c, i) => (
                <li key={c.href} className="flex items-center gap-2">
                  {i > 0 && <span aria-hidden>/</span>}
                  <Link href={c.href} className="hover:text-white">
                    {c.label}
                  </Link>
                </li>
              ))}
            </ol>
          </nav>
        )}
        {eyebrow && <p className="eyebrow rise !text-white/80">{eyebrow}</p>}
        <h1 className="rise mt-3 max-w-4xl text-4xl leading-[1.1] sm:text-5xl lg:text-6xl" style={{ "--d": "100ms" } as React.CSSProperties}>{title}</h1>
        {subtitle && <p className="rise mt-5 max-w-2xl text-lg leading-relaxed text-white/85" style={{ "--d": "220ms" } as React.CSSProperties}>{subtitle}</p>}
        <div className="rise" style={{ "--d": "340ms" } as React.CSSProperties}>{children}</div>
      </div>
      <MountainDivider />
    </section>
  );
}
