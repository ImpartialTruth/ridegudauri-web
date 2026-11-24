import { getDictionary, type Locale } from "@/i18n";
import HeaderClient from "./HeaderClient";

export default function Header({ locale }: { locale: Locale }) {
  const d = getDictionary(locale);
  const t = d.nav;
  const links = [
    { href: `/${locale}/activities`, label: t.activities },
    { href: `/${locale}/about`, label: t.about },
    { href: `/${locale}/faq`, label: t.faq },
    { href: `/${locale}/blog`, label: t.blog },
    { href: `/${locale}/contact`, label: t.contact },
  ];
  return <HeaderClient locale={locale} links={links} labels={{ book: t.book, menu: t.menu, close: t.close, language: t.language, home: t.home, call: d.contact.phone }} />;
}
