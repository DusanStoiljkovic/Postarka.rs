import { getLocale, getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { removeContactMessage } from "@/lib/actions/admin-messages";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  const t = await getTranslations("AdminMessages");
  const locale = await getLocale();

  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-7 px-6 pt-9 pb-16 sm:px-10">
      <div className="flex flex-col gap-1.5">
        <h1 className="font-display text-4xl">{t("heading")}</h1>
        <p className="text-base text-[var(--color-muted)]">
          {t("count", { count: messages.length })}
        </p>
      </div>

      {messages.length === 0 ? (
        <p className="text-[var(--color-muted)]">{t("empty")}</p>
      ) : (
        <div className="flex flex-col gap-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className="flex flex-col gap-3 rounded-[20px] bg-white p-6 shadow-[0_6px_18px_rgba(46,31,38,0.06)]"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <div className="text-base font-semibold">{m.name}</div>
                  <div className="text-sm text-[var(--color-muted-2)]">
                    <a href={`mailto:${m.email}`} className="hover:text-[var(--color-accent)]">
                      {m.email}
                    </a>{" "}
                    · {new Date(m.createdAt).toLocaleDateString(locale === "en" ? "en-US" : "sr-RS")}
                  </div>
                </div>
                <span className="rounded-full bg-[var(--color-accent-200)] px-3.5 py-1.5 text-[13px] font-semibold text-[var(--color-accent-700)]">
                  {m.topic}
                </span>
              </div>
              <p className="border-t border-[var(--color-border)] pt-3.5 text-[15px] leading-relaxed whitespace-pre-wrap text-[var(--color-text)]">
                {m.message}
              </p>
              <div className="flex items-center justify-between pt-1">
                <a
                  href={`mailto:${m.email}`}
                  className="text-sm font-semibold text-[var(--color-accent-700)] hover:underline"
                >
                  {t("replyHint")} {m.email}
                </a>
                <form action={removeContactMessage}>
                  <input type="hidden" name="id" value={m.id} />
                  <button
                    type="submit"
                    className="btn-interactive h-8 rounded-full border-[1.5px] border-[var(--color-border)] px-3.5 text-[13px] font-semibold text-[var(--color-accent-700)]"
                  >
                    {t("deleteButton")}
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
