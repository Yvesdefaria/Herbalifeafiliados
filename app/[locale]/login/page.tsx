import { getTranslations, setRequestLocale } from "next-intl/server";
import { LoginForm } from "@/components/auth/LoginForm";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ registrado?: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth" });
  return { title: t("login") };
}

export default async function LoginPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { registrado } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations("auth");

  return (
    <div className="mx-auto w-full max-w-sm px-4 py-12 sm:py-16">
      <h1 className="text-2xl font-semibold text-zinc-900">{t("login")}</h1>
      <p className="mt-2 text-sm text-zinc-600">{t("welcomeBack")}</p>

      {registrado ? (
        <p className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          {t("registeredOk")}
        </p>
      ) : null}

      <div className="mt-8">
        <LoginForm />
      </div>
    </div>
  );
}
