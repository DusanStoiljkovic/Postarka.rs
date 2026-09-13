"use server";

import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";

export type SendMessageResult = { ok: true } | { ok: false; error: string };

export async function sendContactMessage(input: {
  name: string;
  email: string;
  topic: string;
  message: string;
}): Promise<SendMessageResult> {
  if (!input.name.trim() || !input.email.trim() || !input.message.trim()) {
    const t = await getTranslations("Errors");
    return { ok: false, error: t("contactRequired") };
  }
  await prisma.contactMessage.create({
    data: {
      name: input.name.trim(),
      email: input.email.trim(),
      topic: input.topic,
      message: input.message.trim(),
    },
  });
  return { ok: true };
}
