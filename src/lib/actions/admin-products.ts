"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { saveUploadedImage } from "@/lib/upload";

const STATUSES = ["stanju", "rasprodato", "skriveno"];

function refresh(id?: number) {
  revalidatePath("/admin");
  revalidatePath("/katalog");
  revalidatePath("/");
  if (id) revalidatePath(`/admin/razglednice/${id}`);
}

export async function incrementStock(formData: FormData) {
  const id = Number(formData.get("id"));
  const product = await prisma.product.update({
    where: { id },
    data: { stock: { increment: 1 } },
  });
  if (product.stock > 0 && product.status === "rasprodato") {
    await prisma.product.update({ where: { id }, data: { status: "stanju" } });
  }
  refresh();
}

export async function decrementStock(formData: FormData) {
  const id = Number(formData.get("id"));
  const current = await prisma.product.findUniqueOrThrow({ where: { id } });
  const stock = Math.max(0, current.stock - 1);
  await prisma.product.update({
    where: { id },
    data: {
      stock,
      status: stock === 0 && current.status === "stanju" ? "rasprodato" : current.status,
    },
  });
  refresh();
}

export async function cycleStatus(formData: FormData) {
  const id = Number(formData.get("id"));
  const current = await prisma.product.findUniqueOrThrow({ where: { id } });
  const next = STATUSES[(STATUSES.indexOf(current.status) + 1) % STATUSES.length];
  await prisma.product.update({ where: { id }, data: { status: next } });
  refresh();
}

export async function removeProduct(formData: FormData) {
  const id = Number(formData.get("id"));
  await prisma.product.delete({ where: { id } });
  refresh();
  redirect("/admin");
}

export async function addProduct(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return;
  const titleEn = String(formData.get("titleEn") ?? "").trim() || null;
  const price = parseInt(String(formData.get("price") ?? ""), 10);
  const stock = parseInt(String(formData.get("stock") ?? ""), 10);
  const type = String(formData.get("type") ?? "serija");
  const theme = String(formData.get("theme") ?? "").trim() || null;
  const slug =
    title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || `razglednica-${Date.now()}`;

  const imageFile = formData.get("image");
  const image =
    (imageFile instanceof File ? await saveUploadedImage(imageFile) : null) ??
    "/uploads/photos-1789213046485-t6rp.jpeg";

  await prisma.product.create({
    data: {
      slug: `${slug}-${Date.now().toString(36)}`,
      kind: "postcard",
      title,
      titleEn,
      type,
      theme,
      price: Number.isNaN(price) ? 320 : price,
      stock: Number.isNaN(stock) ? 0 : stock,
      status: (Number.isNaN(stock) ? 0 : stock) > 0 ? "stanju" : "rasprodato",
      image,
    },
  });
  refresh();
}

export async function updateProductImage(formData: FormData) {
  const id = Number(formData.get("id"));
  const imageFile = formData.get("image");
  if (!(imageFile instanceof File)) return;
  const image = await saveUploadedImage(imageFile);
  if (!image) return;
  await prisma.product.update({ where: { id }, data: { image } });
  refresh(id);
}

export async function updateProduct(formData: FormData) {
  const id = Number(formData.get("id"));
  const current = await prisma.product.findUniqueOrThrow({ where: { id } });

  const title = String(formData.get("title") ?? "").trim() || current.title;
  const titleEn = String(formData.get("titleEn") ?? "").trim() || null;
  const description = String(formData.get("description") ?? "").trim() || null;
  const descriptionEn = String(formData.get("descriptionEn") ?? "").trim() || null;
  const type = String(formData.get("type") ?? current.type ?? "serija");
  const theme = String(formData.get("theme") ?? "").trim() || null;
  const status = String(formData.get("status") ?? current.status);

  const priceRaw = parseInt(String(formData.get("price") ?? ""), 10);
  const stockRaw = parseInt(String(formData.get("stock") ?? ""), 10);
  const editionRaw = String(formData.get("edition") ?? "").trim();
  const editionParsed = editionRaw ? parseInt(editionRaw, 10) : null;

  const imageFile = formData.get("image");
  const newImage = imageFile instanceof File ? await saveUploadedImage(imageFile) : null;

  await prisma.product.update({
    where: { id },
    data: {
      title,
      titleEn,
      description,
      descriptionEn,
      type,
      theme,
      status,
      price: Number.isNaN(priceRaw) ? current.price : priceRaw,
      stock: Number.isNaN(stockRaw) ? current.stock : stockRaw,
      edition: editionParsed !== null && !Number.isNaN(editionParsed) ? editionParsed : null,
      image: newImage ?? current.image,
    },
  });
  refresh(id);
  redirect("/admin");
}
