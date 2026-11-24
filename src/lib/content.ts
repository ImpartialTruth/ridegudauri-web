/**
 * All page content goes through this module. Today it reads the JSON generated
 * from ../kb (npm run content); later it can call the backend or a CMS without
 * touching any page.
 */
import data from "@/content/generated.json";
import type { Locale } from "@/i18n";
import type { ServiceSlug } from "@/config/pricing";

export interface ServiceContent {
  title: string;
  description: string[];
  url: string;
}
export interface FaqItem {
  id: string;
  category: string;
  q: string;
  a: string[];
}
export interface Section {
  heading: string;
  paragraphs: string[];
}
export interface BlogPost {
  slug: string;
  title: string;
  image: string;
  date: string;
  excerpt: string;
  body: string[];
}
export interface LegalDoc {
  title: string;
  blocks: string[];
}

interface LocaleContent {
  services: Record<ServiceSlug, ServiceContent>;
  faq: FaqItem[];
  about: Section[];
  overview: Section;
  terms: LegalDoc;
  privacy: LegalDoc;
  blog: BlogPost[];
}

const content = (data as unknown as { locales: Record<Locale, LocaleContent> }).locales;

export const getServiceContent = (locale: Locale, slug: ServiceSlug) => content[locale].services[slug];
export const getFaq = (locale: Locale) => content[locale].faq;
export const getAbout = (locale: Locale) => content[locale].about;
export const getOverview = (locale: Locale) => content[locale].overview;
export const getLegal = (locale: Locale, doc: "terms" | "privacy") => content[locale][doc];
export const getPosts = (locale: Locale) => content[locale].blog;
export const getPost = (locale: Locale, slug: string) => content[locale].blog.find((p) => p.slug === slug);

/** FAQ entries relevant to a service page (by category index in the source FAQ). */
export function getServiceFaq(locale: Locale, slug: ServiceSlug): FaqItem[] {
  const faq = content[locale].faq;
  const cats = [...new Set(faq.map((f) => f.category))]; // [general, ski school, paragliding]
  if (slug === "ski-instructor") return faq.filter((f) => f.category === cats[1]).slice(0, 6);
  if (slug === "paragliding") return faq.filter((f) => f.category === cats[2]);
  return faq.filter((f) => f.category === cats[0] && ["03", "04", "05"].includes(f.id));
}
