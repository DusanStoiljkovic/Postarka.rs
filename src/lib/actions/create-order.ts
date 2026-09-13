"use server";

import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { packageUnitCount } from "@/lib/package-units";

const SHIPPING = 390;
const PROMO_CODE = "DOBRODOSLI10";

export type CreateOrderInput = {
  name: string;
  email: string;
  phone?: string;
  street: string;
  postalCode: string;
  city: string;
  country: string;
  sendToRecipient: boolean;
  note?: string;
  paymentMethod: "uplatnica" | "pouzece" | "paypal" | "wise" | "iban";
  promoCode?: string;
  items: { productId: number; quantity: number }[];
};

export type CreateOrderResult =
  | { ok: true; orderId: number }
  | { ok: false; error: string };

export async function createOrder(
  input: CreateOrderInput,
): Promise<CreateOrderResult> {
  const t = await getTranslations("Errors");
  if (!input.items.length) return { ok: false, error: t("cartEmpty") };
  if (!input.name.trim() || !input.email.trim()) {
    return { ok: false, error: t("nameEmailRequired") };
  }
  if (!input.street.trim() || !input.postalCode.trim() || !input.city.trim()) {
    return { ok: false, error: t("addressIncomplete") };
  }

  const products = await prisma.product.findMany({
    where: { id: { in: input.items.map((i) => i.productId) } },
  });
  const byId = new Map(products.map((p) => [p.id, p]));

  let itemsTotal = 0;
  let totalUnits = 0;
  const lineItems: { productId: number; title: string; price: number; quantity: number }[] = [];

  for (const item of input.items) {
    const product = byId.get(item.productId);
    if (!product || product.status === "skriveno") {
      return { ok: false, error: t("productUnavailable") };
    }
    if (product.kind === "postcard") {
      if (product.status === "rasprodato" || product.stock < item.quantity) {
        return {
          ok: false,
          error: t("insufficientStock", { title: product.title }),
        };
      }
      totalUnits += item.quantity;
    } else {
      totalUnits += item.quantity * packageUnitCount(product.title);
    }
    itemsTotal += product.price * item.quantity;
    lineItems.push({
      productId: product.id,
      title: product.title,
      price: product.price,
      quantity: item.quantity,
    });
  }

  const domestic = input.country.trim().toLowerCase() === "srbija";
  const allowedMethods = domestic
    ? totalUnits <= 5
      ? ["uplatnica", "pouzece"]
      : ["uplatnica"]
    : ["paypal", "wise", "iban"];

  if (!allowedMethods.includes(input.paymentMethod)) {
    return {
      ok: false,
      error: t("paymentMethodUnavailable"),
    };
  }

  const discount =
    input.promoCode?.trim().toUpperCase() === PROMO_CODE
      ? Math.round(itemsTotal * 0.1)
      : 0;
  const shipping = SHIPPING;
  const total = itemsTotal + shipping - discount;

  try {
    const order = await prisma.$transaction(async (tx) => {
      for (const item of lineItems) {
        const product = byId.get(item.productId)!;
        if (product.kind === "postcard") {
          const updated = await tx.product.updateMany({
            where: { id: item.productId, stock: { gte: item.quantity } },
            data: { stock: { decrement: item.quantity } },
          });
          if (updated.count === 0) {
            throw new Error(t("insufficientStock", { title: product.title }));
          }
          const fresh = await tx.product.findUnique({ where: { id: item.productId } });
          if (fresh && fresh.stock === 0 && fresh.status === "stanju") {
            await tx.product.update({
              where: { id: item.productId },
              data: { status: "rasprodato" },
            });
          }
        }
      }

      return tx.order.create({
        data: {
          name: input.name.trim(),
          email: input.email.trim(),
          phone: input.phone?.trim() || null,
          street: input.street.trim(),
          postalCode: input.postalCode.trim(),
          city: input.city.trim(),
          country: input.country.trim(),
          sendToRecipient: input.sendToRecipient,
          note: input.note?.trim() || null,
          paymentMethod: input.paymentMethod,
          itemsTotal,
          shipping,
          discount,
          total,
          items: {
            create: lineItems.map((li) => ({
              productId: li.productId,
              title: li.title,
              price: li.price,
              quantity: li.quantity,
            })),
          },
        },
      });
    });

    revalidatePath("/katalog");
    revalidatePath("/");
    revalidatePath("/admin");

    return { ok: true, orderId: order.id };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : t("generic"),
    };
  }
}
