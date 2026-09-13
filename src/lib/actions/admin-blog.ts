"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { saveUploadedImage } from "@/lib/upload";

function refresh(id?: number) {
  revalidatePath("/admin/dnevnik");
  revalidatePath("/dnevnik");
  if (id) revalidatePath(`/admin/dnevnik/${id}`);
}

function slugify(title: string) {
  return (
    title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || `objava-${Date.now()}`
  );
}

export async function addBlogPost(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return;
  const titleEn = String(formData.get("titleEn") ?? "").trim() || null;
  const tag = String(formData.get("tag") ?? "").trim() || null;
  const excerpt = String(formData.get("excerpt") ?? "").trim() || null;
  const excerptEn = String(formData.get("excerptEn") ?? "").trim() || null;

  const imageFile = formData.get("image");
  const image =
    (imageFile instanceof File ? await saveUploadedImage(imageFile) : null) ??
    "/uploads/photos-1789213046485-t6rp.jpeg";

  await prisma.blogPost.create({
    data: {
      slug: `${slugify(title)}-${Date.now().toString(36)}`,
      title,
      titleEn,
      tag,
      excerpt,
      excerptEn,
      image,
    },
  });
  refresh();
}

export async function updateBlogPost(formData: FormData) {
  const id = Number(formData.get("id"));
  const current = await prisma.blogPost.findUniqueOrThrow({ where: { id } });

  const title = String(formData.get("title") ?? "").trim() || current.title;
  const titleEn = String(formData.get("titleEn") ?? "").trim() || null;
  const tag = String(formData.get("tag") ?? "").trim() || null;
  const excerpt = String(formData.get("excerpt") ?? "").trim() || null;
  const excerptEn = String(formData.get("excerptEn") ?? "").trim() || null;
  const content = String(formData.get("content") ?? "").trim() || null;
  const contentEn = String(formData.get("contentEn") ?? "").trim() || null;
  const status = String(formData.get("status") ?? current.status);

  const imageFile = formData.get("image");
  const newImage = imageFile instanceof File ? await saveUploadedImage(imageFile) : null;

  await prisma.blogPost.update({
    where: { id },
    data: {
      title,
      titleEn,
      tag,
      excerpt,
      excerptEn,
      content,
      contentEn,
      status,
      image: newImage ?? current.image,
    },
  });
  refresh(id);
  redirect("/admin/dnevnik");
}

export async function updateBlogPostImage(formData: FormData) {
  const id = Number(formData.get("id"));
  const imageFile = formData.get("image");
  if (!(imageFile instanceof File)) return;
  const image = await saveUploadedImage(imageFile);
  if (!image) return;
  await prisma.blogPost.update({ where: { id }, data: { image } });
  refresh(id);
}

export async function removeBlogPost(formData: FormData) {
  const id = Number(formData.get("id"));
  await prisma.blogPost.delete({ where: { id } });
  refresh();
  redirect("/admin/dnevnik");
}
