import { getTranslations, setRequestLocale } from "next-intl/server";

import { getAdminCategories } from "@/lib/admin/queries";
import { deleteCategory } from "@/lib/admin/category-actions";
import { CategoryForm } from "@/components/admin/CategoryForm";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin" });
  return { title: t("categories") };
}

export default async function AdminCategoriesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin");
  const categories = await getAdminCategories();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-zinc-900">
        {t("categories")}
      </h1>

      <div className="mt-6 max-w-md rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-zinc-900">
          {t("newCategory")}
        </h2>
        <div className="mt-4">
          <CategoryForm />
        </div>
      </div>

      {categories.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-dashed border-zinc-300 py-10 text-center text-sm text-zinc-500">
          {t("noCategories")}
        </p>
      ) : (
        <ul className="mt-6 divide-y divide-zinc-100 overflow-hidden rounded-2xl border border-zinc-200 bg-white">
          {categories.map((category) => (
            <li
              key={category.id}
              className="flex items-center gap-4 px-4 py-3"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-zinc-900">
                  {category.name}
                </p>
                <p className="text-xs text-zinc-500">/{category.slug}</p>
              </div>
              <span className="shrink-0 text-xs text-zinc-500">
                {category._count.products} {t("products").toLowerCase()}
              </span>
              <form action={deleteCategory}>
                <input type="hidden" name="id" value={category.id} />
                <button
                  type="submit"
                  className="inline-flex h-9 items-center justify-center rounded-lg border border-red-200 px-3 text-xs font-medium text-red-700 transition hover:bg-red-50"
                >
                  {t("delete")}
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
