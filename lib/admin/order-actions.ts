"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { isOrderStatus } from "@/lib/admin/queries";

export type OrderStatusState = { error?: string } | undefined;

export async function updateOrderStatus(
  _prev: OrderStatusState,
  formData: FormData,
): Promise<OrderStatusState> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!isOrderStatus(status)) {
    return { error: "Estado no válido." };
  }

  await prisma.orders.update({ where: { id }, data: { status } });

  revalidatePath("/admin/pedidos", "layout");
  revalidatePath("/admin", "layout");
}
