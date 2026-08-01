import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/catalog/types";

type Props = {
  product: Product;
};

export async function ProductCard({ product }: Props) {
  const t = await getTranslations("catalog");

  return (
    <Link
      href={`/producto/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white transition hover:border-emerald-300 hover:shadow-sm"
    >
      <div className="relative aspect-square overflow-hidden bg-zinc-100">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, 25vw"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
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
              d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5M4.5 3h15a1.5 1.5 0 011.5 1.5v15a1.5 1.5 0 01-1.5 1.5h-15a1.5 1.5 0 01-1.5-1.5v-15A1.5 1.5 0 014.5 3z"
            />
          </svg>
        )}
        {!product.isAvailable ? (
          <span className="absolute left-2 top-2 rounded-full bg-zinc-900/80 px-2.5 py-1 text-xs font-medium text-white">
            {t("soldOut")}
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3.5">
        <p className="text-xs font-medium text-emerald-700">
          {product.category?.name ?? "\u00A0"}
        </p>
        <h2 className="line-clamp-2 text-sm font-semibold text-zinc-900">
          {product.name}
        </h2>
        <p className="mt-auto pt-2 text-base font-bold text-zinc-900">
          {formatPrice(product.priceCents, product.currency)}
        </p>
      </div>
    </Link>
  );
}
