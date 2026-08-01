import { getTranslations, setRequestLocale } from "next-intl/server";

import { getAdminCategories } from "@/lib/admin/queries";
import { createProduct } from "@/lib/admin/product-actions";
import { ProductForm } from "@/components/admin/ProductForm";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin" });
  return { title: t("newProduct") };
}

export default async function NewProductPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin");
  const categories = await getAdminCategories();

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-semibold text-zinc-900">
        {t("newProduct")}
      </h1>
      <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-5">
        <ProductForm
          action={createProduct}
          categories={categories.map((c) => ({ id: c.id, name: c.name }))}
        />
      </div>
    </div>
  );
}
