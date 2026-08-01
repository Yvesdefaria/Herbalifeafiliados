import { getTranslations, setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  return { title: t("cart") };
}

export default async function CartPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("nav");
  const th = await getTranslations("home");

  return (
    <div className="mx-auto w-full max-w-lg px-4 py-10 sm:max-w-2xl sm:px-6">
      <h1 className="text-2xl font-semibold text-zinc-900">{t("cart")}</h1>
      <p className="mt-3 text-zinc-600">{th("comingSoon")}</p>
    </div>
  );
}
