import PageHero from "./PageHero";
import RichText from "./RichText";
import { getDictionary, type Locale } from "@/i18n";
import { getLegal } from "@/lib/content";

export default function LegalPage({ locale, doc }: { locale: Locale; doc: "terms" | "privacy" }) {
  const t = getDictionary(locale);
  const d = getLegal(locale, doc);
  return (
    <>
      <PageHero image="/images/gudauri-ski-map.jpg" title={d.title} crumbs={[{ href: `/${locale}`, label: t.common.home }]} />
      <div className="container-x max-w-3xl py-16 sm:py-20">
        <RichText lines={d.blocks} />
      </div>
    </>
  );
}
