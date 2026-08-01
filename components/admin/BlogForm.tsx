"use client";

import { useState } from "react";
import { useActionState } from "react";
import { useTranslations } from "next-intl";
import type { BlogFormState } from "@/lib/admin/blog-actions";
import { Link } from "@/i18n/navigation";

export type AdminBlogPostInitial = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  image_url: string | null;
  published: boolean;
};

type BlogFormProps = {
  action: (
    prev: BlogFormState,
    formData: FormData,
  ) => Promise<BlogFormState>;
  initial?: AdminBlogPostInitial;
};

const inputClass =
  "h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-600 focus:outline-none";

export function BlogForm({ action, initial }: BlogFormProps) {
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
        <label htmlFor="title" className="text-sm font-medium text-zinc-700">
          {t("postTitle")} *
        </label>
        <input
          id="title"
          name="title"
          required
          defaultValue={initial?.title}
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="slug" className="text-sm font-medium text-zinc-700">
          {t("slug")}
        </label>
        <input
          id="slug"
          name="slug"
          defaultValue={initial?.slug}
          className={inputClass}
        />
        <p className="text-xs text-zinc-500">{t("slugHint")}</p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="excerpt" className="text-sm font-medium text-zinc-700">
          {t("excerpt")}
        </label>
        <textarea
          id="excerpt"
          name="excerpt"
          rows={2}
          defaultValue={initial?.excerpt ?? ""}
          className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-600 focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="content" className="text-sm font-medium text-zinc-700">
          {t("content")} *
        </label>
        <textarea
          id="content"
          name="content"
          required
          rows={10}
          defaultValue={initial?.content}
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

      <label className="flex items-center gap-2 text-sm text-zinc-700">
        <input
          type="checkbox"
          name="published"
          defaultChecked={initial?.published ?? false}
          className="h-4 w-4 accent-emerald-700"
        />
        {t("published")}
      </label>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-12 items-center justify-center rounded-xl bg-emerald-700 px-6 text-sm font-medium text-white transition hover:bg-emerald-800 disabled:opacity-60"
        >
          {pending ? t("saving") : t("save")}
        </button>
        <Link
          href="/admin/blog"
          className="inline-flex h-12 items-center justify-center rounded-xl border border-zinc-300 px-6 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
        >
          {t("cancel")}
        </Link>
      </div>
    </form>
  );
}
