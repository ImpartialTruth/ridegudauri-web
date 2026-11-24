import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import ContactForm from "@/components/ContactForm";
import { Clock, Facebook, Instagram, Mail, Phone, Pin, TikTok, WhatsApp } from "@/components/Icons";
import { getDictionary, isLocale } from "@/i18n";
import { SITE } from "@/config/site";
import { alternates } from "@/lib/seo";

type Params = Promise<{ locale: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  return { title: t.contact.title, description: t.contact.subtitle, alternates: alternates(locale, "/contact") };
}

export default async function ContactPage({ params }: { params: Params }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const c = t.contact;

  const info = [
    { Icon: Pin, label: c.location, value: c.locationValue },
    { Icon: Phone, label: c.phone, value: SITE.phone, href: SITE.phoneHref },
    { Icon: Mail, label: c.email, value: SITE.email, href: `mailto:${SITE.email}` },
    { Icon: Clock, label: c.hours, value: `${c.hoursValue}: ${SITE.hours.from}–${SITE.hours.to}` },
  ];

  return (
    <>
      <PageHero
        image="/images/transfer.jpg"
        eyebrow={c.eyebrow}
        title={c.title}
        subtitle={c.subtitle}
        crumbs={[{ href: `/${locale}`, label: t.common.home }]}
      />
      <div className="container-x grid gap-10 py-16 sm:py-20 lg:grid-cols-[1fr_1.4fr]">
        <div className="space-y-4">
          {info.map(({ Icon, label, value, href }) => (
            <div key={label} className="card flex items-center gap-4 p-5">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-glacier-soft text-glacier">
                <Icon width={22} height={22} />
              </span>
              <div className="min-w-0">
                <p className="text-sm text-stone">{label}</p>
                {href ? (
                  <a href={href} className="break-words text-lg font-semibold text-ink hover:text-glacier">
                    {value}
                  </a>
                ) : (
                  <p className="text-lg font-semibold text-ink">{value}</p>
                )}
              </div>
            </div>
          ))}

          <a href={SITE.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp w-full">
            <WhatsApp /> {c.whatsapp}
          </a>

          <div className="pt-4">
            <p className="label">{c.follow}</p>
            <div className="flex gap-2">
              {[
                { href: SITE.social.instagram, label: "Instagram", Icon: Instagram },
                { href: SITE.social.facebook, label: "Facebook", Icon: Facebook },
                { href: SITE.social.tiktok, label: "TikTok", Icon: TikTok },
              ].map(({ href, label, Icon }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="grid h-11 w-11 place-items-center rounded-full border border-field bg-white text-ink hover:border-ink">
                  <Icon />
                </a>
              ))}
            </div>
          </div>
        </div>

        <ContactForm locale={locale} labels={{ ...c, required: t.booking.required }} />
      </div>
    </>
  );
}
