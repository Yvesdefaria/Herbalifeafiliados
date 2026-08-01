import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Category, Product } from "./types";

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price_cents: number;
  currency: string;
  image_url: string | null;
  category_id: string | null;
  external_product_url: string | null;
  external_sku: string | null;
  is_available: boolean;
  availability_note: string | null;
  is_active: boolean;
  categories: {
    id: string;
    name: string;
    slug: string;
  } | null;
};

function mapProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    priceCents: row.price_cents,
    currency: row.currency,
    imageUrl: row.image_url,
    categoryId: row.category_id,
    externalProductUrl: row.external_product_url,
    externalSku: row.external_sku,
    isAvailable: row.is_available,
    availabilityNote: row.availability_note,
    isActive: row.is_active,
    category: row.categories,
  };
}

export type GetProductsParams = {
  categorySlug?: string;
  search?: string;
  limit?: number;
};

export async function getProducts({
  categorySlug,
  search,
  limit,
}: GetProductsParams = {}): Promise<Product[]> {
  const supabase = await createClient();

  let query = supabase
    .from("products")
    .select("*, categories(id, name, slug)")
    .eq("is_active", true)
    .order("name");

  if (categorySlug) {
    query = query.eq("categories.slug", categorySlug);
  }

  if (search) {
    query = query.ilike("name", `%${search}%`);
  }

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error("getProducts:", error.message);
    return [];
  }

  return (data as ProductRow[]).map(mapProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select("*, categories(id, name, slug)")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    console.error("getProductBySlug:", error.message);
    return null;
  }

  return data ? mapProduct(data as ProductRow) : null;
}

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug")
    .order("name");

  if (error) {
    console.error("getCategories:", error.message);
    return [];
  }

  return data as Category[];
}

export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  return getProducts({ limit });
}
