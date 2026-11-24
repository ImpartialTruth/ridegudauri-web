import en, { type Dictionary } from "./en";
import ka from "./ka";
import ru from "./ru";

import { LOCALES, DEFAULT_LOCALE } from "./locales";
export { LOCALES, DEFAULT_LOCALE };
export type Locale = (typeof LOCALES)[number];

export const LOCALE_LABEL: Record<Locale, { short: string; name: string }> = {
  en: { short: "EN", name: "English" },
  ka: { short: "GE", name: "ქართული" },
  ru: { short: "RU", name: "Русский" },
};

/** og:locale / hreflang values */
export const LOCALE_TAG: Record<Locale, string> = { en: "en_GB", ka: "ka_GE", ru: "ru_RU" };

const DICTS: Record<Locale, Dictionary> = { en, ka, ru };

export const isLocale = (v: string): v is Locale => (LOCALES as readonly string[]).includes(v);
export const getDictionary = (locale: Locale) => DICTS[locale];

/** "{name} text" interpolation */
export const fmt = (s: string, vars: Record<string, string | number>) =>
  s.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? `{${k}}`));

export const money = (amount: number) => `${amount.toLocaleString("en-US").replace(/,/g, " ")} ₾`;

/** "from 150 ₾" — word order differs in Georgian ("150 ₾-დან") */
export const fromLabel = (locale: Locale, amount: number) =>
  locale === "ka" ? `${money(amount)}-დან` : `${getDictionary(locale).common.from} ${money(amount)}`;

export const formatDate = (locale: Locale, iso: string) =>
  new Date(iso + "T12:00:00").toLocaleDateString(locale === "ka" ? "ka-GE" : locale === "ru" ? "ru-RU" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export type { Dictionary };
