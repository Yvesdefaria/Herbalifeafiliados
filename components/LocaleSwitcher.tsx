"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, getPathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

export function LocaleSwitcher() {
  const t = useTranslations("locale");
  const locale = useLocale();
  const pathname = usePathname();

  function onChange(next: string) {
    if (next === locale) {
      return;
    }
    const nextPath = getPathname({
      locale: next as Locale,
      href: pathname,
    });
    const search =
      typeof window !== "undefined" ? window.location.search : "";
    window.location.assign(`${nextPath}${search}`);
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
