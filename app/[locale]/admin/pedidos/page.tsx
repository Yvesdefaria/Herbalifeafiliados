import { getTranslations, setRequestLocale } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { getAdminOrders, ORDER_STATUSES } from "@/lib/admin/queries";
import { formatPrice } from "@/lib/format";
import { OrderStatusBadge } from "@/components/admin/OrderStatusBadge";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ status?: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin" });
  return { title: t("orders") };
}

export default async function AdminOrdersPage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin");
  const { status } = await searchParams;
  const orders = await getAdminOrders(status);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-zinc-900">{t("orders")}</h1>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        <Link
          href="/admin/pedidos"
          className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-medium ${
            !status ? "bg-emerald-700 text-white" : "bg-zinc-100 text-zinc-700"
          }`}
        >
          {t("allStatuses")}
        </Link>
        {ORDER_STATUSES.map((value) => (
          <Link
            key={value}
            href={`/admin/pedidos?status=${value}`}
            className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-medium ${
              status === value
                ? "bg-emerald-700 text-white"
                : "bg-zinc-100 text-zinc-700"
            }`}
          >
            {t(`status${value[0].toUpperCase()}${value.slice(1)}`)}
          </Link>
        ))}
      </div>

      {orders.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-dashed border-zinc-300 py-10 text-center text-sm text-zinc-500">
          {t("noOrders")}
        </p>
      ) : (
        <ul className="mt-6 divide-y divide-zinc-100 overflow-hidden rounded-2xl border border-zinc-200 bg-white">
          {orders.map((order) => (
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
                    {order.customer_email} ·{" "}
                    {order.created_at.toLocaleString("es-ES")}
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
    </div>
  );
}
