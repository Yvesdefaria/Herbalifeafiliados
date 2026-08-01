import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { getAdminBlogPost } from "@/lib/admin/queries";
import { updatePost } from "@/lib/admin/blog-actions";
import { BlogForm } from "@/components/admin/BlogForm";

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin" });
  return { title: t("editPost") };
}

export default async function EditPostPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin");
  const post = await getAdminBlogPost(id);

  if (!post) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-semibold text-zinc-900">{t("editPost")}</h1>
      <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-5">
        <BlogForm
          action={updatePost.bind(null, post.id)}
          initial={{
            id: post.id,
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt,
            content: post.content,
            image_url: post.image_url,
            published: post.published,
          }}
        />
      </div>
    </div>
  );
}
