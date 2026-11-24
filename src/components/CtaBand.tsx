import Image from "next/image";
import Link from "next/link";
import { getDictionary, type Locale } from "@/i18n";
import { SITE } from "@/config/site";
import { ArrowRight, WhatsApp } from "./Icons";

export default function CtaBand({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  return (
    <section className="container-x pb-20 sm:pb-28">
      <div className="relative isolate overflow-hidden rounded-[var(--radius-card)] px-6 py-16 text-white sm:px-14 sm:py-20">
        <Image src="/images/snowmobile-2.webp" alt="" fill sizes="100vw" className="-z-10 object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/90 via-ink/70 to-ink/30" />
        <h2 className="max-w-xl text-3xl sm:text-5xl">{t.home.ctaTitle}</h2>
        <p className="mt-4 max-w-lg text-lg text-white/80">{t.home.ctaText}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={`/${locale}/activities`} className="btn btn-primary">
            {t.nav.book} <ArrowRight />
          </Link>
          <a href={SITE.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-glass">
            <WhatsApp /> WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
