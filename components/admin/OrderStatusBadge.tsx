import { getTranslations } from "next-intl/server";
import type { order_status } from "@/lib/generated/prisma/enums";

const styles: Record<order_status, string> = {
  new: "bg-blue-50 text-blue-700",
  paid: "bg-emerald-50 text-emerald-700",
  processing: "bg-amber-50 text-amber-700",
  shipped: "bg-violet-50 text-violet-700",
  cancelled: "bg-red-50 text-red-700",
};

export async function OrderStatusBadge({ status }: { status: order_status }) {
  const t = await getTranslations("admin");
  const label = t(`status${status[0].toUpperCase()}${status.slice(1)}`);

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${styles[status]}`}
    >
      {label}
    </span>
  );
}
