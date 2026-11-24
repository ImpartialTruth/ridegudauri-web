import Image from "next/image";
import Link from "next/link";
import { fromLabel, getDictionary, type Locale } from "@/i18n";
import { fromPrice, type ServicePricing } from "@/config/pricing";
import { getServiceContent } from "@/lib/content";
import { ArrowRight, Snow, Sun, Mountain } from "./Icons";

export default function ActivityCard({ locale, service, priority }: { locale: Locale; service: ServicePricing; priority?: boolean }) {
  const t = getDictionary(locale);
  const c = getServiceContent(locale, service.slug);
  const s = t.services[service.slug];
  const SeasonIcon = service.season === "winter" ? Snow : service.season === "summer" ? Sun : Mountain;

  return (
    <Link
      href={`/${locale}/activity/${service.slug}`}
      className="lift group card flex w-full flex-col overflow-hidden hover:shadow-[var(--shadow-lift)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={service.image}
          alt={c.title}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-ink backdrop-blur">
          <SeasonIcon width={14} height={14} />
          {t.seasons[service.season]}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-2xl leading-snug text-ink">{c.title}</h3>
        <p className="mt-2 flex-1 leading-relaxed text-stone">{s.card}</p>
        <div className="mt-6 flex items-end justify-between gap-4 border-t border-line pt-4">
          <p>
            <span className="block text-xl font-bold text-ink">{fromLabel(locale, fromPrice(service))}</span>
            <span className="text-sm text-stone">{s.unit}</span>
          </p>
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-mist text-ink transition-colors group-hover:bg-ember group-hover:text-white">
            <ArrowRight />
            <span className="sr-only">{t.common.learnMore}</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
