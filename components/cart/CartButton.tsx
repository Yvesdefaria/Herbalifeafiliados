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
      className="relative inline-flex h-10 items-center justify-center rounded-lg bg-emerald-700 px-2.5 text-sm font-medium text-white transition hover:bg-emerald-800 sm:px-3"
      aria-label={t("cart")}
    >
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.8}
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
        />
      </svg>
      <span className="ml-2 hidden sm:inline">{t("cart")}</span>
      {totalItems > 0 ? (
        <span className="absolute -right-1.5 -top-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-xs font-bold text-emerald-700">
          {totalItems}
        </span>
      ) : null}
    </Link>
  );
}
