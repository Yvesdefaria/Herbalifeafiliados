"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type { CartContextValue, CartItem } from "./types";

const STORAGE_KEY = "herbalife-cart";

const listeners = new Set<() => void>();

let items: CartItem[] = [];

function readStorage(): CartItem[] {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeStorage(next: CartItem[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // storage no disponible; carrito solo en memoria
  }
}

function emit() {
  for (const listener of listeners) {
    listener();
  }
}

function setItems(next: CartItem[]) {
  items = next;
  writeStorage(next);
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): CartItem[] {
  return items;
}

function getServerSnapshot(): CartItem[] {
  return [];
}

if (typeof window !== "undefined") {
  items = readStorage();
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const snapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const addItem = useCallback(
    (item: Omit<CartItem, "quantity">, quantity = 1) => {
      const existing = snapshot.find((i) => i.productId === item.productId);
      if (existing) {
        setItems(
          snapshot.map((i) =>
            i.productId === item.productId
              ? { ...i, quantity: i.quantity + quantity }
              : i,
          ),
        );
        return;
      }
      setItems([...snapshot, { ...item, quantity }]);
    },
    [snapshot],
  );

  const removeItem = useCallback(
    (productId: string) => {
      setItems(snapshot.filter((i) => i.productId !== productId));
    },
    [snapshot],
  );

  const setQuantity = useCallback(
    (productId: string, quantity: number) => {
      setItems(
        quantity <= 0
          ? snapshot.filter((i) => i.productId !== productId)
          : snapshot.map((i) =>
              i.productId === productId ? { ...i, quantity } : i,
            ),
      );
    },
    [snapshot],
  );

  const clear = useCallback(() => {
    setItems([]);
  }, []);

  const value = useMemo<CartContextValue>(() => {
    const totalItems = snapshot.reduce((acc, i) => acc + i.quantity, 0);
    const totalCents = snapshot.reduce(
      (acc, i) => acc + i.priceCents * i.quantity,
      0,
    );
    return {
      items: snapshot,
      totalItems,
      totalCents,
      addItem,
      removeItem,
      setQuantity,
      clear,
    };
  }, [snapshot, addItem, removeItem, setQuantity, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart debe usarse dentro de <CartProvider>");
  }
  return ctx;
}
