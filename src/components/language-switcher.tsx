"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { setLocale } from "@/lib/actions/set-locale";
import type { Locale } from "@/i18n/locale";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function switchTo(next: Locale) {
    if (next === locale || pending) return;
    startTransition(async () => {
      await setLocale(next);
      router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-1.5 text-[13px] font-semibold text-[var(--color-muted-2)]">
      <button
        type="button"
        onClick={() => switchTo("sr")}
        aria-current={locale === "sr"}
        className={locale === "sr" ? "text-[var(--color-text)]" : "hover:text-[var(--color-text)]"}
      >
        SR
      </button>
      <span>/</span>
      <button
        type="button"
        onClick={() => switchTo("en")}
        aria-current={locale === "en"}
        className={locale === "en" ? "text-[var(--color-text)]" : "hover:text-[var(--color-text)]"}
      >
        EN
      </button>
    </div>
  );
}
