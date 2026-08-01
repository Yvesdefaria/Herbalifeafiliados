"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { updateOrderStatus } from "@/lib/admin/order-actions";
import type { order_status } from "@/lib/generated/prisma/enums";

export function OrderStatusForm({ orderId }: { orderId: string }) {
  const t = useTranslations("admin");
  const [state, action, pending] = useActionState(updateOrderStatus, undefined);
  const statuses: order_status[] = [
    "new",
    "paid",
    "processing",
    "shipped",
    "cancelled",
  ];

  return (
    <form action={action} className="flex flex-col gap-3">
      {state?.error ? (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}
      <input type="hidden" name="id" value={orderId} />
      <div className="flex items-center gap-2">
        <select
          name="status"
          defaultValue=""
          required
          className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm text-zinc-900 focus:border-emerald-600 focus:outline-none"
        >
          <option value="" disabled>
            {t("status")}
          </option>
          {statuses.map((status) => (
            <option key={status} value={status}>
              {t(`status${status[0].toUpperCase()}${status.slice(1)}`)}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-11 shrink-0 items-center justify-center rounded-xl bg-emerald-700 px-5 text-sm font-medium text-white transition hover:bg-emerald-800 disabled:opacity-60"
        >
          {pending ? t("saving") : t("save")}
        </button>
      </div>
    </form>
  );
}
