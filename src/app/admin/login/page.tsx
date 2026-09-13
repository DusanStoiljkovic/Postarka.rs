"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { adminLogin } from "@/lib/actions/admin-auth-actions";

export default function AdminLoginPage() {
  const t = useTranslations("AdminLogin");
  const [state, formAction, pending] = useActionState(adminLogin, { error: null });

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-dark)] px-6">
      <form
        action={formAction}
        className="flex w-full max-w-[380px] flex-col gap-5 rounded-[22px] bg-[var(--color-bg)] p-8"
      >
        <div className="font-display text-2xl text-[var(--color-accent)]">Poštarka</div>
        <div className="text-sm font-semibold tracking-[0.1em] text-[var(--color-muted-2)] uppercase">
          {t("heading")}
        </div>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-[var(--color-muted)]">{t("passwordLabel")}</span>
          <input
            type="password"
            name="password"
            required
            autoFocus
            className="input"
          />
        </label>
        {state.error && (
          <p className="text-sm text-[var(--color-accent-700)]">{state.error}</p>
        )}
        <button
          type="submit"
          disabled={pending}
          className="btn-interactive flex h-12 items-center justify-center rounded-full bg-[var(--color-accent)] text-base font-semibold text-white disabled:opacity-60"
        >
          {pending ? t("submitButtonLoading") : t("submitButton")}
        </button>
      </form>
    </div>
  );
}
