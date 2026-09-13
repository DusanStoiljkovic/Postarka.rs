"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import {
  adminSessionCookieName,
  adminSessionToken,
  checkAdminPassword,
} from "@/lib/admin-auth";

export async function adminLogin(
  _prevState: { error: string | null },
  formData: FormData,
): Promise<{ error: string | null }> {
  const password = String(formData.get("password") ?? "");
  if (!checkAdminPassword(password)) {
    const t = await getTranslations("AdminLogin");
    return { error: t("wrongPassword") };
  }
  const cookieStore = await cookies();
  cookieStore.set(adminSessionCookieName(), adminSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  redirect("/admin");
}

export async function adminLogout() {
  const cookieStore = await cookies();
  cookieStore.delete(adminSessionCookieName());
  redirect("/admin/login");
}
