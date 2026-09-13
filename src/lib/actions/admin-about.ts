"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { saveUploadedImage } from "@/lib/upload";

export async function updateAboutContent(formData: FormData) {
  const existing = await prisma.aboutContent.findFirst();

  const paragraph1 = String(formData.get("paragraph1") ?? "").trim() || null;
  const paragraph1En = String(formData.get("paragraph1En") ?? "").trim() || null;
  const paragraph2 = String(formData.get("paragraph2") ?? "").trim() || null;
  const paragraph2En = String(formData.get("paragraph2En") ?? "").trim() || null;
  const wholesaleText = String(formData.get("wholesaleText") ?? "").trim() || null;
  const wholesaleTextEn = String(formData.get("wholesaleTextEn") ?? "").trim() || null;

  const portraitFile = formData.get("portraitImage");
  const atelje1File = formData.get("atelje1Image");
  const atelje2File = formData.get("atelje2Image");

  const [portraitImage, atelje1Image, atelje2Image] = await Promise.all([
    portraitFile instanceof File ? saveUploadedImage(portraitFile) : null,
    atelje1File instanceof File ? saveUploadedImage(atelje1File) : null,
    atelje2File instanceof File ? saveUploadedImage(atelje2File) : null,
  ]);

  const data = {
    paragraph1,
    paragraph1En,
    paragraph2,
    paragraph2En,
    wholesaleText,
    wholesaleTextEn,
    portraitImage: portraitImage ?? existing?.portraitImage ?? null,
    atelje1Image: atelje1Image ?? existing?.atelje1Image ?? null,
    atelje2Image: atelje2Image ?? existing?.atelje2Image ?? null,
  };

  if (existing) {
    await prisma.aboutContent.update({ where: { id: existing.id }, data });
  } else {
    await prisma.aboutContent.create({ data });
  }

  revalidatePath("/admin/o-meni");
  revalidatePath("/o-meni");
  redirect("/admin/o-meni");
}
