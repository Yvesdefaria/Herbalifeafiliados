import { getTranslations } from "next-intl/server";

export default async function Loading() {
  const t = await getTranslations("loading");

  return (
    <div
      className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6"
      role="status"
      aria-live="polite"
    >
      <span className="sr-only">{t("loading")}</span>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="animate-pulse rounded-2xl border border-zinc-200 bg-white p-3"
          >
            <div className="aspect-square rounded-xl bg-zinc-100" />
            <div className="mt-3 h-3 w-3/4 rounded bg-zinc-100" />
            <div className="mt-2 h-4 w-1/2 rounded bg-zinc-100" />
          </div>
        ))}
      </div>
    </div>
  );
}
