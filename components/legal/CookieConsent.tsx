"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const STORAGE_KEY = "cookie-consent";

export function CookieConsent() {
  const t = useTranslations("cookiesBanner");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => {
      if (!localStorage.getItem(STORAGE_KEY)) {
        setVisible(true);
      }
    }, 0);
    return () => clearTimeout(id);
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  };

  if (!visible) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-label={t("title")}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-zinc-200 bg-white p-4 shadow-lg"
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-relaxed text-zinc-600">{t("message")}</p>
        <div className="flex shrink-0 items-center gap-4">
          <Link
            href="/cookies"
            className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
          >
            {t("moreInfo")}
          </Link>
          <button
            onClick={accept}
            className="rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-800"
          >
            {t("accept")}
          </button>
        </div>
      </div>
    </div>
  );
}
