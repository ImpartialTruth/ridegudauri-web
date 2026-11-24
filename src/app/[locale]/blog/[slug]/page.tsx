import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import RichText from "@/components/RichText";
import BlogCard from "@/components/BlogCard";
import { ArrowLeft } from "@/components/Icons";
import { LOCALES, formatDate, getDictionary, isLocale } from "@/i18n";
import { getPost, getPosts } from "@/lib/content";
import { alternates } from "@/lib/seo";

type Params = Promise<{ locale: string; slug: string }>;

export function generateStaticParams() {
  return LOCALES.flatMap((locale) => getPosts(locale).map((p) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const post = getPost(locale, slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: alternates(locale, `/blog/${slug}`),
    openGraph: { type: "article", images: [post.image] },
  };
}

export default async function PostPage({ params }: { params: Params }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const post = getPost(locale, slug);
  if (!post) notFound();
  const t = getDictionary(locale);
  const more = getPosts(locale).filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <>
      <PageHero
        image={post.image}
        title={post.title}
        crumbs={[
          { href: `/${locale}`, label: t.common.home },
          { href: `/${locale}/blog`, label: t.blog.title },
        ]}
      >
        <time dateTime={post.date} className="mt-5 block text-white/75">
          {formatDate(locale, post.date)}
        </time>
      </PageHero>

      <article className="container-x max-w-3xl py-16 sm:py-20">
        <RichText lines={post.body} />
        <Link href={`/${locale}/blog`} className="btn btn-outline mt-12">
          <ArrowLeft /> {t.blog.back}
        </Link>
      </article>

      <section className="bg-white py-16 sm:py-20">
        <div className="container-x">
          <h2 className="text-3xl text-ink">{t.home.blogTitle}</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {more.map((p) => (
              <BlogCard key={p.slug} locale={locale} post={p} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
