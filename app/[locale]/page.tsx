import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getFeaturedProducts } from "@/lib/catalog/queries";
import { getLatestPosts } from "@/lib/blog/queries";
import { ProductCard } from "@/components/catalog/ProductCard";
import { BlogCard } from "@/components/blog/BlogCard";
import { localizedAlternates } from "@/lib/site";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const tHome = await getTranslations({ locale, namespace: "home" });

  return {
    description: t("description"),
    openGraph: {
      title: tHome("title"),
      description: t("description"),
      type: "website",
    },
    alternates: localizedAlternates(locale, ""),
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");

  const [featured, latestPosts] = await Promise.all([
    getFeaturedProducts(4),
    getLatestPosts(3),
  ]);

  return (
    <div className="flex flex-1 flex-col">
      <section className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-4 py-12 sm:px-6">
        <p className="mb-3 inline-flex w-fit rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800">
          {t("badge")}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-zinc-600 sm:text-lg">
          {t("subtitle")}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/productos"
            className="inline-flex h-12 items-center justify-center rounded-xl bg-emerald-700 px-5 text-sm font-medium text-white transition hover:bg-emerald-800"
          >
            {t("ctaProducts")}
          </Link>
          <Link
            href="/blog"
            className="inline-flex h-12 items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50"
          >
            {t("ctaBlog")}
          </Link>
        </div>
      </section>

      {featured.length > 0 ? (
        <section className="mx-auto w-full max-w-5xl px-4 pb-12 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-zinc-900">
              {t("featured")}
            </h2>
            <Link
              href="/productos"
              className="shrink-0 text-sm font-medium text-emerald-700 hover:text-emerald-800"
            >
              {t("seeAll")}
            </Link>
          </div>
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-5">
            {featured.map((product) => (
              <li key={product.id}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {latestPosts.length > 0 ? (
        <section className="mx-auto w-full max-w-5xl px-4 pb-12 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-zinc-900">
              {t("latestPosts")}
            </h2>
            <Link
              href="/blog"
              className="shrink-0 text-sm font-medium text-emerald-700 hover:text-emerald-800"
            >
              {t("viewAllPosts")}
            </Link>
          </div>
          <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {latestPosts.map((post) => (
              <li key={post.id}>
                <BlogCard post={post} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
