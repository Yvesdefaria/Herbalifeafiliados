import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

type LegalSection = {
  heading: string;
  body: string;
};

type Props = {
  namespace: string;
};

export async function LegalPage({ namespace }: Props) {
  const t = await getTranslations(namespace);
  const tShared = await getTranslations("legalPages");
  const sections = t.raw("sections") as LegalSection[];

  return (
    <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6">
      <Link
        href="/"
        className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
      >
        ← {tShared("backToHome")}
      </Link>

      <h1 className="mt-3 text-2xl font-semibold text-zinc-900">{t("title")}</h1>
      <p className="mt-1 text-xs text-zinc-500">{t("updated")}</p>

      <div className="mt-6 flex flex-col gap-6">
        {sections.map((section, index) => (
          <section key={index}>
            <h2 className="text-lg font-semibold text-zinc-900">
              {section.heading}
            </h2>
            <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-zinc-600">
              {section.body}
            </p>
          </section>
        ))}
      </div>
    </div>
  );
}
