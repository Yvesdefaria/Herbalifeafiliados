"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

const links = [
  { href: "/admin", key: "dashboard" as const, exact: true },
  { href: "/admin/productos", key: "products" as const, exact: false },
  { href: "/admin/pedidos", key: "orders" as const, exact: false },
  { href: "/admin/blog", key: "blog" as const, exact: false },
];

export function AdminNav() {
  const t = useTranslations("admin");
  const pathname = usePathname();

  return (
    <nav className="flex gap-2 overflow-x-auto" aria-label="Admin">
      {links.map((link) => {
        const active = link.exact
          ? pathname === link.href
          : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`shrink-0 rounded-full px-3 py-2 text-sm font-medium ${
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
  );
}
