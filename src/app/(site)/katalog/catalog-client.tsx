"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { ProductCard, type ProductCardData } from "@/components/product-card";

const THEMES = ["Životinje", "Hrana", "Priroda", "Praznici", "Bajke"];
const PAGE_SIZE = 12;
const MIN_PRICE = 250;
const MAX_PRICE = 600;

type Sort = "novo" | "cena-rastuce" | "cena-opadajuce";

export function CatalogClient({ products }: { products: ProductCardData[] }) {
  const t = useTranslations("Catalog");
  const tTheme = useTranslations("Theme");
  const [theme, setTheme] = useState<string | null>(null);
  const [types, setTypes] = useState<Set<string>>(new Set());
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [showArchive, setShowArchive] = useState(false);
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
  const [sort, setSort] = useState<Sort>("novo");
  const [page, setPage] = useState(1);

  function toggleType(t: string) {
    setPage(1);
    setTypes((prev) => {
      const next = new Set(prev);
      if (next.has(t)) next.delete(t);
      else next.add(t);
      return next;
    });
  }

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      if (p.status === "skriveno" && !showArchive) return false;
      if (theme && p.kind === "postcard" && p.theme !== theme) return false;
      if (theme && p.kind === "package") return false;
      if (types.size > 0) {
        const bucket =
          p.kind === "package" ? "paketi" : p.type === "unikat" ? "unikat" : "serija";
        if (!types.has(bucket)) return false;
      }
      if (onlyInStock && p.status !== "stanju") return false;
      if (p.price > maxPrice) return false;
      return true;
    });

    list = [...list].sort((a, b) => {
      if (sort === "cena-rastuce") return a.price - b.price;
      if (sort === "cena-opadajuce") return b.price - a.price;
      return 0;
    });

    return list;
  }, [products, theme, types, onlyInStock, showArchive, maxPrice, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  return (
    <div className="grid gap-10 md:grid-cols-[220px_1fr] md:items-start">
      <aside className="flex flex-col gap-7 md:sticky md:top-6">
        <div className="flex flex-col gap-3">
          <div className="text-[13px] font-semibold tracking-[0.1em] text-[var(--color-muted-2)] uppercase">
            {t("themeLabel")}
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setTheme(null);
                setPage(1);
              }}
              className={`h-8 rounded-full px-3.5 text-[13px] font-semibold transition-colors duration-200 ${
                theme === null
                  ? "bg-[var(--color-dark)] text-[var(--color-bg)]"
                  : "border-[1.5px] border-[var(--color-border-3)] text-[var(--color-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
              }`}
            >
              {t("allOption")}
            </button>
            {THEMES.map((th) => (
              <button
                key={th}
                type="button"
                onClick={() => {
                  setTheme(th);
                  setPage(1);
                }}
                className={`h-8 rounded-full px-3.5 text-[13px] font-medium transition-colors duration-200 ${
                  theme === th
                    ? "bg-[var(--color-dark)] text-[var(--color-bg)]"
                    : "border-[1.5px] border-[var(--color-border-3)] text-[var(--color-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                }`}
              >
                {tTheme(th)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="text-[13px] font-semibold tracking-[0.1em] text-[var(--color-muted-2)] uppercase">
            {t("editionLabel")}
          </div>
          <div className="flex flex-col gap-2.5 text-[15px] text-[#4A3A40]">
            {[
              { id: "unikat", label: t("uniqueOption") },
              { id: "serija", label: t("seriesOption") },
              { id: "paketi", label: t("packagesOption") },
            ].map((opt) => (
              <label key={opt.id} className="flex cursor-pointer items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={types.has(opt.id)}
                  onChange={() => toggleType(opt.id)}
                  className="h-[18px] w-[18px] accent-[var(--color-accent)]"
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="text-[13px] font-semibold tracking-[0.1em] text-[var(--color-muted-2)] uppercase">
            {t("availabilityLabel")}
          </div>
          <div className="flex flex-col gap-2.5 text-[15px] text-[#4A3A40]">
            <label className="flex cursor-pointer items-center gap-2.5">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => {
                  setOnlyInStock(e.target.checked);
                  setPage(1);
                }}
                className="h-[18px] w-[18px] accent-[var(--color-accent)]"
              />
              {t("inStockOption")}
            </label>
            <label className="flex cursor-pointer items-center gap-2.5">
              <input
                type="checkbox"
                checked={showArchive}
                onChange={(e) => {
                  setShowArchive(e.target.checked);
                  setPage(1);
                }}
                className="h-[18px] w-[18px] accent-[var(--color-accent)]"
              />
              {t("showArchiveOption")}
            </label>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="text-[13px] font-semibold tracking-[0.1em] text-[var(--color-muted-2)] uppercase">
            {t("priceLabel")}
          </div>
          <input
            type="range"
            min={MIN_PRICE}
            max={MAX_PRICE}
            step={10}
            value={maxPrice}
            onChange={(e) => {
              setMaxPrice(Number(e.target.value));
              setPage(1);
            }}
            className="w-full accent-[var(--color-accent)]"
          />
          <div className="text-sm text-[var(--color-muted-2)]">
            {t("priceRange", { min: MIN_PRICE, max: maxPrice })}
          </div>
        </div>
      </aside>

      <div className="flex flex-col gap-7">
        <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4">
          <div className="text-[15px] text-[var(--color-muted)]">
            {t("showing", { shown: pageItems.length, total: filtered.length })}
          </div>
          <div className="flex items-center gap-2 text-[15px] font-medium">
            <span className="text-[var(--color-muted-2)]">{t("sortLabel")}</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="bg-transparent outline-none"
            >
              <option value="novo">{t("sortNewest")}</option>
              <option value="cena-rastuce">{t("sortPriceAsc")}</option>
              <option value="cena-opadajuce">{t("sortPriceDesc")}</option>
            </select>
          </div>
        </div>

        {pageItems.length === 0 ? (
          <p className="py-10 text-center text-[var(--color-muted)]">
            {t("noResults")}
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-6.5 sm:grid-cols-3">
            {pageItems.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2.5 pt-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setPage(n)}
                className={`flex h-9.5 w-9.5 items-center justify-center rounded-full text-sm font-semibold ${
                  n === currentPage
                    ? "bg-[var(--color-dark)] text-[var(--color-bg)]"
                    : "border-[1.5px] border-[var(--color-border-3)] text-[var(--color-muted)]"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
