import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { formatRsd } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id: Number(id) },
    include: { items: true },
  });
  if (!order) notFound();

  const t = await getTranslations("Order");
  const tPaymentLong = await getTranslations("PaymentMethodLong");

  return (
    <div className="mx-auto flex max-w-[640px] flex-col gap-7 px-6 py-16 sm:px-10">
      <span className="inline-flex w-fit items-center rounded-full bg-[var(--color-accent-200)] px-3.5 py-1.5 text-xs font-semibold tracking-wider text-[var(--color-accent-700)] uppercase">
        {t("badge", { id: order.id })}
      </span>
      <h1 className="font-display text-4xl">{t("thanks")}</h1>
      <p className="text-[17px] leading-relaxed text-[var(--color-muted)]">
        {t.rich("detail", {
          email: order.email,
          method: tPaymentLong(order.paymentMethod),
          b: (chunks) => <strong>{chunks}</strong>,
        })}
      </p>

      <div className="flex flex-col gap-3 rounded-[20px] bg-white p-6">
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between text-[15px]">
            <span>
              {item.title} <span className="text-[var(--color-muted-2)]">× {item.quantity}</span>
            </span>
            <span className="font-semibold">{formatRsd(item.price * item.quantity)}</span>
          </div>
        ))}
        <div className="flex justify-between border-t border-[var(--color-border)] pt-3 text-[15px] text-[var(--color-muted)]">
          <span>{t("shippingLabel")}</span>
          <span className="text-[var(--color-text)]">{formatRsd(order.shipping)}</span>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-[17px] font-semibold">{t("totalLabel")}</span>
          <span className="font-display text-2xl text-[var(--color-accent)]">
            {formatRsd(order.total)}
          </span>
        </div>
      </div>

      <Link
        href="/katalog"
        className="btn-interactive flex h-13 items-center justify-center rounded-full bg-[var(--color-accent)] text-base font-semibold text-white"
      >
        {t("continueShopping")}
      </Link>
    </div>
  );
}
