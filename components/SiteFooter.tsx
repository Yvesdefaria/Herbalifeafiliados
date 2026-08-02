import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function SiteFooter() {
  const t = await getTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-zinc-200 bg-zinc-50">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-8 text-sm text-zinc-600 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          © {year} Herbalife Afiliado. {t("rights")}
        </p>
        <div className="flex flex-wrap gap-4">
          <Link href="/legal" className="transition hover:text-zinc-900">
            {t("legal")}
          </Link>
          <Link href="/privacidad" className="transition hover:text-zinc-900">
            {t("privacy")}
          </Link>
          <Link href="/cookies" className="transition hover:text-zinc-900">
            {t("cookies")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
