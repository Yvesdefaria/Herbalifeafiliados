"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useCart } from "@/lib/cart/CartContext";
import { formatPrice } from "@/lib/format";
import { Link } from "@/i18n/navigation";

export function CartView() {
  const t = useTranslations("cart");
  const { items, totalCents, setQuantity, removeItem } = useCart();

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-300 py-12 text-center">
        <p className="text-zinc-500">{t("empty")}</p>
        <Link
          href="/productos"
          className="mt-4 inline-flex h-11 items-center justify-center rounded-xl bg-emerald-700 px-5 text-sm font-medium text-white transition hover:bg-emerald-800"
        >
          {t("browse")}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <ul className="flex flex-col gap-3">
        {items.map((item) => (
          <li
            key={item.productId}
            className="flex gap-3 rounded-2xl border border-zinc-200 bg-white p-3"
          >
            <Link
              href={`/producto/${item.slug}`}
              className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-zinc-100"
            >
              {item.imageUrl ? (
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              ) : null}
            </Link>

            <div className="flex min-w-0 flex-1 flex-col">
              <Link
                href={`/producto/${item.slug}`}
                className="truncate text-sm font-semibold text-zinc-900 hover:text-emerald-700"
              >
                {item.name}
              </Link>
              <p className="mt-1 text-sm font-medium text-zinc-900">
                {formatPrice(item.priceCents, item.currency)}
              </p>
              <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                <div className="flex h-9 items-center rounded-lg border border-zinc-200">
                  <button
                    type="button"
                    onClick={() => setQuantity(item.productId, item.quantity - 1)}
                    className="flex h-full w-9 items-center justify-center text-zinc-500 hover:text-zinc-900"
                    aria-label={t("decrease")}
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-sm font-medium text-zinc-900">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(item.productId, item.quantity + 1)}
                    className="flex h-full w-9 items-center justify-center text-zinc-500 hover:text-zinc-900"
                    aria-label={t("increase")}
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(item.productId)}
                  className="text-sm font-medium text-zinc-400 transition hover:text-red-600"
                >
                  {t("remove")}
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="rounded-2xl border border-zinc-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-zinc-600">{t("total")}</p>
          <p className="text-lg font-bold text-zinc-900">
            {formatPrice(totalCents)}
          </p>
        </div>
        <Link
          href="/checkout"
          className="mt-4 inline-flex h-12 w-full items-center justify-center rounded-xl bg-emerald-700 px-5 text-sm font-medium text-white transition hover:bg-emerald-800"
        >
          {t("checkout")}
        </Link>
      </div>
    </div>
  );
}
