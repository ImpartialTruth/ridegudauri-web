import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import BlogCard from "@/components/BlogCard";
import { getDictionary, isLocale } from "@/i18n";
import { getPosts } from "@/lib/content";
import { alternates } from "@/lib/seo";

type Params = Promise<{ locale: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  return { title: t.blog.title, description: t.blog.subtitle, alternates: alternates(locale, "/blog") };
}

export default async function BlogPage({ params }: { params: Params }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const posts = getPosts(locale);

  return (
    <>
      <PageHero
        image="/images/snowmobile-2.webp"
        eyebrow={t.blog.eyebrow}
        title={t.blog.title}
        subtitle={t.blog.subtitle}
        crumbs={[{ href: `/${locale}`, label: t.common.home }]}
      />
      <div className="container-x grid gap-x-6 gap-y-14 py-16 sm:grid-cols-2 sm:py-20 lg:grid-cols-3">
        {posts.map((p) => (
          <BlogCard key={p.slug} locale={locale} post={p} />
        ))}
      </div>
    </>
  );
}
