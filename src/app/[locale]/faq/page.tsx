import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import FaqSearch from "@/components/FaqSearch";
import { WhatsApp } from "@/components/Icons";
import { getDictionary, isLocale } from "@/i18n";
import { SITE } from "@/config/site";
import { getFaq } from "@/lib/content";
import { alternates } from "@/lib/seo";

type Params = Promise<{ locale: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  return { title: t.faq.title, description: t.faq.subtitle, alternates: alternates(locale, "/faq") };
}

export default async function FaqPage({ params }: { params: Params }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const faq = getFaq(locale);

  // FAQPage structured data for search engines
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a.join(" ") } })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHero
        image="/images/gudauri-ski-map.jpg"
        eyebrow={t.faq.eyebrow}
        title={t.faq.title}
        subtitle={t.faq.subtitle}
        crumbs={[{ href: `/${locale}`, label: t.common.home }]}
      />
      <div className="container-x max-w-5xl py-16 sm:py-20">
        <FaqSearch items={faq} labels={{ search: t.faq.search, all: t.faq.all, noResults: t.faq.noResults }} />

        <div className="mt-14 flex flex-col items-start justify-between gap-6 rounded-[var(--radius-card)] bg-ink p-8 text-white sm:flex-row sm:items-center sm:p-10">
          <h2 className="text-2xl sm:text-3xl">{t.faq.stillQuestions}</h2>
          <div className="flex flex-wrap gap-3">
            <a href={SITE.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              <WhatsApp /> WhatsApp
            </a>
            <Link href={`/${locale}/contact`} className="btn btn-glass">
              {t.nav.contact}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
