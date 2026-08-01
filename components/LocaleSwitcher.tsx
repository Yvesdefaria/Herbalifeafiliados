"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

export function LocaleSwitcher() {
  const t = useTranslations("locale");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  function onChange(next: string) {
    router.replace(pathname, { locale: next as Locale });
  }

  return (
    <label className="flex items-center gap-1.5 text-xs text-zinc-600">
      <span className="sr-only">{t("label")}</span>
      <select
        className="h-10 rounded-lg border border-zinc-200 bg-white px-2 text-sm text-zinc-800"
        value={locale}
        onChange={(e) => onChange(e.target.value)}
        aria-label={t("label")}
      >
        {routing.locales.map((code) => (
          <option key={code} value={code}>
            {t(code)}
          </option>
        ))}
      </select>
    </label>
  );
}
