"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { CartButton } from "@/components/cart/CartButton";

const links = [
  { href: "/", key: "home" as const },
  { href: "/productos", key: "products" as const },
  { href: "/blog", key: "blog" as const },
];

type Props = {
  sessionMenu: ReactNode;
};

export function SiteHeader({ sessionMenu }: Props) {
  const t = useTranslations("nav");
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-3 px-4 sm:h-16 sm:px-6">
        <Link
          href="/"
          className="shrink-0 text-sm font-semibold tracking-tight text-emerald-800 sm:text-base"
        >
          Herbalife Afiliado
        </Link>
        <nav className="hidden items-center gap-1 md:flex" aria-label={t("mainNav")}>
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-emerald-50 text-emerald-900"
                    : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                }`}
              >
                {t(link.key)}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <LocaleSwitcher />
          <div className="md:hidden">
            <CartButton />
          </div>
          <div className="hidden items-center gap-2 md:flex">
            <CartButton />
            {sessionMenu}
          </div>
        </div>
      </div>
      <nav
        className="flex gap-1 overflow-x-auto border-t border-zinc-100 px-2 py-2 md:hidden"
        aria-label={t("mobileNav")}
      >
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium ${
                active
                  ? "bg-emerald-700 text-white"
                  : "bg-zinc-100 text-zinc-700"
              }`}
            >
              {t(link.key)}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
