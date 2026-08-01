"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/admin/slug";
import { uploadImage } from "@/lib/admin/storage";

export type BlogFormState = { error?: string } | undefined;

function getFile(formData: FormData): File | null {
  const file = formData.get("image");
  return file instanceof File && file.size > 0 ? file : null;
}

async function ensureUniqueSlug(slug: string, excludeId?: string): Promise<string> {
  let candidate = slug || "entrada";
  let index = 2;
  while (true) {
    const existing = await prisma.blog_posts.findFirst({
      where: { slug: candidate, ...(excludeId ? { id: { not: excludeId } } : {}) },
    });
    if (!existing) {
      return candidate;
    }
    candidate = `${slug}-${index++}`;
  }
}

export async function createPost(
  _prev: BlogFormState,
  formData: FormData,
): Promise<BlogFormState> {
  await requireAdmin();

  const title = String(formData.get("title") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim() || null;
  const content = String(formData.get("content") ?? "").trim();
  const published = formData.get("published") === "on";
  const file = getFile(formData);

  if (!title) {
    return { error: "El título es obligatorio." };
  }

  let imageUrl: string | null = null;
  if (file) {
    imageUrl = await uploadImage(file, "blog");
  }

  const slug = await ensureUniqueSlug(slugInput || slugify(title));

  await prisma.blog_posts.create({
    data: {
      title,
      slug,
      excerpt,
      content,
      image_url: imageUrl,
      published,
      published_at: published ? new Date() : null,
    },
  });

  revalidatePath("/", "layout");
  revalidatePath("/admin/blog");
  redirect("/admin/blog");
}

export async function updatePost(
  id: string,
  _prev: BlogFormState,
  formData: FormData,
): Promise<BlogFormState> {
  await requireAdmin();

  const existing = await prisma.blog_posts.findUnique({ where: { id } });
  if (!existing) {
    return { error: "Entrada no encontrada." };
  }

  const title = String(formData.get("title") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim() || null;
  const content = String(formData.get("content") ?? "").trim();
  const published = formData.get("published") === "on";
  const file = getFile(formData);

  if (!title) {
    return { error: "El título es obligatorio." };
  }

  let imageUrl = existing.image_url;
  if (file) {
    imageUrl = await uploadImage(file, "blog");
  }

  const slug = await ensureUniqueSlug(slugInput || slugify(title), id);

  await prisma.blog_posts.update({
    where: { id },
    data: {
      title,
      slug,
      excerpt,
      content,
      image_url: imageUrl,
      published,
      published_at: published ? existing.published_at ?? new Date() : null,
    },
  });

  revalidatePath("/", "layout");
  revalidatePath("/admin/blog");
  redirect("/admin/blog");
}

export async function deletePost(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  await prisma.blog_posts.delete({ where: { id } }).catch(() => {});
  revalidatePath("/", "layout");
  revalidatePath("/admin/blog");
}
