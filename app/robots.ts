import type { MetadataRoute } from "next";

const PRIVATE_PATH_PREFIXES = ["admin", "api", "mi-cuenta", "carrito", "checkout", "pago", "login", "registro"];

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const disallow = PRIVATE_PATH_PREFIXES.flatMap((prefix) => [
    `/${prefix}/`,
    `/es/${prefix}/`,
    `/en/${prefix}/`,
    `/pt/${prefix}/`,
  ]);

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow,
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
