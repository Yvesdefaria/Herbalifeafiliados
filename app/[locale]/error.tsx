"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  const t = useTranslations("error");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-4 py-16 text-center">
      <h2 className="text-xl font-semibold text-zinc-900">{t("title")}</h2>
      <p className="mt-2 text-sm text-zinc-600">{t("message")}</p>
      <button
        onClick={() => unstable_retry()}
        className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-emerald-700 px-5 text-sm font-medium text-white transition hover:bg-emerald-800"
      >
        {t("retry")}
      </button>
    </div>
  );
}
