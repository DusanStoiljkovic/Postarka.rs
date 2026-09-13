import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminSessionCookieName, isValidAdminSession } from "@/lib/admin-auth";
import { AdminNav } from "@/components/admin/admin-nav";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get(adminSessionCookieName())?.value;
  if (!isValidAdminSession(token)) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <div className="flex items-center justify-between bg-[var(--color-dark)] px-6 py-5.5 sm:px-10">
        <div className="flex items-center gap-4.5">
          <div className="font-display text-2xl text-[#F0A7BF]">Poštarka</div>
          <div className="text-[13px] font-medium tracking-[0.1em] text-[#A6918B] uppercase">
            Admin
          </div>
        </div>
        <AdminNav />
      </div>
      {children}
    </div>
  );
}
