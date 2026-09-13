import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function NotFound() {
  const t = await getTranslations("NotFound");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[var(--color-bg)] px-6 text-center text-[var(--color-text)]">
      <div className="font-display text-7xl text-[var(--color-accent)]">404</div>
      <h1 className="font-display text-3xl sm:text-4xl">{t("title")}</h1>
      <p className="max-w-[420px] text-[17px] leading-relaxed text-[var(--color-muted)]">
        {t("text")}
      </p>
      <Link
        href="/katalog"
        className="btn-interactive flex h-13 items-center rounded-full bg-[var(--color-accent)] px-7.5 text-base font-semibold text-white"
      >
        {t("cta")}
      </Link>
    </div>
  );
}
