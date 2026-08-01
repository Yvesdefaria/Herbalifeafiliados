"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { login } from "@/lib/auth/actions";
import { Link } from "@/i18n/navigation";

export function LoginForm() {
  const t = useTranslations("auth");
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <form action={action} className="flex flex-col gap-4">
      {state?.error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium text-zinc-700">
          {t("email")}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="h-11 rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-900 focus:border-emerald-700 focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="password"
          className="text-sm font-medium text-zinc-700"
        >
          {t("password")}
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="h-11 rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-900 focus:border-emerald-700 focus:outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="mt-2 inline-flex h-12 items-center justify-center rounded-xl bg-emerald-700 px-5 text-sm font-medium text-white transition hover:bg-emerald-800 disabled:opacity-60"
      >
        {pending ? t("submitting") : t("login")}
      </button>

      <p className="text-center text-sm text-zinc-600">
        {t("noAccount")}{" "}
        <Link href="/registro" className="font-medium text-emerald-700">
          {t("signup")}
        </Link>
      </p>
    </form>
  );
}
