"use client";

import { useState } from "react";
import { useActionState } from "react";
import { useTranslations } from "next-intl";
import type { ProductFormState } from "@/lib/admin/product-actions";
import { Link } from "@/i18n/navigation";

export type AdminCategoryOption = {
  id: string;
  name: string;
};

export type AdminProductInitial = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price_cents: number;
  category_id: string | null;
  external_product_url: string | null;
  external_sku: string | null;
  is_available: boolean;
  availability_note: string | null;
  is_active: boolean;
  image_url: string | null;
};

type ProductFormProps = {
  action: (
    prev: ProductFormState,
    formData: FormData,
  ) => Promise<ProductFormState>;
  categories: AdminCategoryOption[];
  initial?: AdminProductInitial;
};

const inputClass =
  "h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-600 focus:outline-none";

export function ProductForm({ action, categories, initial }: ProductFormProps) {
  const t = useTranslations("admin");
  const [state, formAction, pending] = useActionState(action, undefined);
  const [preview, setPreview] = useState(initial?.image_url ?? null);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {state?.error ? (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="text-sm font-medium text-zinc-700">
          {t("productName")} *
        </label>
        <input
          id="name"
          name="name"
          required
          defaultValue={initial?.name}
          className={inputClass}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="slug" className="text-sm font-medium text-zinc-700">
            {t("slug")}
          </label>
          <input
            id="slug"
            name="slug"
            defaultValue={initial?.slug}
            placeholder={initial?.slug}
            className={inputClass}
          />
          <p className="text-xs text-zinc-500">{t("slugHint")}</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="price" className="text-sm font-medium text-zinc-700">
            {t("price")} *
          </label>
          <input
            id="price"
            name="price"
            required
            inputMode="decimal"
            defaultValue={
              initial
                ? (initial.price_cents / 100).toFixed(2).replace(".", ",")
                : ""
            }
            placeholder={t("priceHint")}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="category_id"
            className="text-sm font-medium text-zinc-700"
          >
            {t("category")}
          </label>
          <select
            id="category_id"
            name="category_id"
            defaultValue={initial?.category_id ?? ""}
            className={inputClass}
          >
            <option value="">{t("noCategory")}</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="external_sku"
            className="text-sm font-medium text-zinc-700"
          >
            {t("externalSku")}
          </label>
          <input
            id="external_sku"
            name="external_sku"
            defaultValue={initial?.external_sku ?? ""}
            className={inputClass}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="external_product_url"
          className="text-sm font-medium text-zinc-700"
        >
          {t("externalProductUrl")} *
        </label>
        <input
          id="external_product_url"
          name="external_product_url"
          type="url"
          required
          defaultValue={initial?.external_product_url ?? ""}
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="description"
          className="text-sm font-medium text-zinc-700"
        >
          {t("description")}
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={initial?.description ?? ""}
          className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-600 focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="image" className="text-sm font-medium text-zinc-700">
          {t("image")}
        </label>
        <input
          id="image"
          name="image"
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setPreview(URL.createObjectURL(file));
            }
          }}
          className="block w-full text-sm text-zinc-600 file:mr-3 file:rounded-lg file:border-0 file:bg-zinc-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-zinc-700 hover:file:bg-zinc-200"
        />
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt=""
            className="mt-2 h-32 w-32 rounded-xl border border-zinc-200 object-cover"
          />
        ) : null}
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="availability_note"
          className="text-sm font-medium text-zinc-700"
        >
          {t("availabilityNote")}
        </label>
        <input
          id="availability_note"
          name="availability_note"
          defaultValue={initial?.availability_note ?? ""}
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2 text-sm text-zinc-700">
          <input
            type="checkbox"
            name="is_active"
            defaultChecked={initial?.is_active ?? true}
            className="h-4 w-4 accent-emerald-700"
          />
          {t("isActive")}
        </label>
        <label className="flex items-center gap-2 text-sm text-zinc-700">
          <input
            type="checkbox"
            name="is_available"
            defaultChecked={initial?.is_available ?? true}
            className="h-4 w-4 accent-emerald-700"
          />
          {t("isAvailable")}
        </label>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-12 items-center justify-center rounded-xl bg-emerald-700 px-6 text-sm font-medium text-white transition hover:bg-emerald-800 disabled:opacity-60"
        >
          {pending ? t("saving") : t("save")}
        </button>
        <Link
          href="/admin/productos"
          className="inline-flex h-12 items-center justify-center rounded-xl border border-zinc-300 px-6 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
        >
          {t("cancel")}
        </Link>
      </div>
    </form>
  );
}
