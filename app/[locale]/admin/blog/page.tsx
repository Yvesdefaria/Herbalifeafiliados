import { getTranslations, setRequestLocale } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { getAdminBlogPosts } from "@/lib/admin/queries";
import { deletePost } from "@/lib/admin/blog-actions";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin" });
  return { title: t("blog") };
}

export default async function AdminBlogPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin");
  const posts = await getAdminBlogPosts();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-zinc-900">{t("blog")}</h1>
        <Link
          href="/admin/blog/nuevo"
          className="inline-flex h-11 items-center justify-center rounded-xl bg-emerald-700 px-4 text-sm font-medium text-white transition hover:bg-emerald-800"
        >
          {t("newPost")}
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-dashed border-zinc-300 py-10 text-center text-sm text-zinc-500">
          {t("noPosts")}
        </p>
      ) : (
        <ul className="mt-6 divide-y divide-zinc-100 overflow-hidden rounded-2xl border border-zinc-200 bg-white">
          {posts.map((post) => (
            <li key={post.id} className="flex items-center gap-4 px-4 py-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-zinc-900">
                  {post.title}
                </p>
                <p className="text-xs text-zinc-500">
                  {post.created_at.toLocaleDateString("es-ES")}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {post.published ? (
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                    {t("published")}
                  </span>
                ) : (
                  <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600">
                    {t("draft")}
                  </span>
                )}
                <Link
                  href={`/admin/blog/${post.id}`}
                  className="inline-flex h-9 items-center justify-center rounded-lg border border-zinc-300 px-3 text-xs font-medium text-zinc-700 transition hover:bg-zinc-100"
                >
                  {t("edit")}
                </Link>
                <form action={deletePost}>
                  <input type="hidden" name="id" value={post.id} />
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
