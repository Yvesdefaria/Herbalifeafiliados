"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/admin/slug";

export type CategoryFormState = { error?: string } | undefined;

export async function createCategory(
  _prev: CategoryFormState,
  formData: FormData,
): Promise<CategoryFormState> {
  await requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  if (!name) {
    return { error: "El nombre es obligatorio." };
  }

  let slug = slugInput || slugify(name);
  let index = 2;
  while (await prisma.categories.findUnique({ where: { slug } })) {
    slug = `${slugInput || slugify(name)}-${index++}`;
  }

  await prisma.categories.create({ data: { name, slug } });

  revalidatePath("/", "layout");
  revalidatePath("/admin/categorias");
}

export async function deleteCategory(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  await prisma.categories.delete({ where: { id } }).catch(() => {});
  revalidatePath("/", "layout");
  revalidatePath("/admin/categorias");
}
