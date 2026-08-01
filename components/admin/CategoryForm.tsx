"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { createCategory } from "@/lib/admin/category-actions";

const inputClass =
  "h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-600 focus:outline-none";

export function CategoryForm() {
  const t = useTranslations("admin");
  const [state, action, pending] = useActionState(createCategory, undefined);

  return (
    <form action={action} className="flex flex-col gap-3">
      {state?.error ? (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="text-sm font-medium text-zinc-700">
          {t("categoryName")} *
        </label>
        <input
          id="name"
          name="name"
          required
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="slug" className="text-sm font-medium text-zinc-700">
          {t("slug")}
        </label>
        <input id="slug" name="slug" className={inputClass} />
        <p className="text-xs text-zinc-500">{t("slugHint")}</p>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-11 items-center justify-center rounded-xl bg-emerald-700 px-5 text-sm font-medium text-white transition hover:bg-emerald-800 disabled:opacity-60"
      >
        {pending ? t("saving") : t("add")}
      </button>
    </form>
  );
}
