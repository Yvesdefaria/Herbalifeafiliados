"use client";

import { useEffect } from "react";
import { useCart } from "@/lib/cart/CartContext";

export function ClearCartOnSuccess() {
  const { clear } = useCart();

  useEffect(() => {
    clear();
  }, [clear]);

  return null;
}
