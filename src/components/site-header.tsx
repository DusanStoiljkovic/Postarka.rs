"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useCart } from "@/lib/cart-context";
import { LanguageSwitcher } from "@/components/language-switcher";

export function SiteHeader() {
  const pathname = usePathname();
  const { totalCount } = useCart();
  const t = useTranslations("Nav");
  const [menuOpen, setMenuOpen] = useState(false);
  const [lastPathname, setLastPathname] = useState(pathname);

  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setMenuOpen(false);
  }

  const NAV = [
    { href: "/katalog", label: t("postcards") },
    { href: "/#paketi", label: t("packages") },
    { href: "/o-meni", label: t("about") },
    { href: "/dnevnik", label: t("blog") },
    { href: "/kontakt", label: t("contact") },
  ];

  return (
    <header className="relative border-b border-[var(--color-border)]">
      <div className="flex items-center justify-between px-6 py-5 sm:px-10">
        <Link href="/" className="font-display text-2xl text-[var(--color-accent)]">
          Poštarka
        </Link>
        <nav className="hidden items-center gap-8 text-[15px] font-medium md:flex">
          {NAV.map((item) => {
            const active =
              item.href !== "/#paketi" &&
              (pathname === item.href || pathname.startsWith(item.href + "/"));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  active
                    ? "border-b-2 border-[var(--color-accent)] pb-[3px] text-[var(--color-accent)]"
                    : "hover:text-[var(--color-accent)]"
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <LanguageSwitcher />
          </div>
          <Link
            href="/korpa"
            className="flex h-10 items-center rounded-full bg-[var(--color-dark)] px-4.5 text-sm font-semibold text-[var(--color-bg)]"
          >
            {t("cart")} · {totalCount}
          </Link>
          <button
            type="button"
            aria-label={menuOpen ? t("closeMenu") : t("openMenu")}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
            className="flex h-10 w-10 items-center justify-center rounded-full border-[1.5px] border-[var(--color-border-2)] md:hidden"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {menuOpen ? (
                <>
                  <line x1="5" y1="5" x2="19" y2="19" />
                  <line x1="19" y1="5" x2="5" y2="19" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="absolute inset-x-0 top-full z-40 flex flex-col gap-1 border-b border-[var(--color-border)] bg-[var(--color-bg)] px-6 py-4 text-base font-medium shadow-[0_16px_28px_rgba(46,31,38,0.12)] md:hidden">
          {NAV.map((item) => {
            const active =
              item.href !== "/#paketi" &&
              (pathname === item.href || pathname.startsWith(item.href + "/"));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-xl px-3 py-3 ${
                  active ? "bg-[var(--color-accent-200)] text-[var(--color-accent-700)]" : "hover:bg-[var(--color-card-alt-2)]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <div className="mt-2 px-3 py-2">
            <LanguageSwitcher />
          </div>
        </nav>
      )}
    </header>
  );
}
