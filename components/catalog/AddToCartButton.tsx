"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useCart } from "@/lib/cart/CartContext";
import type { CartItem } from "@/lib/cart/types";

type Props = {
  product: Omit<CartItem, "quantity">;
  disabled?: boolean;
  className?: string;
};

export function AddToCartButton({ product, disabled, className }: Props) {
  const t = useTranslations("catalog");
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem(product);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1500);
  }

  return (
    <button
      type="button"
      onClick={handleAdd}
      disabled={disabled}
      aria-live="polite"
      className={
        className ??
        "inline-flex h-12 items-center justify-center rounded-xl bg-emerald-700 px-5 text-sm font-medium text-white transition hover:bg-emerald-800 disabled:opacity-70"
      }
    >
      {added ? t("added") : t("addToCart")}
    </button>
  );
}
