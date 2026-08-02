"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export function LocaleSwitcher() {
  const t = useTranslations("locale");
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1" aria-label={t("label")}>
      {routing.locales.map((code) => {
        const active = code === locale;
        const href = pathname === "/" ? `/${code}` : `/${code}${pathname}`;
        return (
          <a
            key={code}
            href={href}
            hrefLang={code}
            className={`inline-flex h-8 items-center rounded-lg px-1.5 text-[11px] font-medium transition sm:h-9 sm:px-2 sm:text-xs ${
              active
                ? "bg-emerald-700 text-white"
                : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
            }`}
            aria-current={active ? "true" : undefined}
          >
            {code.toUpperCase()}
          </a>
        );
      })}
    </nav>
  );
}
