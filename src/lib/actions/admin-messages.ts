"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function removeContactMessage(formData: FormData) {
  const id = Number(formData.get("id"));
  await prisma.contactMessage.delete({ where: { id } });
  revalidatePath("/admin/poruke");
}
