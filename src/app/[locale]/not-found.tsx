"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/Logo";

const TEXT: Record<string, { title: string; text: string; back: string }> = {
  en: { title: "Page not found", text: "The page you are looking for does not exist.", back: "Back to home" },
  ka: { title: "გვერდი ვერ მოიძებნა", text: "გვერდი, რომელსაც ეძებ, არ არსებობს.", back: "მთავარზე დაბრუნება" },
  ru: { title: "Страница не найдена", text: "Страница, которую вы ищете, не существует.", back: "На главную" },
};

export default function NotFound() {
  const seg = usePathname()?.split("/")[1] ?? "en";
  const locale = TEXT[seg] ? seg : "en";
  const t = TEXT[locale];
  return (
    <section className="flex min-h-[80vh] items-center bg-ink text-white">
      <div className="container-x py-32 text-center">
        <Logo className="mx-auto h-20 w-auto text-white/30" />
        <p className="mt-10 text-7xl font-extrabold">404</p>
        <h1 className="mt-4 text-3xl">{t.title}</h1>
        <p className="mt-3 text-white/70">{t.text}</p>
        <Link href={`/${locale}`} className="btn btn-primary mt-8">
          {t.back}
        </Link>
      </div>
    </section>
  );
}
