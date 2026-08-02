import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/catalog/queries";
import { getPublishedPosts } from "@/lib/blog/queries";
import { getSiteUrl } from "@/lib/site";

const LOCALES = ["es", "en", "pt"] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();

  const [products, posts] = await Promise.all([getProducts(), getPublishedPosts()]);

  const languages = (path: string) =>
    LOCALES.reduce<Record<string, string>>(
      (acc, locale) => {
        acc[locale] = `${siteUrl}/${locale}${path}`;
        return acc;
      },
      { "x-default": `${siteUrl}/es${path}` },
    );

  const entries: MetadataRoute.Sitemap = [];

  const staticPaths = [
    { path: "", changeFrequency: "daily", priority: 1 },
    { path: "/productos", changeFrequency: "weekly", priority: 0.8 },
    { path: "/blog", changeFrequency: "weekly", priority: 0.8 },
  ] as const;

  for (const { path, changeFrequency, priority } of staticPaths) {
    entries.push({
      url: `${siteUrl}/es${path}`,
      lastModified: new Date(),
      changeFrequency,
      priority,
      alternates: { languages: languages(path) },
    });
  }

  for (const product of products) {
    const path = `/producto/${product.slug}`;
    entries.push({
      url: `${siteUrl}/es${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
      alternates: { languages: languages(path) },
    });
  }

  for (const post of posts) {
    const path = `/blog/${post.slug}`;
    entries.push({
      url: `${siteUrl}/es${path}`,
      lastModified: post.publishedAt ? new Date(post.publishedAt) : undefined,
      changeFrequency: "monthly",
      priority: 0.6,
      alternates: { languages: languages(path) },
    });
  }

  return entries;
}
