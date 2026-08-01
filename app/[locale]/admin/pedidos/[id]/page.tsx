import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { getAdminOrder } from "@/lib/admin/queries";
import { formatPrice } from "@/lib/format";
import { OrderStatusBadge } from "@/components/admin/OrderStatusBadge";
import { OrderStatusForm } from "@/components/admin/OrderStatusForm";

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin" });
  return { title: t("orderDetail") };
}

export default async function AdminOrderDetailPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin");
  const order = await getAdminOrder(id);

  if (!order) {
    notFound();
  }

  return (
    <div>
      <Link
        href="/admin/pedidos"
        className="text-sm font-medium text-emerald-700 hover:underline"
      >
        ← {t("back")}
      </Link>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-zinc-900">
          {t("orderDetail")}
        </h1>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <section className="rounded-2xl border border-zinc-200 bg-white p-5 lg:col-span-2">
          <h2 className="text-sm font-semibold text-zinc-900">
            {t("items")}
          </h2>
          <ul className="mt-4 divide-y divide-zinc-100">
            {order.order_items.map((item) => (
              <li key={item.id} className="py-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-zinc-900">
                      {item.name}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {t("quantity")} {item.quantity} ·{" "}
                      {formatPrice(item.unit_price_cents)} / ud.
                      {item.external_sku ? ` · ${item.external_sku}` : ""}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <span className="text-sm font-semibold text-zinc-900">
                      {formatPrice(item.unit_price_cents * item.quantity)}
                    </span>
                    {item.external_product_url ? (
                      <a
                        href={item.external_product_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-medium text-emerald-700 hover:underline"
                      >
                        {t("openInHerbalife")} ↗
                      </a>
                    ) : (
                      <span className="text-xs text-zinc-400">
                        {t("noExternalUrl")}
                      </span>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-2 flex items-center justify-between border-t border-zinc-100 pt-4">
            <p className="text-sm font-medium text-zinc-600">{t("total")}</p>
            <p className="text-lg font-bold text-zinc-900">
              {formatPrice(order.total_cents)}
            </p>
          </div>
        </section>

        <div className="flex flex-col gap-6">
          <section className="rounded-2xl border border-zinc-200 bg-white p-5">
            <h2 className="text-sm font-semibold text-zinc-900">
              {t("customer")}
            </h2>
            <dl className="mt-3 flex flex-col gap-2 text-sm">
              <div>
                <dt className="text-xs text-zinc-500">{t("email")}</dt>
                <dd className="text-zinc-900">{order.customer_email}</dd>
              </div>
              {order.customer_phone ? (
                <div>
                  <dt className="text-xs text-zinc-500">{t("phone")}</dt>
                  <dd className="text-zinc-900">{order.customer_phone}</dd>
                </div>
              ) : null}
              {order.shipping_address ? (
                <div>
                  <dt className="text-xs text-zinc-500">{t("address")}</dt>
                  <dd className="text-zinc-900">{order.shipping_address}</dd>
                </div>
              ) : null}
              <div>
                <dt className="text-xs text-zinc-500">{t("createdAt")}</dt>
                <dd className="text-zinc-900">
                  {order.created_at.toLocaleString("es-ES")}
                </dd>
              </div>
            </dl>
          </section>

          <section className="rounded-2xl border border-zinc-200 bg-white p-5">
            <h2 className="text-sm font-semibold text-zinc-900">
              {t("status")}
            </h2>
            <div className="mt-3">
              <OrderStatusForm orderId={order.id} />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
