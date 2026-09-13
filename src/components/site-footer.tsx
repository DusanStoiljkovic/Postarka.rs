import Link from "next/link";
import { useTranslations } from "next-intl";

export function SiteFooter() {
  const t = useTranslations("Footer");

  return (
    <footer className="mt-16 border-t border-[var(--color-border)]">
      <div className="grid gap-10 px-6 py-12 sm:px-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="flex flex-col gap-3.5">
          <div className="font-display text-2xl text-[var(--color-accent)]">
            Poštarka
          </div>
          <p className="max-w-[300px] text-[15px] text-[var(--color-muted)]">
            {t("newsletterText")}
          </p>
          <form className="flex max-w-[340px] gap-2">
            <input
              type="email"
              placeholder={t("emailPlaceholder")}
              className="h-11.5 flex-1 rounded-full border border-[var(--color-border-2)] bg-white px-5 text-[15px] outline-none placeholder:text-[var(--color-muted-3)]"
            />
            <button
              type="submit"
              className="btn-interactive h-11.5 rounded-full bg-[var(--color-dark)] px-5.5 text-sm font-semibold text-[var(--color-bg)]"
            >
              {t("subscribe")}
            </button>
          </form>
        </div>
        <div className="flex flex-col gap-2.5 text-[15px] text-[var(--color-muted)]">
          <div className="mb-1 font-semibold text-[var(--color-text)]">
            {t("shopHeading")}
          </div>
          <Link href="/katalog">{t("allPostcards")}</Link>
          <Link href="/#paketi">{t("packages")}</Link>
          <Link href="/o-meni#veleprodaja">{t("wholesale")}</Link>
          <Link href="/kontakt">{t("giftCard")}</Link>
        </div>
        <div className="flex flex-col gap-2.5 text-[15px] text-[var(--color-muted)]">
          <div className="mb-1 font-semibold text-[var(--color-text)]">{t("infoHeading")}</div>
          <Link href="/kontakt">{t("shipping")}</Link>
          <Link href="/kontakt">{t("returns")}</Link>
          <Link href="/kontakt">{t("terms")}</Link>
          <Link href="/kontakt">{t("contact")}</Link>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-[var(--color-border)] px-6 py-6 sm:px-10">
        <div className="font-display text-lg text-[var(--color-accent)]">
          Poštarka
        </div>
        <div className="text-sm text-[var(--color-muted-2)]">
          {t("rights")}
        </div>
      </div>
    </footer>
  );
}
