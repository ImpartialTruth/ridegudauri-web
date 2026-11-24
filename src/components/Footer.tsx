import Link from "next/link";
import Logo from "./Logo";
import { Clock, Facebook, Instagram, Mail, Phone, Pin, TikTok, WhatsApp } from "./Icons";
import { getDictionary, type Locale } from "@/i18n";
import { SITE } from "@/config/site";
import { SERVICES } from "@/config/pricing";
import { getServiceContent } from "@/lib/content";

export default function Footer({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-white/75">
      <div className="container-x grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
        <div>
          <Logo className="h-14 w-auto text-white" />
          <p className="mt-5 max-w-xs leading-relaxed">{t.footer.tagline}</p>
          <div className="mt-6 flex gap-2">
            {[
              { href: SITE.social.instagram, label: "Instagram", Icon: Instagram },
              { href: SITE.social.facebook, label: "Facebook", Icon: Facebook },
              { href: SITE.social.tiktok, label: "TikTok", Icon: TikTok },
              { href: SITE.whatsapp, label: "WhatsApp", Icon: WhatsApp },
            ].map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="grid h-11 w-11 place-items-center rounded-full border border-white/25 text-white transition-colors hover:border-white/40 hover:bg-white/10"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        <nav aria-label={t.footer.explore}>
          <h2 className="font-sans text-sm font-semibold uppercase tracking-wider text-white">{t.footer.explore}</h2>
          <ul className="mt-4 space-y-2.5">
            {SERVICES.map((s) => (
              <li key={s.slug}>
                <Link href={`/${locale}/activity/${s.slug}`} className="hover:text-white">
                  {getServiceContent(locale, s.slug).title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label={t.footer.company}>
          <h2 className="font-sans text-sm font-semibold uppercase tracking-wider text-white">{t.footer.company}</h2>
          <ul className="mt-4 space-y-2.5">
            <li><Link href={`/${locale}/about`} className="hover:text-white">{t.nav.about}</Link></li>
            <li><Link href={`/${locale}/blog`} className="hover:text-white">{t.nav.blog}</Link></li>
            <li><Link href={`/${locale}/faq`} className="hover:text-white">{t.nav.faq}</Link></li>
            <li><Link href={`/${locale}/contact`} className="hover:text-white">{t.nav.contact}</Link></li>
            <li><Link href={`/${locale}/terms`} className="hover:text-white">{t.legal.terms}</Link></li>
            <li><Link href={`/${locale}/privacy-policy`} className="hover:text-white">{t.legal.privacy}</Link></li>
          </ul>
        </nav>

        <div>
          <h2 className="font-sans text-sm font-semibold uppercase tracking-wider text-white">{t.footer.contact}</h2>
          <ul className="mt-4 space-y-3">
            <li className="flex gap-3"><Pin className="mt-0.5 shrink-0 text-white/50" />{t.contact.locationValue}</li>
            <li className="flex gap-3"><Phone className="mt-0.5 shrink-0 text-white/50" /><a href={SITE.phoneHref} className="hover:text-white">{SITE.phone}</a></li>
            <li className="flex gap-3"><Mail className="mt-0.5 shrink-0 text-white/50" /><a href={`mailto:${SITE.email}`} className="hover:text-white">{SITE.email}</a></li>
            <li className="flex gap-3"><Clock className="mt-0.5 shrink-0 text-white/50" />{t.contact.hoursValue}: {SITE.hours.from}–{SITE.hours.to}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-2 py-6 text-sm text-white/50 sm:flex-row sm:justify-between">
          <p>© {year} {SITE.name}. {t.footer.rights}</p>
          <p>Gudauri · Georgia</p>
        </div>
      </div>
    </footer>
  );
}
