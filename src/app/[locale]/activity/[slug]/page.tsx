import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import BookingWidget from "@/components/BookingWidget";
import ActivityCard from "@/components/ActivityCard";
import FaqList from "@/components/FaqList";
import { Check, Clock, Mountain, Snow, Sun, Users } from "@/components/Icons";
import { LOCALES, fromLabel, getDictionary, isLocale } from "@/i18n";
import { SERVICES, fromPrice, getService } from "@/config/pricing";
import { getServiceContent, getServiceFaq } from "@/lib/content";
import { alternates } from "@/lib/seo";

type Params = Promise<{ locale: string; slug: string }>;

export function generateStaticParams() {
  return LOCALES.flatMap((locale) => SERVICES.map((s) => ({ locale, slug: s.slug })));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, slug } = await params;
  const service = getService(slug);
  if (!isLocale(locale) || !service) return {};
  const c = getServiceContent(locale, service.slug);
  const t = getDictionary(locale);
  return {
    title: c.title,
    description: t.services[service.slug].card,
    alternates: alternates(locale, `/activity/${slug}`),
    openGraph: { images: [service.image] },
  };
}

export default async function ActivityPage({ params }: { params: Params }) {
  const { locale, slug } = await params;
  const service = getService(slug);
  if (!isLocale(locale) || !service) notFound();

  const t = getDictionary(locale);
  const c = getServiceContent(locale, service.slug);
  const s = t.services[service.slug];
  const faq = getServiceFaq(locale, service.slug);
  const others = SERVICES.filter((x) => x.slug !== service.slug).slice(0, 3);
  const SeasonIcon = service.season === "winter" ? Snow : service.season === "summer" ? Sun : Mountain;

  const facts = [
    { Icon: SeasonIcon, label: t.activity.season, value: t.seasons[service.season] },
    s.duration && { Icon: Clock, label: t.activity.duration, value: s.duration },
    service.facts.minAge && { Icon: Users, label: t.activity.minAge, value: `${service.facts.minAge}+ ${t.activity.years}` },
  ].filter(Boolean) as { Icon: typeof Clock; label: string; value: string }[];

  return (
    <>
      <PageHero
        image={service.image}
        title={c.title}
        subtitle={s.card}
        crumbs={[
          { href: `/${locale}`, label: t.common.home },
          { href: `/${locale}/activities`, label: t.nav.activities },
        ]}
      >
        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
          <p className="text-2xl font-semibold">
            {fromLabel(locale, fromPrice(service))} <span className="text-base font-normal text-white/70">/ {s.unit}</span>
          </p>
          <a href="#book" className="btn btn-primary lg:hidden">
            {t.common.bookNow}
          </a>
        </div>
      </PageHero>

      <div className="container-x grid gap-12 py-14 lg:grid-cols-[minmax(0,1fr)_26rem] lg:gap-16 lg:py-20">
        <div className="min-w-0">
          <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {facts.map(({ Icon, label, value }) => (
              <div key={label} className="card flex items-center gap-3 p-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-glacier-soft text-glacier">
                  <Icon />
                </span>
                <div className="min-w-0">
                  <dt className="text-xs text-stone">{label}</dt>
                  <dd className="font-semibold text-ink">{value}</dd>
                </div>
              </div>
            ))}
          </dl>

          <section className="mt-12">
            <h2 className="text-3xl text-ink">{t.activity.about}</h2>
            <div className="prose-rg mt-5">
              {c.description.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </section>

          <section className="mt-12">
            <h2 className="text-2xl text-ink">{t.activity.highlights}</h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {s.highlights.map((h) => (
                <li key={h} className="flex items-start gap-3 rounded-xl bg-white p-4 shadow-[var(--shadow-soft)]">
                  <Check className="mt-0.5 shrink-0 text-glacier" />
                  <span className="text-ink-soft">{h}</span>
                </li>
              ))}
            </ul>
          </section>

          {service.gallery.length > 0 && (
            <div className={`mt-12 grid gap-4 ${service.gallery.length > 1 ? "sm:grid-cols-2" : ""}`}>
              {service.gallery.map((src) => (
                <div key={src} className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-card)]">
                  <Image src={src} alt={c.title} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
                </div>
              ))}
            </div>
          )}

          {faq.length > 0 && (
            <section className="mt-14">
              <h2 className="text-2xl text-ink">{t.activity.faqTitle}</h2>
              <div className="mt-5">
                <FaqList items={faq} />
              </div>
            </section>
          )}
        </div>

        <aside id="book" className="scroll-mt-24">
          <div className="lg:sticky lg:top-28">
            <BookingWidget locale={locale} service={service} t={t.booking} serviceTitle={c.title} />
          </div>
        </aside>
      </div>

      <section className="bg-white py-16 sm:py-20">
        <div className="container-x">
          <h2 className="text-3xl text-ink">{t.activity.otherActivities}</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((o) => (
              <ActivityCard key={o.slug} locale={locale} service={o} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
