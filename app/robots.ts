import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

const PRIVATE_PATH_PREFIXES = ["admin", "api", "mi-cuenta", "carrito", "checkout", "pago", "login", "registro"];

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

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
