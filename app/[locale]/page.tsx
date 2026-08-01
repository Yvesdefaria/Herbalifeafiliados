import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");

  return (
    <div className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-4 py-12 sm:max-w-2xl sm:px-6">
      <p className="mb-3 inline-flex w-fit rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800">
        {t("badge")}
      </p>
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
        {t("title")}
      </h1>
      <p className="mt-4 text-base leading-relaxed text-zinc-600 sm:text-lg">
        {t("subtitle")}
      </p>
      <p className="mt-2 text-sm text-zinc-500">{t("comingSoon")}</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/productos"
          className="inline-flex h-12 items-center justify-center rounded-xl bg-emerald-700 px-5 text-sm font-medium text-white transition hover:bg-emerald-800"
        >
          {t("ctaProducts")}
        </Link>
        <Link
          href="/blog"
          className="inline-flex h-12 items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50"
        >
          {t("ctaBlog")}
        </Link>
      </div>
    </div>
  );
}
