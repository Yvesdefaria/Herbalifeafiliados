import { getTranslations, setRequestLocale } from "next-intl/server";
import { ProductCard } from "@/components/catalog/ProductCard";
import { getCategories, getProducts } from "@/lib/catalog/queries";
import { Link } from "@/i18n/navigation";
import { localizedAlternates } from "@/lib/site";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ categoria?: string; q?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "catalog" });
  return {
    title: t("title"),
    description: t("subtitle"),
    openGraph: {
      title: t("title"),
      description: t("subtitle"),
      type: "website",
    },
    alternates: localizedAlternates(locale, "productos"),
  };
}

export default async function ProductsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { categoria, q } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations("catalog");
  const tNav = await getTranslations("nav");

  const [products, categories] = await Promise.all([
    getProducts({ categorySlug: categoria, search: q }),
    getCategories(),
  ]);

  return (
    <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">{t("title")}</h1>
          {q || categoria ? (
            <p className="mt-1 text-sm text-zinc-500">
              {t("resultsCount", { count: products.length })}
            </p>
          ) : null}
        </div>
        <Link
          href="/productos"
          className="shrink-0 text-sm font-medium text-emerald-700 hover:text-emerald-800"
        >
          {tNav("home")}
        </Link>
      </div>

      <form
        action={`/${locale}/productos`}
        method="get"
        className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center"
      >
        <label className="relative flex-1">
          <span className="sr-only">{t("search")}</span>
          <input
            type="search"
            name="q"
            defaultValue={q ?? ""}
            placeholder={t("searchPlaceholder")}
            className="h-11 w-full rounded-xl border border-zinc-300 bg-white px-4 text-sm text-zinc-900 focus:border-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700/40"
          />
        </label>
        {categoria ? <input type="hidden" name="categoria" value={categoria} /> : null}
        <button
          type="submit"
          className="inline-flex h-11 items-center justify-center rounded-xl bg-emerald-700 px-5 text-sm font-medium text-white transition hover:bg-emerald-800"
        >
          {t("search")}
        </button>
      </form>

      <nav
        className="mt-6 flex gap-2 overflow-x-auto pb-1"
        aria-label={t("categories")}
      >
        <Link
          href="/productos"
          aria-current={!categoria ? "page" : undefined}
          className={`shrink-0 rounded-full px-3.5 py-2 text-sm font-medium transition ${
            !categoria
              ? "bg-emerald-700 text-white"
              : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
          }`}
        >
          {t("all")}
        </Link>
        {categories.map((category) => {
          const active = categoria === category.slug;
          const href = { pathname: "/productos", query: { categoria: category.slug } } as const;
          return (
            <Link
              key={category.id}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`shrink-0 rounded-full px-3.5 py-2 text-sm font-medium transition ${
                active
                  ? "bg-emerald-700 text-white"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
              }`}
            >
              {category.name}
            </Link>
          );
        })}
      </nav>

      {products.length > 0 ? (
        <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
          {products.map((product) => (
            <li key={product.id}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-10 rounded-2xl border border-dashed border-zinc-300 py-12 text-center">
          <p className="text-zinc-500">{t("empty")}</p>
        </div>
      )}
    </div>
  );
}
