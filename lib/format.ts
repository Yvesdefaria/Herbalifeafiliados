export function formatPrice(
  cents: number,
  currency = "EUR",
  locale = "es-ES",
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(cents / 100);
}
