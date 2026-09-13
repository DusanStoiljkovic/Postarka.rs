import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { CatalogClient } from "./catalog-client";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Metadata");
  return { title: t("catalogTitle"), description: t("catalogDescription") };
}

export default async function KatalogPage() {
  const t = await getTranslations("Catalog");
  const products = await prisma.product.findMany({
    where: { status: { not: "skriveno" } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-11 pb-16">
      <div className="flex flex-col gap-2.5 px-6 pt-13 sm:px-10">
        <div className="text-xs font-medium tracking-[0.12em] text-[var(--color-muted-2)] uppercase">
          {t("eyebrow", { count: products.length })}
        </div>
        <h1 className="font-display text-[40px] sm:text-[48px]">{t("title")}</h1>
        <p className="max-w-[520px] text-[17px] leading-relaxed text-[var(--color-muted)]">
          {t("subtitle")}
        </p>
      </div>
      <div className="px-6 sm:px-10">
        <CatalogClient products={products} />
      </div>
    </div>
  );
}
