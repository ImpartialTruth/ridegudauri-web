"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LOCALES } from "@/i18n/locales";
import { ChevronDown } from "./Icons";

const LABEL: Record<string, { short: string; name: string }> = {
  en: { short: "EN", name: "English" },
  ka: { short: "GE", name: "ქართული" },
  ru: { short: "RU", name: "Русский" },
};

export default function LocaleSwitcher({ locale, solid, label }: { locale: string; solid: boolean; label: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
    };
  }, []);

  const swap = (l: string) => pathname.replace(new RegExp(`^/${locale}(?=/|$)`), `/${l}`);
  const remember = (l: string) => {
    document.cookie = `locale=${l}; path=/; max-age=31536000; samesite=lax`;
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={label}
        className={`flex items-center gap-1 rounded-full px-3 py-2 text-sm font-semibold ${solid ? "hover:bg-mist" : "hover:bg-white/15"}`}
      >
        {LABEL[locale].short}
        <ChevronDown width={16} height={16} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <ul role="listbox" aria-label={label} className="absolute right-0 mt-2 w-40 overflow-hidden rounded-xl bg-white py-1 text-ink shadow-[var(--shadow-lift)]">
          {LOCALES.map((l) => (
            <li key={l} role="option" aria-selected={l === locale}>
              <Link
                href={swap(l)}
                hrefLang={l}
                onClick={() => {
                  remember(l);
                  setOpen(false);
                }}
                className={`flex items-center justify-between px-4 py-2.5 text-sm hover:bg-mist ${l === locale ? "font-semibold" : ""}`}
              >
                <span>{LABEL[l].name}</span>
                <span className="text-xs text-stone">{LABEL[l].short}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
