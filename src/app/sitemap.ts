import type { MetadataRoute } from "next";
import { LOCALES } from "@/i18n";
import { SITE } from "@/config/site";
import { SERVICES } from "@/config/pricing";
import { getPosts } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    "/activities",
    "/about",
    "/faq",
    "/contact",
    "/blog",
    "/terms",
    "/privacy-policy",
    ...SERVICES.map((s) => `/activity/${s.slug}`),
    ...getPosts("en").map((p) => `/blog/${p.slug}`),
  ];
  return paths.map((p) => ({
    url: `${SITE.url}/en${p}`,
    alternates: { languages: Object.fromEntries(LOCALES.map((l) => [l, `${SITE.url}/${l}${p}`])) },
  }));
}
