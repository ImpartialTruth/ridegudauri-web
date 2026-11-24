import Image from "next/image";
import Link from "next/link";
import { formatDate, getDictionary, type Locale } from "@/i18n";
import type { BlogPost } from "@/lib/content";

export default function BlogCard({ locale, post }: { locale: Locale; post: BlogPost }) {
  const t = getDictionary(locale);
  return (
    <Link href={`/${locale}/blog/${post.slug}`} className="group flex flex-col">
      <div className="relative aspect-[16/10] overflow-hidden rounded-[var(--radius-card)]">
        <Image
          src={post.image}
          alt=""
          fill
          sizes="(min-width: 768px) 33vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      <time dateTime={post.date} className="mt-5 text-sm text-stone">
        {formatDate(locale, post.date)}
      </time>
      <h3 className="mt-2 text-xl leading-snug text-ink group-hover:text-glacier">{post.title}</h3>
      <p className="mt-2 line-clamp-2 leading-relaxed text-stone">{post.excerpt}</p>
      <span className="mt-3 text-sm font-semibold text-ink underline decoration-line underline-offset-4 group-hover:decoration-ink">
        {t.common.readMore}
      </span>
    </Link>
  );
}
