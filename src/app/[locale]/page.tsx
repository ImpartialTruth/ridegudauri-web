import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ActivityCard from "@/components/ActivityCard";
import SectionHeading from "@/components/SectionHeading";
import BlogCard from "@/components/BlogCard";
import { ArrowRight, Award, Compass, Shield, Users, WhatsApp, Snow, Sun } from "@/components/Icons";
import { getDictionary, isLocale } from "@/i18n";
import { SERVICES } from "@/config/pricing";
import { SITE } from "@/config/site";
import { getPosts, getServiceContent } from "@/lib/content";
import CtaBand from "@/components/CtaBand";
import Reveal from "@/components/Reveal";
import CountUp from "@/components/CountUp";
import Marquee from "@/components/Marquee";
import MountainDivider from "@/components/MountainDivider";
import type { ServiceSlug } from "@/config/pricing";

const WHY_ICONS = [Award, Compass, Shield, Users];

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const h = t.home;
  const posts = getPosts(locale).slice(0, 3);

  return (
    <>
      {/* HERO */}
      <section className="relative isolate flex min-h-[min(100svh,60rem)] items-end overflow-hidden bg-ink text-white">
        <Image src="/images/paragliding.jpg" alt="" fill priority sizes="100vw" className="-z-10 animate-ken-burns object-cover object-[50%_35%] motion-reduce:animate-none" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/40 to-ink/30" />
        <div className="container-x pb-20 pt-32 sm:pb-28">
          <p className="eyebrow rise !text-white/85">{h.eyebrow}</p>
          <h1 className="rise mt-4 max-w-4xl text-[2.5rem] leading-[1.05] sm:text-6xl lg:text-7xl" style={{ "--d": "120ms" } as React.CSSProperties}>{h.title}</h1>
          <p className="rise mt-6 max-w-2xl text-lg leading-relaxed text-white/85 sm:text-xl" style={{ "--d": "260ms" } as React.CSSProperties}>{h.subtitle}</p>
          <div className="rise mt-9 flex flex-wrap gap-3" style={{ "--d": "400ms" } as React.CSSProperties}>
            <Link href={`/${locale}/activities`} className="btn btn-primary">
              {h.cta} <ArrowRight />
            </Link>
            <a href={SITE.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-glass">
              <WhatsApp /> {h.secondary}
            </a>
          </div>

          <dl className="rise mt-14 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-white/20 pt-8 sm:grid-cols-4" style={{ "--d": "560ms" } as React.CSSProperties}>
            {h.stats.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  <span className="block text-3xl font-extrabold sm:text-4xl"><CountUp value={s.value} /></span>
                  <span className="mt-1 block text-sm text-white/70">{s.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <MountainDivider className="text-ink" />
      </section>

      <Marquee items={SERVICES.map((s) => getServiceContent(locale, s.slug).title)} />

      {/* ACTIVITIES */}
      <section className="py-20 sm:py-28">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <Reveal>
              <SectionHeading eyebrow={h.activitiesEyebrow} title={h.activitiesTitle} text={h.activitiesText} />
            </Reveal>
            <Link href={`/${locale}/activities`} className="btn btn-outline self-start md:self-auto">
              {t.common.viewAll} <ArrowRight />
            </Link>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s, i) => (
              <Reveal key={s.slug} delay={(i % 3) * 110} className="flex">
                <ActivityCard locale={locale} service={s} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SEASONS */}
      <section className="bg-white py-20 sm:py-28">
        <div className="container-x">
          <p className="eyebrow text-center">{h.seasonsEyebrow}</p>
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {[
              { title: h.winterTitle, text: h.winterText, img: "/images/gondola-snowboarders.png", Icon: Snow, slugs: ["ski-instructor", "snowmobile", "paragliding"] as ServiceSlug[] },
              { title: h.summerTitle, text: h.summerText, img: "/images/quad-group.webp", Icon: Sun, slugs: ["quad-bike", "rafting", "paragliding"] as ServiceSlug[] },
            ].map(({ title, text, img, Icon, slugs }, i) => (
              <Reveal key={title} delay={i * 140} as="article" className="group relative isolate flex min-h-[28rem] flex-col justify-end overflow-hidden rounded-[var(--radius-card)] p-8 text-white sm:p-10">
                <Image src={img} alt="" fill sizes="(min-width: 1024px) 50vw, 100vw" className="-z-10 object-cover transition-transform duration-[1.2s] group-hover:scale-105" />
                <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/90 via-ink/40 to-transparent" />
                <Icon width={28} height={28} className="text-white/80" />
                <h2 className="mt-4 text-3xl sm:text-4xl">{title}</h2>
                <p className="mt-3 max-w-md leading-relaxed text-white/85">{text}</p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {slugs.map((slug) => (
                    <li key={slug}>
                      <Link href={`/${locale}/activity/${slug}`} className="inline-flex rounded-full bg-white/15 px-3.5 py-1.5 text-sm backdrop-blur hover:bg-white/25">
                        {getServiceContent(locale, slug).title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* WHY */}
      <section className="py-20 sm:py-28">
        <div className="container-x grid items-center gap-14 lg:grid-cols-2">
          <Reveal className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-card)] lg:aspect-[5/6]">
            <Image src="/images/paragliding-tandem.jpg" alt="" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
            <div className="absolute bottom-5 left-5 rounded-2xl bg-white/90 px-5 py-4 text-ink shadow-[var(--shadow-lift)] backdrop-blur">
              <p className="text-3xl font-extrabold">2 196 m</p>
              <p className="text-sm text-stone">Gudauri</p>
            </div>
          </Reveal>
          <div>
            <SectionHeading eyebrow={h.whyEyebrow} title={h.whyTitle} />
            <ul className="mt-10 grid gap-8 sm:grid-cols-2">
              {h.why.map((w, i) => {
                const Icon = WHY_ICONS[i];
                return (
                  <Reveal as="li" key={w.title} delay={i * 100}>
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-glacier-soft text-glacier">
                      <Icon width={24} height={24} />
                    </span>
                    <h3 className="mt-4 text-lg text-ink">{w.title}</h3>
                    <p className="mt-1.5 leading-relaxed text-stone">{w.text}</p>
                  </Reveal>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      {/* HOW */}
      <section className="bg-ink py-20 text-white sm:py-28">
        <div className="container-x">
          <p className="eyebrow !text-ember-bright">{h.howEyebrow}</p>
          <h2 className="mt-3 text-3xl sm:text-4xl">{h.howTitle}</h2>
          <ol className="mt-12 grid gap-6 md:grid-cols-3">
            {h.how.map((step, i) => (
              <Reveal as="li" key={step.title} delay={i * 140} className="lift rounded-[var(--radius-card)] border border-white/10 bg-white/[0.04] p-8 hover:border-ember-bright/60">
                <span className="text-6xl font-extrabold text-ember-bright/80">0{i + 1}</span>
                <h3 className="mt-6 text-xl">{step.title}</h3>
                <p className="mt-2 leading-relaxed text-white/70">{step.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* BLOG */}
      <section className="py-20 sm:py-28">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading eyebrow={h.blogEyebrow} title={h.blogTitle} />
            <Link href={`/${locale}/blog`} className="btn btn-outline self-start md:self-auto">
              {t.blog.back} <ArrowRight />
            </Link>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {posts.map((p, i) => (
              <Reveal key={p.slug} delay={i * 110}>
                <BlogCard locale={locale} post={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand locale={locale} />
    </>
  );
}
