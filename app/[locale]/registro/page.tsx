import { getTranslations, setRequestLocale } from "next-intl/server";
import { SignupForm } from "@/components/auth/SignupForm";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth" });
  return { title: t("signup") };
}

export default async function SignupPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("auth");

  return (
    <div className="mx-auto w-full max-w-sm px-4 py-12 sm:py-16">
      <h1 className="text-2xl font-semibold text-zinc-900">{t("signup")}</h1>
      <p className="mt-2 text-sm text-zinc-600">{t("createAccount")}</p>

      <div className="mt-8">
        <SignupForm />
      </div>
    </div>
  );
}
