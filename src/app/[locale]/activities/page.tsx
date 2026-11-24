import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import ActivityCard from "@/components/ActivityCard";
import CtaBand from "@/components/CtaBand";
import Reveal from "@/components/Reveal";
import { getDictionary, isLocale } from "@/i18n";
import { SERVICES } from "@/config/pricing";
import { alternates } from "@/lib/seo";

type Params = Promise<{ locale: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  return { title: t.nav.activities, description: t.home.activitiesText, alternates: alternates(locale, "/activities") };
}

export default async function ActivitiesPage({ params }: { params: Params }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);

  const groups = [
    { key: "winter", items: SERVICES.filter((s) => s.season === "winter") },
    { key: "all-year", items: SERVICES.filter((s) => s.season === "all-year") },
    { key: "summer", items: SERVICES.filter((s) => s.season === "summer") },
  ] as const;

  return (
    <>
      <PageHero
        image="/images/snowmobile.jpg"
        eyebrow={t.home.activitiesEyebrow}
        title={t.home.activitiesTitle}
        subtitle={t.home.activitiesText}
        crumbs={[{ href: `/${locale}`, label: t.common.home }]}
      />
      <div className="container-x space-y-16 py-16 sm:py-24">
        {groups.map((g) => (
          <section key={g.key} aria-labelledby={`season-${g.key}`}>
            <h2 id={`season-${g.key}`} className="text-3xl text-ink">
              {t.seasons[g.key]}
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {g.items.map((s, i) => (
                <Reveal key={s.slug} delay={i * 110} className="flex">
                  <ActivityCard locale={locale} service={s} priority={i < 3} />
                </Reveal>
              ))}
            </div>
          </section>
        ))}
      </div>
      <CtaBand locale={locale} />
    </>
  );
}
