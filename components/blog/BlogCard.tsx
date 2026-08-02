import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { BlogPostSummary } from "@/lib/blog/queries";

type Props = {
  post: BlogPostSummary;
};

export async function BlogCard({ post }: Props) {
  const t = await getTranslations("blog");
  const locale = await getLocale();

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white transition hover:border-emerald-300 hover:shadow-sm"
    >
      <div className="relative aspect-video overflow-hidden bg-zinc-100">
        {post.imageUrl ? (
          <Image
            src={post.imageUrl}
            alt={post.title}
            fill
            sizes="(max-width: 640px) 100vw, 25vw"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="h-10 w-10 text-zinc-300"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-3.5">
        {post.publishedAt ? (
          <p className="text-xs text-zinc-500">
            {new Date(post.publishedAt).toLocaleDateString(locale)}
          </p>
        ) : null}
        <h2 className="line-clamp-2 text-sm font-semibold text-zinc-900">
          {post.title}
        </h2>
        {post.excerpt ? (
          <p className="line-clamp-2 text-sm text-zinc-600">{post.excerpt}</p>
        ) : null}
        <p className="mt-auto pt-1 text-xs font-medium text-emerald-700">
          {t("readMore")}
        </p>
      </div>
    </Link>
  );
}
