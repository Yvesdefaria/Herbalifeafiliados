import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getPublishedPostBySlug } from "@/lib/blog/queries";
import { Link } from "@/i18n/navigation";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  if (!post) {
    return { title: "Entrada no encontrada" };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const languages = { es: "/es", en: "/en", pt: "/pt" } as const;
  const alternates: Metadata["alternates"] = {
    canonical: `${siteUrl}/${locale}/blog/${post.slug}`,
    languages: {
      ...Object.fromEntries(
        Object.entries(languages).map(([lang, path]) => [
          lang,
          `${siteUrl}${path}/blog/${post.slug}`,
        ]),
      ),
      "x-default": `${siteUrl}/blog/${post.slug}`,
    },
  };

  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      images: post.imageUrl ? [post.imageUrl] : undefined,
      type: "article",
      publishedTime: post.publishedAt ?? undefined,
    },
    alternates,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("blog");
  const post = await getPublishedPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt ?? undefined,
    image: post.imageUrl ?? undefined,
    datePublished: post.publishedAt ?? undefined,
    url: `${siteUrl}/${locale}/blog/${post.slug}`,
    inLanguage: locale,
  };

  return (
    <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-8 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Link
        href="/blog"
        className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
      >
        ← {t("backToBlog")}
      </Link>

      <article className="mt-4">
        {post.imageUrl ? (
          <div className="relative aspect-video overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100">
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 672px) 100vw, 672px"
              className="object-cover"
            />
          </div>
        ) : null}

        {post.publishedAt ? (
          <p className="mt-5 text-xs text-zinc-500">
            {new Date(post.publishedAt).toLocaleDateString(locale)}
          </p>
        ) : null}

        <h1 className="mt-2 text-2xl font-semibold text-zinc-900 sm:text-3xl">
          {post.title}
        </h1>

        {post.excerpt ? (
          <p className="mt-3 text-base leading-relaxed text-zinc-600">
            {post.excerpt}
          </p>
        ) : null}

        <div className="mt-6 whitespace-pre-line text-base leading-relaxed text-zinc-800">
          {post.content}
        </div>
      </article>
    </div>
  );
}
