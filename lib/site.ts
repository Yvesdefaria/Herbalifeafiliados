import type { Metadata } from "next";

export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export const localePaths: Record<string, string> = {
  es: "/es",
  en: "/en",
  pt: "/pt",
};

export function localizedAlternates(
  locale: string,
  restPath: string,
): Metadata["alternates"] {
  const base = `${getSiteUrl()}/${locale}`;
  const suffix = restPath ? `/${restPath}` : "";
  return {
    canonical: `${base}${suffix}`,
    languages: {
      ...Object.fromEntries(
        Object.entries(localePaths).map(([lang, prefix]) => [
          lang,
          `${getSiteUrl()}${prefix}${suffix}`,
        ]),
      ),
      "x-default": `${getSiteUrl()}/es${suffix}`,
    },
  };
}
