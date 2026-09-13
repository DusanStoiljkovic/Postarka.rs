export function localizedField(
  locale: string,
  sr: string,
  en: string | null | undefined,
): string {
  return locale === "en" && en ? en : sr;
}
