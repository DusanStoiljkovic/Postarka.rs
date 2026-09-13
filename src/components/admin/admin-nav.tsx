"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { adminLogout } from "@/lib/actions/admin-auth-actions";

const LINKS = [
  { href: "/admin", key: "postcards" as const },
  { href: "/admin/porudzbine", key: "orders" as const },
  { href: "/admin/poruke", key: "messages" as const },
  { href: "/admin/dnevnik", key: "blog" as const },
  { href: "/admin/o-meni", key: "about" as const },
];

export function AdminNav() {
  const pathname = usePathname();
  const t = useTranslations("AdminNav");

  return (
    <nav className="flex items-center gap-7 text-[15px] font-medium text-[#D8C6C0]">
      {LINKS.map((link) => {
        const active =
          link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={
              active
                ? "border-b-2 border-[var(--color-accent)] pb-1 text-[var(--color-bg)]"
                : "hover:text-[var(--color-bg)]"
            }
          >
            {t(link.key)}
          </Link>
        );
      })}
      <span className="cursor-default opacity-50">{t("packages")}</span>
      <form action={adminLogout}>
        <button type="submit" className="hover:text-[var(--color-bg)]">
          {t("logout")}
        </button>
      </form>
    </nav>
  );
}
