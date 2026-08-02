import "server-only";

import { createClient } from "@/lib/supabase/server";

export type BlogPostSummary = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  imageUrl: string | null;
  publishedAt: string | null;
};

export type BlogPost = BlogPostSummary & {
  content: string;
};

type PostRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  image_url: string | null;
  published_at: string | null;
};

function mapPost(row: PostRow): BlogPost {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    imageUrl: row.image_url,
    publishedAt: row.published_at,
  };
}

function mapSummary(row: Partial<PostRow>): BlogPostSummary {
  return {
    id: row.id as string,
    slug: row.slug as string,
    title: row.title as string,
    excerpt: row.excerpt ?? null,
    imageUrl: row.image_url ?? null,
    publishedAt: row.published_at ?? null,
  };
}

export async function getPublishedPosts(limit?: number): Promise<BlogPostSummary[]> {
  const supabase = await createClient();

  let query = supabase
    .from("blog_posts")
    .select("id, slug, title, excerpt, image_url, published_at")
    .eq("published", true)
    .order("published_at", { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error("getPublishedPosts:", error.message);
    return [];
  }

  return (data as Partial<PostRow>[]).map(mapSummary);
}

export async function getPublishedPostBySlug(slug: string): Promise<BlogPost | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error) {
    console.error("getPublishedPostBySlug:", error.message);
    return null;
  }

  return data ? mapPost(data as PostRow) : null;
}

export async function getLatestPosts(limit = 3): Promise<BlogPostSummary[]> {
  return getPublishedPosts(limit);
}
