import { getTranslations, setRequestLocale } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { getAdminProducts } from "@/lib/admin/queries";
import { deleteProduct } from "@/lib/admin/product-actions";
import { formatPrice } from "@/lib/format";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin" });
  return { title: t("products") };
}

export default async function AdminProductsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin");
  const products = await getAdminProducts();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-zinc-900">
          {t("products")}
        </h1>
        <Link
          href="/admin/productos/nuevo"
          className="inline-flex h-11 items-center justify-center rounded-xl bg-emerald-700 px-4 text-sm font-medium text-white transition hover:bg-emerald-800"
        >
          {t("newProduct")}
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-dashed border-zinc-300 py-10 text-center text-sm text-zinc-500">
          {t("noProducts")}
        </p>
      ) : (
        <ul className="mt-6 divide-y divide-zinc-100 overflow-hidden rounded-2xl border border-zinc-200 bg-white">
          {products.map((product) => (
            <li
              key={product.id}
              className="flex items-center gap-4 px-4 py-3"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-zinc-900">
                  {product.name}
                </p>
                <p className="text-xs text-zinc-500">
                  {product.categories?.name ?? t("noCategory")} ·{" "}
                  {formatPrice(product.price_cents)}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {!product.is_active ? (
                  <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700">
                    {t("draft")}
                  </span>
                ) : null}
                <Link
                  href={`/admin/productos/${product.id}`}
                  className="inline-flex h-9 items-center justify-center rounded-lg border border-zinc-300 px-3 text-xs font-medium text-zinc-700 transition hover:bg-zinc-100"
                >
                  {t("edit")}
                </Link>
                <form action={deleteProduct}>
                  <input type="hidden" name="id" value={product.id} />
                  <button
                    type="submit"
                    className="inline-flex h-9 items-center justify-center rounded-lg border border-red-200 px-3 text-xs font-medium text-red-700 transition hover:bg-red-50"
                  >
                    {t("delete")}
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
