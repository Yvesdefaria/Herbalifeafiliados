import "server-only";

import { prisma } from "@/lib/db";
import type { order_status } from "@/lib/generated/prisma/enums";

export const ORDER_STATUSES: order_status[] = [
  "new",
  "paid",
  "processing",
  "shipped",
  "cancelled",
];

export function isOrderStatus(value: string): value is order_status {
  return (ORDER_STATUSES as string[]).includes(value);
}

export async function getAdminProducts() {
  return prisma.products.findMany({
    orderBy: { created_at: "desc" },
    include: { categories: { select: { id: true, name: true, slug: true } } },
  });
}

export async function getAdminProduct(id: string) {
  return prisma.products.findUnique({
    where: { id },
    include: { categories: { select: { id: true, name: true, slug: true } } },
  });
}

export async function getAdminCategories() {
  return prisma.categories.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });
}

export async function getAdminOrders(status?: string) {
  const where = status && isOrderStatus(status) ? { status } : undefined;
  return prisma.orders.findMany({
    where,
    orderBy: { created_at: "desc" },
    include: { order_items: true },
  });
}

export async function getAdminOrder(id: string) {
  return prisma.orders.findUnique({
    where: { id },
    include: { order_items: true },
  });
}

export async function getAdminBlogPosts() {
  return prisma.blog_posts.findMany({ orderBy: { created_at: "desc" } });
}

export async function getAdminBlogPost(id: string) {
  return prisma.blog_posts.findUnique({ where: { id } });
}

export async function getAdminDashboard() {
  const [totalOrders, newOrders, totalProducts, totalCategories, draftPosts, recentOrders] =
    await Promise.all([
      prisma.orders.count(),
      prisma.orders.count({ where: { status: "new" } }),
      prisma.products.count(),
      prisma.categories.count(),
      prisma.blog_posts.count({ where: { published: false } }),
      prisma.orders.findMany({
        orderBy: { created_at: "desc" },
        take: 5,
        include: { order_items: true },
      }),
    ]);

  return {
    totalOrders,
    newOrders,
    totalProducts,
    totalCategories,
    draftPosts,
    recentOrders,
  };
}
