import { getTranslations, setRequestLocale } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { getAdminDashboard } from "@/lib/admin/queries";
import { formatPrice } from "@/lib/format";
import { OrderStatusBadge } from "@/components/admin/OrderStatusBadge";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin" });
  return { title: t("dashboard") };
}

const statCards = [
  { key: "totalOrders", field: "totalOrders" as const },
  { key: "newOrders", field: "newOrders" as const },
  { key: "totalProducts", field: "totalProducts" as const },
  { key: "totalCategories", field: "totalCategories" as const },
  { key: "draftPosts", field: "draftPosts" as const },
];

export default async function AdminDashboardPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin");
  const stats = await getAdminDashboard();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-zinc-900">{t("dashboard")}</h1>
      <p className="mt-2 text-sm text-zinc-600">{t("dashboardSubtitle")}</p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {statCards.map((card) => (
          <div
            key={card.key}
            className="rounded-2xl border border-zinc-200 bg-white p-4"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              {t(card.key)}
            </p>
            <p className="mt-1 text-2xl font-bold text-zinc-900">
              {stats[card.field]}
            </p>
          </div>
        ))}
      </div>

      <section className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-900">
            {t("recentOrders")}
          </h2>
          <Link
            href="/admin/pedidos"
            className="text-sm font-medium text-emerald-700 hover:underline"
          >
            {t("viewAllOrders")}
          </Link>
        </div>

        {stats.recentOrders.length === 0 ? (
          <p className="mt-4 rounded-2xl border border-dashed border-zinc-300 py-10 text-center text-sm text-zinc-500">
            {t("noOrders")}
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-zinc-100 rounded-2xl border border-zinc-200 bg-white">
            {stats.recentOrders.map((order) => (
              <li key={order.id}>
                <Link
                  href={`/admin/pedidos/${order.id}`}
                  className="flex items-center justify-between gap-3 px-4 py-3 transition hover:bg-zinc-50"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-zinc-900">
                      {order.customer_name}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {order.created_at.toLocaleDateString("es-ES")} ·{" "}
                      {order.order_items.length} art.
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="text-sm font-semibold text-zinc-900">
                      {formatPrice(order.total_cents)}
                    </span>
                    <OrderStatusBadge status={order.status} />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
