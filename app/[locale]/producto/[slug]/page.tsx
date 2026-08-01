import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getProductBySlug } from "@/lib/catalog/queries";
import { formatPrice } from "@/lib/format";
import { Link } from "@/i18n/navigation";
import { AddToCartButton } from "@/components/catalog/AddToCartButton";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Producto no encontrado" };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  return {
    title: product.name,
    description: product.description ?? undefined,
    alternates: {
      canonical: `${siteUrl}/${locale}/producto/${product.slug}`,
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("catalog");

  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-lg flex-1 px-4 py-8 sm:max-w-2xl sm:px-6">
      <Link
        href="/productos"
        className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
      >
        ← {t("backToProducts")}
      </Link>

      <div className="mt-4 overflow-hidden rounded-2xl border border-zinc-200 bg-white">
        <div className="relative aspect-square bg-zinc-100">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, 672px"
              priority
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="h-16 w-16 text-zinc-300"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5M4.5 3h15a1.5 1.5 0 011.5 1.5v15a1.5 1.5 0 01-1.5 1.5h-15a1.5 1.5 0 01-1.5-1.5v-15A1.5 1.5 0 014.5 3z"
                />
              </svg>
            </div>
          )}
        </div>

        <div className="p-4 sm:p-6">
          {product.category ? (
            <Link
              href={{
                pathname: "/productos",
                query: { categoria: product.category.slug },
              }}
              className="text-xs font-medium text-emerald-700 hover:text-emerald-800"
            >
              {product.category.name}
            </Link>
          ) : null}

          <h1 className="mt-1 text-2xl font-semibold text-zinc-900 sm:text-3xl">
            {product.name}
          </h1>

          {!product.isAvailable ? (
            <p className="mt-2 inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
              {t("soldOut")}
              {product.availabilityNote ? ` · ${product.availabilityNote}` : ""}
            </p>
          ) : null}

          <p className="mt-3 text-2xl font-bold text-zinc-900">
            {formatPrice(product.priceCents, product.currency)}
          </p>

          {product.description ? (
            <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-zinc-600">
              {product.description}
            </p>
          ) : null}

          <div className="mt-6 flex flex-col gap-3">
            <AddToCartButton
              product={{
                productId: product.id,
                slug: product.slug,
                name: product.name,
                priceCents: product.priceCents,
                currency: product.currency,
                imageUrl: product.imageUrl,
                externalProductUrl: product.externalProductUrl,
              }}
              disabled={!product.isAvailable}
            />

            {product.externalProductUrl ? (
              <a
                href={product.externalProductUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50"
              >
                {t("viewOnHerbalife")}
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
