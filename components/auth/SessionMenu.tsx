import { getTranslations } from "next-intl/server";
import { getSessionUser } from "@/lib/auth/session";
import { logout } from "@/lib/auth/actions";
import { Link } from "@/i18n/navigation";

export async function SessionMenu() {
  const t = await getTranslations("nav");
  const user = await getSessionUser();

  if (!user) {
    return (
      <Link
        href="/login"
        className="inline-flex h-9 items-center rounded-lg border border-emerald-700 px-2.5 text-sm font-medium text-emerald-800 transition hover:bg-emerald-50 sm:h-10 sm:px-3"
      >
        {t("login")}
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <Link
        href={user.role === "admin" ? "/admin" : "/mi-cuenta"}
        className="inline-flex h-9 max-w-28 items-center truncate rounded-lg bg-emerald-50 px-2.5 text-sm font-medium text-emerald-800 transition hover:bg-emerald-100 sm:h-10 sm:max-w-none sm:px-3"
      >
        {user.name ?? user.email}
      </Link>
      <form action={logout}>
        <button
          type="submit"
          className="inline-flex h-9 items-center rounded-lg px-2 text-sm font-medium text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-800 sm:h-10"
        >
          {t("logout")}
        </button>
      </form>
    </div>
  );
}
