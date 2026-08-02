"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useCart } from "@/lib/cart/CartContext";
import { formatPrice } from "@/lib/format";
import { Link } from "@/i18n/navigation";

export function CheckoutForm() {
  const t = useTranslations("checkout");
  const locale = useLocale();
  const { items, totalCents } = useCart();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (items.length === 0 || submitting) {
      return;
    }
    setSubmitting(true);
    setError(false);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          customer: { name, email, phone, address },
          locale,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error("checkout failed");
      }
      window.location.href = data.url;
    } catch {
      setError(true);
      setSubmitting(false);
    }
  }

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
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6"
    >
      <section className="rounded-2xl border border-zinc-200 bg-white p-4">
        <h2 className="text-sm font-semibold text-zinc-900">{t("contact")}</h2>
        <div className="mt-4 grid gap-3">
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("name")}
            aria-label={t("name")}
            className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-600 focus:outline-none"
          />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("email")}
            aria-label={t("email")}
            className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-600 focus:outline-none"
          />
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={t("phone")}
            aria-label={t("phone")}
            className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-600 focus:outline-none"
          />
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder={t("address")}
            aria-label={t("address")}
            rows={3}
            className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-600 focus:outline-none"
          />
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-4">
        <h2 className="text-sm font-semibold text-zinc-900">{t("summary")}</h2>
        <ul className="mt-3 flex flex-col gap-3">
          {items.map((item) => (
            <li key={item.productId} className="flex items-center gap-3">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-zinc-100">
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                ) : null}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-zinc-900">
                  {item.name}
                </p>
                <p className="text-xs text-zinc-500">
                  {item.quantity} × {formatPrice(item.priceCents, item.currency)}
                </p>
              </div>
              <p className="text-sm font-semibold text-zinc-900">
                {formatPrice(item.priceCents * item.quantity, item.currency)}
              </p>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-4">
          <p className="text-sm font-medium text-zinc-600">{t("total")}</p>
          <p className="text-lg font-bold text-zinc-900">{formatPrice(totalCents)}</p>
        </div>
      </section>

      {error ? (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {t("error")}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-emerald-700 px-5 text-sm font-medium text-white transition hover:bg-emerald-800 disabled:opacity-70"
      >
        {submitting ? t("submitting") : t("submit")}
      </button>
    </form>
  );
}
