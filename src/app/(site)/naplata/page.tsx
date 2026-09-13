"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useCart } from "@/lib/cart-context";
import { formatRsd } from "@/lib/format";
import { packageUnitCount } from "@/lib/package-units";
import { createOrder } from "@/lib/actions/create-order";

const SHIPPING = 390;
const COUNTRIES = [
  "Srbija",
  "Hrvatska",
  "Slovenija",
  "Nemačka",
  "Austrija",
  "Francuska",
  "SAD",
  "Ostalo",
];

type PaymentMethod = "uplatnica" | "pouzece" | "paypal" | "wise" | "iban";

export default function CheckoutPage() {
  const t = useTranslations("Checkout");
  const tCountry = useTranslations("Country");
  const locale = useLocale();
  const router = useRouter();
  const { items, subtotal, clear } = useCart();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [sendToRecipient, setSendToRecipient] = useState(false);
  const [street, setStreet] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("Srbija");
  const [note, setNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalUnits = useMemo(
    () =>
      items.reduce(
        (n, i) =>
          n + (i.kind === "package" ? i.quantity * packageUnitCount(i.title) : i.quantity),
        0,
      ),
    [items],
  );
  const domestic = country === "Srbija";
  const allowedMethods: PaymentMethod[] = domestic
    ? totalUnits <= 5
      ? ["uplatnica", "pouzece"]
      : ["uplatnica"]
    : ["paypal", "wise", "iban"];

  const shipping = items.length > 0 ? SHIPPING : 0;
  const total = subtotal + shipping;

  const effectiveMethod =
    paymentMethod && allowedMethods.includes(paymentMethod)
      ? paymentMethod
      : allowedMethods[0];

  const unit =
    totalUnits === 1
      ? t("unitOne")
      : locale !== "en" && totalUnits >= 5
        ? t("unitMany")
        : t("unitFew");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) return;
    setSubmitting(true);
    setError(null);
    const result = await createOrder({
      name,
      email,
      phone,
      street,
      postalCode,
      city,
      country,
      sendToRecipient,
      note,
      paymentMethod: effectiveMethod,
      items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
    });
    setSubmitting(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    clear();
    router.push(`/narudzbina/${result.orderId}`);
  }

  if (items.length === 0) {
    return (
      <div className="px-6 py-20 text-center sm:px-10">
        <p className="mb-6 text-lg text-[var(--color-muted)]">
          {t("emptyCart")}
        </p>
        <Link
          href="/katalog"
          className="btn-interactive inline-flex h-12 items-center rounded-full bg-[var(--color-accent)] px-7 text-base font-semibold text-white"
        >
          {t("browse")}
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-9 pb-16">
      <div className="flex items-center justify-between px-6 py-6.5 sm:px-10">
        <div className="font-display text-2xl text-[var(--color-accent)]">Poštarka</div>
        <div className="hidden gap-3 text-sm text-[var(--color-muted-2)] sm:flex">
          <span className="text-[var(--color-text)]">{t("step1")}</span>
          <span>→</span>
          <span>{t("step2")}</span>
          <span>→</span>
          <span>{t("step3")}</span>
        </div>
      </div>

      <div className="grid gap-10 px-6 sm:px-10 md:grid-cols-[1fr_380px] md:items-start">
        <div className="flex flex-col gap-9">
          <section className="flex flex-col gap-4.5">
            <h2 className="font-display text-3xl">{t("contactHeading")}</h2>
            <div className="grid gap-3.5 sm:grid-cols-2">
              <Field label={t("fullNameLabel")}>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input"
                />
              </Field>
              <Field label={t("emailLabel")}>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input"
                />
              </Field>
            </div>
            <Field label={t("phoneLabel")}>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} className="input" />
            </Field>
          </section>

          <section className="flex flex-col gap-4.5">
            <h2 className="font-display text-3xl">{t("addressHeading")}</h2>
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => setSendToRecipient(false)}
                className={`h-11.5 rounded-full px-5 text-sm font-semibold ${!sendToRecipient ? "bg-[var(--color-dark)] text-[var(--color-bg)]" : "border-[1.5px] border-[var(--color-border-2)] text-[var(--color-muted)]"}`}
              >
                {t("sendToMe")}
              </button>
              <button
                type="button"
                onClick={() => setSendToRecipient(true)}
                className={`h-11.5 rounded-full px-5 text-sm font-semibold ${sendToRecipient ? "bg-[var(--color-dark)] text-[var(--color-bg)]" : "border-[1.5px] border-[var(--color-border-2)] text-[var(--color-muted)]"}`}
              >
                {t("sendDirect")}
              </button>
            </div>
            <div className="grid gap-3.5 sm:grid-cols-[2fr_1fr]">
              <Field label={t("streetLabel")}>
                <input
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="input"
                />
              </Field>
              <Field label={t("postalCodeLabel")}>
                <input
                  required
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="input"
                />
              </Field>
            </div>
            <div className="grid gap-3.5 sm:grid-cols-2">
              <Field label={t("cityLabel")}>
                <input
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="input"
                />
              </Field>
              <Field label={t("countryLabel")}>
                <select
                  value={country}
                  onChange={(e) => {
                    setCountry(e.target.value);
                    setPaymentMethod(null);
                  }}
                  className="input"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>
                      {tCountry(c)}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            {sendToRecipient && (
              <Field label={t("recipientNoteLabel")}>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  className="input h-auto rounded-[20px] py-3.5"
                />
              </Field>
            )}
          </section>

          <section className="flex flex-col gap-4.5">
            <h2 className="font-display text-3xl">{t("paymentHeading")}</h2>
            <div className="flex items-center gap-2.5 rounded-2xl bg-[var(--color-accent-200)] px-4.5 py-3.5 text-[15px] font-medium text-[var(--color-accent-700)]">
              {t("orderSummaryNote", { count: totalUnits, unit, country: tCountry(country) })}
              {domestic && totalUnits > 5 && t("overLimitNote")}
            </div>

            <div className="flex flex-col gap-2.5">
              {domestic ? (
                <>
                  <PaymentOption
                    id="uplatnica"
                    title={t("uplatnicaTitle")}
                    description={t("uplatnicaDesc")}
                    tag={totalUnits > 5 ? t("tagSixPlus") : undefined}
                    selected={effectiveMethod === "uplatnica"}
                    onSelect={() => setPaymentMethod("uplatnica")}
                  />
                  <PaymentOption
                    id="pouzece"
                    title={t("pouzeceTitle")}
                    description={
                      totalUnits <= 5 ? t("pouzeceDescAvailable") : t("pouzeceDescUnavailable")
                    }
                    disabled={totalUnits > 5}
                    selected={effectiveMethod === "pouzece"}
                    onSelect={() => setPaymentMethod("pouzece")}
                  />
                </>
              ) : (
                <div className="flex flex-col gap-3 rounded-2xl bg-white p-6">
                  <div className="text-[15px] font-semibold">
                    {t("foreignTitle")}
                  </div>
                  <div className="text-[15px] leading-relaxed text-[var(--color-muted)]">
                    {t("foreignText")}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(["paypal", "wise", "iban"] as const).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setPaymentMethod(m)}
                        className={`h-8 rounded-full px-3.5 text-[13px] font-medium ${
                          effectiveMethod === m
                            ? "bg-[var(--color-dark)] text-[var(--color-bg)]"
                            : "border-[1.5px] border-[var(--color-border-3)] text-[#4A3A40]"
                        }`}
                      >
                        {m === "paypal" ? t("methodPaypal") : m === "wise" ? t("methodWise") : t("methodIban")}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between gap-7 rounded-2xl bg-[var(--color-dark)] p-6.5">
              <div className="flex flex-col gap-1.5">
                <div className="text-base font-semibold text-[var(--color-bg)]">
                  {t("instagramCardTitle")}
                </div>
                <div className="max-w-[380px] text-[15px] leading-relaxed text-[#D8C6C0]">
                  {t("instagramCardText")}
                </div>
              </div>
              <a
                href="https://instagram.com/postarka"
                target="_blank"
                rel="noreferrer"
                className="btn-interactive flex h-11.5 shrink-0 items-center rounded-full bg-[var(--color-accent-200)] px-6 text-[15px] font-semibold text-[var(--color-accent-700)]"
              >
                {t("instagramHandle")}
              </a>
            </div>
          </section>
        </div>

        <div className="flex flex-col gap-4 rounded-[22px] bg-white p-7 shadow-[0_10px_28px_rgba(46,31,38,0.08)]">
          <div className="font-display text-2xl">{t("orderSummaryTitle")}</div>
          {items.map((item) => (
            <div key={item.productId} className="flex items-center gap-3">
              <div className="relative h-10 w-14 overflow-hidden rounded-lg bg-[var(--color-bg)]">
                <Image src={item.image} alt="" fill className="object-contain" />
              </div>
              <div className="flex-1 text-[15px] font-medium">
                {item.title} <span className="text-[var(--color-muted-2)]">× {item.quantity}</span>
              </div>
              <div className="text-[15px] font-semibold">
                {(item.price * item.quantity).toLocaleString("sr-RS")}
              </div>
            </div>
          ))}
          <div className="flex justify-between border-t border-[var(--color-border)] pt-3.5 text-[15px] text-[var(--color-muted)]">
            <span>{t("shippingLabel")}</span>
            <span className="text-[var(--color-text)]">{formatRsd(shipping)}</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-[17px] font-semibold">{t("totalLabel")}</span>
            <span className="font-display text-[28px] text-[var(--color-accent)]">
              {formatRsd(total)}
            </span>
          </div>
          {error && (
            <p className="rounded-xl bg-[var(--color-accent-200)] p-3 text-sm text-[var(--color-accent-700)]">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="btn-interactive flex h-13 items-center justify-center rounded-full bg-[var(--color-accent)] text-base font-semibold text-white disabled:opacity-60"
          >
            {submitting ? t("submitButtonLoading") : t("submitButton")}
          </button>
          <div className="text-center text-[13px] text-[var(--color-muted-2)]">
            {t("footNote")}
          </div>
        </div>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-[var(--color-muted)]">{label}</span>
      {children}
    </label>
  );
}

function PaymentOption({
  id,
  title,
  description,
  tag,
  disabled,
  selected,
  onSelect,
}: {
  id: string;
  title: string;
  description: string;
  tag?: string;
  disabled?: boolean;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onSelect}
      className={`flex items-start gap-3.5 rounded-2xl px-5.5 py-4.5 text-left ${
        disabled
          ? "cursor-not-allowed bg-[var(--color-card-alt-2)] opacity-75"
          : selected
            ? "border-[1.5px] border-[var(--color-accent)] bg-white"
            : "border-[1.5px] border-[var(--color-border)] bg-white"
      }`}
      aria-pressed={selected}
      id={id}
    >
      <span
        className={`mt-0.5 h-[18px] w-[18px] shrink-0 rounded-full border ${
          selected && !disabled
            ? "border-[5px] border-[var(--color-accent)] bg-white"
            : "border-[1.5px] border-[var(--color-border-2)]"
        }`}
      />
      <span className="flex flex-col gap-1">
        <span className={`text-[15px] font-semibold ${disabled ? "text-[var(--color-muted)]" : ""}`}>
          {title}
        </span>
        <span className={`text-sm leading-relaxed ${disabled ? "text-[var(--color-muted-2)]" : "text-[var(--color-muted)]"}`}>
          {description}
        </span>
      </span>
      {tag && (
        <span className="ml-auto shrink-0 rounded-full bg-[var(--color-accent-200)] px-2.5 py-1 text-[11px] font-semibold tracking-wide text-[var(--color-accent-700)] whitespace-nowrap">
          {tag}
        </span>
      )}
    </button>
  );
}
