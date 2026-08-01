"use client";

import { useTranslations } from "next-intl";
import { useCart } from "@/lib/cart/CartContext";
import { Link } from "@/i18n/navigation";

export function CartButton() {
  const t = useTranslations("nav");
  const { totalItems } = useCart();

  return (
    <Link
      href="/carrito"
      className="relative inline-flex h-10 items-center rounded-lg bg-emerald-700 px-3 text-sm font-medium text-white transition hover:bg-emerald-800"
      aria-label={t("cart")}
    >
      {t("cart")}
      {totalItems > 0 ? (
        <span className="ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-xs font-bold text-emerald-700">
          {totalItems}
        </span>
      ) : null}
    </Link>
  );
}
