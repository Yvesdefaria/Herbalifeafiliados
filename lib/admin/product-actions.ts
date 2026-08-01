"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/admin/slug";
import { uploadImage } from "@/lib/admin/storage";

export type ProductFormState = { error?: string } | undefined;

function parsePriceToCents(input: string): number | null {
  const normalized = input.trim().replace(",", ".");
  const value = Number(normalized);
  if (!Number.isFinite(value) || value < 0) {
    return null;
  }
  return Math.round(value * 100);
}

function getFile(formData: FormData): File | null {
  const file = formData.get("image");
  return file instanceof File && file.size > 0 ? file : null;
}

async function ensureUniqueSlug(slug: string, excludeId?: string): Promise<string> {
  let candidate = slug || "producto";
  let index = 2;
  while (true) {
    const existing = await prisma.products.findFirst({
      where: { slug: candidate, ...(excludeId ? { id: { not: excludeId } } : {}) },
    });
    if (!existing) {
      return candidate;
    }
    candidate = `${slug}-${index++}`;
  }
}

export async function createProduct(
  _prev: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  await requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;
  const price = parsePriceToCents(String(formData.get("price") ?? ""));
  const categoryId = String(formData.get("category_id") ?? "") || null;
  const externalProductUrl = String(formData.get("external_product_url") ?? "").trim();
  const externalSku = String(formData.get("external_sku") ?? "").trim() || null;
  const availabilityNote = String(formData.get("availability_note") ?? "").trim() || null;
  const isAvailable = formData.get("is_available") === "on";
  const isActive = formData.get("is_active") === "on";
  const file = getFile(formData);

  if (!name) {
    return { error: "El nombre es obligatorio." };
  }
  if (price === null) {
    return { error: "Precio no válido." };
  }
  if (!externalProductUrl) {
    return { error: "La URL del producto en Herbalife es obligatoria." };
  }

  let imageUrl: string | null = null;
  if (file) {
    imageUrl = await uploadImage(file, "products");
  }

  const slug = await ensureUniqueSlug(slugInput || slugify(name));

  await prisma.products.create({
    data: {
      name,
      slug,
      description,
      price_cents: price,
      category_id: categoryId,
      external_product_url: externalProductUrl,
      external_sku: externalSku,
      is_available: isAvailable,
      availability_note: availabilityNote,
      is_active: isActive,
      image_url: imageUrl,
    },
  });

  revalidatePath("/", "layout");
  revalidatePath("/admin/productos");
  redirect("/admin/productos");
}

export async function updateProduct(
  id: string,
  _prev: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  await requireAdmin();

  const existing = await prisma.products.findUnique({ where: { id } });
  if (!existing) {
    return { error: "Producto no encontrado." };
  }

  const name = String(formData.get("name") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;
  const price = parsePriceToCents(String(formData.get("price") ?? ""));
  const categoryId = String(formData.get("category_id") ?? "") || null;
  const externalProductUrl = String(formData.get("external_product_url") ?? "").trim();
  const externalSku = String(formData.get("external_sku") ?? "").trim() || null;
  const availabilityNote = String(formData.get("availability_note") ?? "").trim() || null;
  const isAvailable = formData.get("is_available") === "on";
  const isActive = formData.get("is_active") === "on";
  const file = getFile(formData);

  if (!name) {
    return { error: "El nombre es obligatorio." };
  }
  if (price === null) {
    return { error: "Precio no válido." };
  }
  if (!externalProductUrl) {
    return { error: "La URL del producto en Herbalife es obligatoria." };
  }

  let imageUrl = existing.image_url;
  if (file) {
    imageUrl = await uploadImage(file, "products");
  }

  const slug = await ensureUniqueSlug(slugInput || slugify(name), id);

  await prisma.products.update({
    where: { id },
    data: {
      name,
      slug,
      description,
      price_cents: price,
      category_id: categoryId,
      external_product_url: externalProductUrl,
      external_sku: externalSku,
      is_available: isAvailable,
      availability_note: availabilityNote,
      is_active: isActive,
      image_url: imageUrl,
    },
  });

  revalidatePath("/", "layout");
  revalidatePath("/admin/productos");
  redirect("/admin/productos");
}

export async function deleteProduct(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  await prisma.products.delete({ where: { id } }).catch(() => {});
  revalidatePath("/", "layout");
  revalidatePath("/admin/productos");
}
