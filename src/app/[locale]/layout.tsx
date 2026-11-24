import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import { Montserrat, Noto_Sans_Georgian } from "next/font/google";
import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { LOCALES, LOCALE_TAG, getDictionary, isLocale } from "@/i18n";
import { SITE } from "@/config/site";
import { alternates } from "@/lib/seo";

// Montserrat covers Latin + Cyrillic; Georgian glyphs fall through to Noto Sans Georgian.
const montserrat = Montserrat({ subsets: ["latin", "cyrillic"], variable: "--font-montserrat", display: "swap" });
const notoSansKa = Noto_Sans_Georgian({ subsets: ["georgian"], variable: "--font-noto-sans-georgian", display: "swap" });

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export const viewport: Viewport = { themeColor: "#0d1b24" };

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  return {
    metadataBase: new URL(SITE.url),
    title: { default: t.meta.title, template: `%s | ${SITE.name}` },
    description: t.meta.description,
    alternates: alternates(locale, ""),
    openGraph: {
      type: "website",
      siteName: SITE.name,
      locale: LOCALE_TAG[locale],
      images: [{ url: "/images/paragliding.jpg", width: 1920, height: 1873 }],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);

  return (
    <html lang={locale} className={`${montserrat.variable} ${notoSansKa.variable}`} suppressHydrationWarning>
      <body className="min-h-dvh flex flex-col">
        {/* enables scroll-reveal styles only when JS runs (content stays visible without JS) */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.dataset.js='1'" }} />
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] btn btn-dark">
          {t.common.skipToContent}
        </a>
        <Header locale={locale} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer locale={locale} />
        <FloatingWhatsApp label={t.contact.whatsapp} />
        {/* ChatGe AI chat widget — renders its own button bottom-right */}
        <Script src={SITE.chatWidget.src} data-bot-id={SITE.chatWidget.botId} strategy="lazyOnload" />
      </body>
    </html>
  );
}
