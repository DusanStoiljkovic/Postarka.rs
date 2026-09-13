"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useCart } from "@/lib/cart-context";

export function AddToCart({
  productId,
  slug,
  kind,
  title,
  price,
  image,
  stock,
  soldOut,
}: {
  productId: number;
  slug: string;
  kind: string;
  title: string;
  price: number;
  image: string;
  stock: number;
  soldOut: boolean;
}) {
  const t = useTranslations("AddToCart");
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const cap = kind === "package" ? 50 : stock;

  if (soldOut) {
    return (
      <div className="flex h-13 items-center justify-center rounded-full bg-[var(--color-dark)] text-base font-semibold text-[var(--color-bg)]">
        {t("notifyMe")}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex h-13 items-center gap-4.5 rounded-full border-[1.5px] border-[var(--color-border-2)] bg-white px-4.5 text-base font-semibold">
        <button
          type="button"
          aria-label={t("decreaseAria")}
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          className="text-[var(--color-muted-2)]"
        >
          −
        </button>
        <span className="min-w-[1.5ch] text-center">{qty}</span>
        <button
          type="button"
          aria-label={t("increaseAria")}
          onClick={() => setQty((q) => Math.min(cap, q + 1))}
        >
          +
        </button>
      </div>
      <button
        type="button"
        onClick={() => {
          addItem(
            { productId, slug, kind, title, price, image, stockCap: cap },
            qty,
          );
          setAdded(true);
          setTimeout(() => setAdded(false), 1600);
        }}
        className="btn-interactive flex h-13 flex-1 items-center justify-center rounded-full bg-[var(--color-accent)] text-base font-semibold text-white"
      >
        {added ? t("added") : t("add")}
      </button>
    </div>
  );
}
