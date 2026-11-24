import type { Metadata } from "next";
import { LOCALES, type Locale } from "@/i18n";

/** canonical + hreflang alternates for a path like "/activities" */
export function alternates(locale: Locale, path: string): Metadata["alternates"] {
  const languages: Record<string, string> = {};
  for (const l of LOCALES) languages[l === "ka" ? "ka-GE" : l] = `/${l}${path}`;
  languages["x-default"] = `/en${path}`;
  return { canonical: `/${locale}${path}`, languages };
}

/** href helper: localized internal link */
export const href = (locale: Locale, path = "") => `/${locale}${path}`;
