"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "./Logo";
import LocaleSwitcher from "./LocaleSwitcher";
import { Close, Menu, Phone, WhatsApp } from "./Icons";
import type { Locale } from "@/i18n/index";
import { SITE } from "@/config/site";

interface Props {
  locale: Locale;
  links: { href: string; label: string }[];
  labels: { book: string; menu: string; close: string; language: string; home: string; call: string };
}

export default function HeaderClient({ locale, links, labels }: Props) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const solid = scrolled || open;
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid ? "bg-white/95 text-ink shadow-[0_1px_0_var(--color-line)] backdrop-blur" : "bg-gradient-to-b from-black/45 to-transparent text-white"
      }`}
    >
      <div className="container-x flex h-16 items-center justify-between gap-4 lg:h-20">
        <Link href={`/${locale}`} className="shrink-0" aria-label={`${SITE.name} — ${labels.home}`}>
          <Logo className="h-11 w-auto lg:h-12" />
        </Link>

        <nav className="hidden lg:block" aria-label="Main">
          <ul className="flex items-center gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={isActive(l.href) ? "page" : undefined}
                  className={`rounded-full px-3.5 py-2 text-[0.9rem] font-medium transition-colors ${
                    isActive(l.href)
                      ? solid
                        ? "bg-mist text-ink"
                        : "bg-white/15"
                      : solid
                        ? "text-ink-soft hover:text-ink"
                        : "text-white/85 hover:text-white"
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <LocaleSwitcher locale={locale} solid={solid} label={labels.language} />
          <Link href={`/${locale}/activities`} className="btn btn-primary hidden !py-2.5 sm:inline-flex">
            {labels.book}
          </Link>
          <button
            type="button"
            className={`grid h-10 w-10 place-items-center rounded-full lg:hidden ${solid ? "hover:bg-mist" : "hover:bg-white/15"}`}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? labels.close : labels.menu}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <Close width={24} height={24} /> : <Menu width={24} height={24} />}
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-menu" className="h-[calc(100dvh-4rem)] overflow-y-auto border-t border-line bg-white lg:hidden">
          <nav className="container-x py-6" aria-label="Mobile">
            <ul className="divide-y divide-line">
              {links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="flex py-4 text-2xl font-bold text-ink" aria-current={isActive(l.href) ? "page" : undefined}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-8 grid gap-3">
              <Link href={`/${locale}/activities`} className="btn btn-primary w-full">
                {labels.book}
              </Link>
              <div className="grid grid-cols-2 gap-3">
                <a href={SITE.phoneHref} className="btn btn-outline">
                  <Phone /> {labels.call}
                </a>
                <a href={SITE.whatsapp} className="btn btn-outline" target="_blank" rel="noopener noreferrer">
                  <WhatsApp /> WhatsApp
                </a>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
