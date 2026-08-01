import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { getAdminCategories, getAdminProduct } from "@/lib/admin/queries";
import { updateProduct } from "@/lib/admin/product-actions";
import { ProductForm } from "@/components/admin/ProductForm";

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin" });
  return { title: t("editProduct") };
}

export default async function EditProductPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin");
  const [product, categories] = await Promise.all([
    getAdminProduct(id),
    getAdminCategories(),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-semibold text-zinc-900">
        {t("editProduct")}
      </h1>
      <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-5">
        <ProductForm
          action={updateProduct.bind(null, product.id)}
          categories={categories.map((c) => ({ id: c.id, name: c.name }))}
          initial={{
            id: product.id,
            name: product.name,
            slug: product.slug,
            description: product.description,
            price_cents: product.price_cents,
            category_id: product.category_id,
            external_product_url: product.external_product_url,
            external_sku: product.external_sku,
            is_available: product.is_available,
            availability_note: product.availability_note,
            is_active: product.is_active,
            image_url: product.image_url,
          }}
        />
      </div>
    </div>
  );
}
