import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function NotFoundPage() {
  const t = await getTranslations("notFound");

  return (
    <div className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center px-4 py-16 text-center">
      <p className="text-6xl font-semibold text-zinc-200">404</p>
      <h1 className="mt-4 text-2xl font-semibold text-zinc-900">
        {t("title")}
      </h1>
      <p className="mt-2 text-sm text-zinc-600">{t("message")}</p>
      <Link
        href="/"
        className="mt-8 inline-flex h-11 items-center justify-center rounded-xl bg-emerald-700 px-5 text-sm font-medium text-white transition hover:bg-emerald-800"
      >
        {t("backHome")}
      </Link>
    </div>
  );
}
