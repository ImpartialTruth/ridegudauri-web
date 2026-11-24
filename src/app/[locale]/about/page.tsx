import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";
import SectionHeading from "@/components/SectionHeading";
import { getDictionary, isLocale } from "@/i18n";
import { SITE } from "@/config/site";
import { getAbout, getOverview } from "@/lib/content";
import { alternates } from "@/lib/seo";

type Params = Promise<{ locale: string }>;

const TEAM_NAMES: Record<string, Record<string, string>> = {
  en: { ana: "Ana", rezi: "Rezi", gabriel: "Gabriel", nikoloz: "Nikoloz", george: "George", ketevan: "Ketevan", nikusha: "Nikusha", bidzo: "Bidzo" },
  ka: { ana: "ანა", rezi: "რეზი", gabriel: "გაბრიელი", nikoloz: "ნიკოლოზი", george: "გიორგი", ketevan: "ქეთევანი", nikusha: "ნიკუშა", bidzo: "ბიძო" },
  ru: { ana: "Ана", rezi: "Рези", gabriel: "Габриэль", nikoloz: "Николоз", george: "Георгий", ketevan: "Кетеван", nikusha: "Никуша", bidzo: "Бидзо" },
};

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  return { title: t.about.title, description: getOverview(locale).paragraphs[0], alternates: alternates(locale, "/about") };
}

export default async function AboutPage({ params }: { params: Params }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const sections = getAbout(locale);
  const overview = getOverview(locale);

  return (
    <>
      <PageHero
        image="/images/paragliding-tandem.jpg"
        eyebrow={t.about.eyebrow}
        title={t.about.title}
        subtitle={overview.paragraphs[0]}
        crumbs={[{ href: `/${locale}`, label: t.common.home }]}
      />

      <section className="container-x grid gap-14 py-16 sm:py-24 lg:grid-cols-2">
        <div>
          {sections.map((s) => (
            <div key={s.heading} className="mb-12 last:mb-0">
              <h2 className="text-3xl leading-tight text-ink">{s.heading}</h2>
              <div className="prose-rg mt-5">
                {s.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
          ))}
          <p className="mt-8 border-l-2 border-ember pl-4 font-medium text-ink">{t.about.founders}</p>
        </div>
        <div className="grid grid-cols-2 gap-4 self-start">
          <div className="relative col-span-2 aspect-[16/10] overflow-hidden rounded-[var(--radius-card)]">
            <Image src="/images/gondola-snowboarders.png" alt="" fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
          </div>
          <div className="relative aspect-square overflow-hidden rounded-[var(--radius-card)]">
            <Image src="/images/quad-group.webp" alt="" fill sizes="(min-width: 1024px) 22vw, 50vw" className="object-cover" />
          </div>
          <div className="relative aspect-square overflow-hidden rounded-[var(--radius-card)]">
            <Image src="/images/ski-lesson.jpg" alt="" fill sizes="(min-width: 1024px) 22vw, 50vw" className="object-cover" />
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-24">
        <div className="container-x">
          <SectionHeading eyebrow={t.about.teamEyebrow} title={t.about.teamTitle} />
          <ul className="mt-12 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
            {SITE.team.map((m) => (
              <li key={m}>
                <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-card)] bg-mist">
                  <Image
                    src={`/images/team/${m}.jpg`}
                    alt={TEAM_NAMES[locale][m]}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                    className="object-cover object-top"
                  />
                </div>
                <p className="mt-3 text-lg font-bold text-ink">{TEAM_NAMES[locale][m]}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="pt-16 sm:pt-24">
        <CtaBand locale={locale} />
      </div>
    </>
  );
}
