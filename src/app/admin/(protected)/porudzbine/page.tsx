import { getLocale, getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { formatRsd } from "@/lib/format";
import { advanceOrderStatus, cancelOrder } from "@/lib/actions/admin-orders";

export const dynamic = "force-dynamic";

const STATUS_STYLE: Record<string, { bg: string; fg: string }> = {
  na_cekanju: { bg: "#F6D3DE", fg: "#9E3D5E" },
  placeno: { bg: "#E4EEDC", fg: "#4B5C38" },
  poslato: { bg: "#DDE7F3", fg: "#33506E" },
  otkazano: { bg: "#EFE7E4", fg: "#6B5D58" },
};

export default async function AdminOrdersPage() {
  const t = await getTranslations("AdminOrders");
  const tStatus = await getTranslations("OrderStatus");
  const tPayment = await getTranslations("PaymentMethod");
  const locale = await getLocale();

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return (
    <div className="flex flex-col gap-7 px-6 pt-9 pb-16 sm:px-10">
      <div className="flex flex-col gap-1.5">
        <h1 className="font-display text-4xl">{t("heading")}</h1>
        <p className="text-base text-[var(--color-muted)]">{t("count", { count: orders.length })}</p>
      </div>

      {orders.length === 0 ? (
        <p className="text-[var(--color-muted)]">{t("empty")}</p>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => {
            const style = STATUS_STYLE[order.status] ?? STATUS_STYLE.na_cekanju;
            return (
              <div
                key={order.id}
                className="flex flex-col gap-4 rounded-[20px] bg-white p-6 shadow-[0_6px_18px_rgba(46,31,38,0.06)]"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-col gap-1">
                    <div className="text-base font-semibold">
                      #{order.id} · {order.name}
                    </div>
                    <div className="text-sm text-[var(--color-muted-2)]">
                      {order.email} · {order.city}, {order.country} ·{" "}
                      {new Date(order.createdAt).toLocaleDateString(locale === "en" ? "en-US" : "sr-RS")}
                    </div>
                  </div>
                  <span
                    style={{ background: style.bg, color: style.fg }}
                    className="rounded-full px-3.5 py-1.5 text-[13px] font-semibold"
                  >
                    {tStatus(order.status)}
                  </span>
                </div>

                <div className="flex flex-col gap-1 border-y border-[var(--color-border)] py-3.5 text-[15px]">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <span>
                        {item.title}{" "}
                        <span className="text-[var(--color-muted-2)]">× {item.quantity}</span>
                      </span>
                      <span className="font-medium">
                        {formatRsd(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="text-sm text-[var(--color-muted-2)]">
                    {t("paymentLabel")}: <strong className="text-[var(--color-text)]">{tPayment(order.paymentMethod)}</strong>
                    {" · "}{t("totalLabel")}:{" "}
                    <strong className="text-[var(--color-text)]">{formatRsd(order.total)}</strong>
                  </div>
                  <div className="flex gap-2">
                    {order.status !== "poslato" && order.status !== "otkazano" && (
                      <form action={advanceOrderStatus}>
                        <input type="hidden" name="id" value={order.id} />
                        <button
                          type="submit"
                          className="h-9 rounded-full bg-[var(--color-dark)] px-4 text-[13px] font-semibold text-[var(--color-bg)]"
                        >
                          {order.status === "na_cekanju" ? t("markPaid") : t("markShipped")}
                        </button>
                      </form>
                    )}
                    {order.status !== "otkazano" && order.status !== "poslato" && (
                      <form action={cancelOrder}>
                        <input type="hidden" name="id" value={order.id} />
                        <button
                          type="submit"
                          className="h-9 rounded-full border-[1.5px] border-[var(--color-border)] px-4 text-[13px] font-semibold text-[var(--color-accent-700)]"
                        >
                          {t("cancel")}
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
