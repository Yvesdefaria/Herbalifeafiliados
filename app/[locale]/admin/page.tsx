import { getTranslations, setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin" });
  return { title: t("dashboard") };
}

export default async function AdminDashboardPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin");

  return (
    <div>
      <h1 className="text-2xl font-semibold text-zinc-900">
        {t("dashboard")}
      </h1>
      <p className="mt-2 text-sm text-zinc-600">{t("dashboardSubtitle")}</p>
    </div>
  );
}
