"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useCart } from "@/lib/cart-context";
import { formatRsd } from "@/lib/format";

const SHIPPING = 390;

export default function CartPage() {
  const t = useTranslations("Cart");
  const { items, setQuantity, removeItem, subtotal } = useCart();
  const [promo, setPromo] = useState("");
  const [discount, setDiscount] = useState(0);

  const shipping = items.length > 0 ? SHIPPING : 0;
  const total = subtotal + shipping - discount;

  function applyPromo() {
    setDiscount(promo.trim().toUpperCase() === "DOBRODOSLI10" ? Math.round(subtotal * 0.1) : 0);
  }

  return (
    <div className="flex flex-col gap-9 pb-16">
      <div className="px-6 pt-13 sm:px-10">
        <h1 className="font-display text-[44px]">{t("title")}</h1>
      </div>

      {items.length === 0 ? (
        <div className="px-6 py-16 text-center sm:px-10">
          <p className="mb-6 text-lg text-[var(--color-muted)]">
            {t("empty")}
          </p>
          <Link
            href="/katalog"
            className="btn-interactive inline-flex h-12 items-center rounded-full bg-[var(--color-accent)] px-7 text-base font-semibold text-white"
          >
            {t("browse")}
          </Link>
        </div>
      ) : (
        <div className="grid gap-10 px-6 sm:px-10 md:grid-cols-[1fr_380px] md:items-start">
          <div className="flex flex-col">
            {items.map((item) => (
              <div
                key={item.productId}
                className="flex flex-col gap-4 border-b border-[var(--color-border)] py-5.5 sm:grid sm:grid-cols-[96px_1fr_auto_auto] sm:items-center sm:gap-5"
              >
                <div className="flex gap-4 sm:contents">
                  <div className="relative h-[68px] w-20 shrink-0 overflow-hidden rounded-[10px] bg-white sm:w-24">
                    <Image src={item.image} alt={item.title} fill className="object-contain" />
                  </div>
                  <div className="flex flex-1 flex-col gap-1">
                    <div className="text-[17px] font-semibold">{item.title}</div>
                    <div className="text-sm text-[var(--color-muted-2)]">
                      {t("perUnit", { price: formatRsd(item.price) })}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.productId)}
                      className="w-fit text-sm font-medium text-[var(--color-accent-700)]"
                    >
                      {t("remove")}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4 sm:contents">
                  <div className="flex h-10.5 items-center gap-4 rounded-full border-[1.5px] border-[var(--color-border-2)] bg-white px-4 text-[15px] font-semibold">
                    <button
                      type="button"
                      aria-label={t("decreaseAria")}
                      onClick={() => setQuantity(item.productId, item.quantity - 1)}
                      className="text-[var(--color-muted-2)]"
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      type="button"
                      aria-label={t("increaseAria")}
                      onClick={() =>
                        setQuantity(
                          item.productId,
                          Math.min(item.stockCap ?? Infinity, item.quantity + 1),
                        )
                      }
                    >
                      +
                    </button>
                  </div>
                  <div className="text-right text-[17px] font-semibold sm:min-w-[90px]">
                    {formatRsd(item.price * item.quantity)}
                  </div>
                </div>
              </div>
            ))}

            <div className="mt-7 flex flex-col gap-2.5 rounded-[18px] bg-white p-6">
              <div className="text-[15px] font-semibold">{t("messageCardTitle")}</div>
              <div className="text-[15px] leading-relaxed text-[var(--color-muted)]">
                {t("messageCardText")}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 rounded-[22px] bg-white p-7 shadow-[0_10px_28px_rgba(46,31,38,0.08)]">
            <div className="font-display text-2xl">{t("summaryTitle")}</div>
            <SummaryRow label={t("postcardsLabel")} value={formatRsd(subtotal)} />
            <SummaryRow label={t("shippingLabel")} value={formatRsd(shipping)} />
            <div className="flex justify-between text-[15px] text-[var(--color-muted)]">
              <span>{t("discountLabel")}</span>
              <span className="text-[var(--color-accent-2)]">
                −{formatRsd(discount)}
              </span>
            </div>
            <div className="flex items-baseline justify-between border-t border-[var(--color-border)] pt-4">
              <span className="text-[17px] font-semibold">{t("totalLabel")}</span>
              <span className="font-display text-[28px] text-[var(--color-accent)]">
                {formatRsd(total)}
              </span>
            </div>
            <div className="flex gap-2">
              <input
                value={promo}
                onChange={(e) => setPromo(e.target.value)}
                placeholder={t("promoPlaceholder")}
                className="h-11 flex-1 rounded-full border-[1.5px] border-[var(--color-border-2)] px-4.5 text-sm outline-none placeholder:text-[var(--color-muted-3)]"
              />
              <button
                type="button"
                onClick={applyPromo}
                className="btn-interactive h-11 rounded-full bg-[var(--color-accent-200)] px-4.5 text-sm font-semibold text-[var(--color-accent-700)]"
              >
                {t("applyPromo")}
              </button>
            </div>
            <Link
              href="/naplata"
              className="btn-interactive flex h-13 items-center justify-center rounded-full bg-[var(--color-accent)] text-base font-semibold text-white"
            >
              {t("checkoutButton")}
            </Link>
            <div className="text-center text-[13px] leading-relaxed text-[var(--color-muted-2)]">
              {t("footNote")}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-[15px] text-[var(--color-muted)]">
      <span>{label}</span>
      <span className="text-[var(--color-text)]">{value}</span>
    </div>
  );
}
