import { getTranslations, setRequestLocale } from "next-intl/server";

import { createPost } from "@/lib/admin/blog-actions";
import { BlogForm } from "@/components/admin/BlogForm";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin" });
  return { title: t("newPost") };
}

export default async function NewPostPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin");

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-semibold text-zinc-900">{t("newPost")}</h1>
      <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-5">
        <BlogForm action={createPost} />
      </div>
    </div>
  );
}
