export function formatDate(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "sr-Latn-RS", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}
