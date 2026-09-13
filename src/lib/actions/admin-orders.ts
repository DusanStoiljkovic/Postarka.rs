"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

const FLOW = ["na_cekanju", "placeno", "poslato"];

export async function advanceOrderStatus(formData: FormData) {
  const id = Number(formData.get("id"));
  const order = await prisma.order.findUniqueOrThrow({ where: { id } });
  const idx = FLOW.indexOf(order.status);
  const next = idx >= 0 && idx < FLOW.length - 1 ? FLOW[idx + 1] : order.status;
  await prisma.order.update({ where: { id }, data: { status: next } });
  revalidatePath("/admin/porudzbine");
}

export async function cancelOrder(formData: FormData) {
  const id = Number(formData.get("id"));
  await prisma.order.update({ where: { id }, data: { status: "otkazano" } });
  revalidatePath("/admin/porudzbine");
}
