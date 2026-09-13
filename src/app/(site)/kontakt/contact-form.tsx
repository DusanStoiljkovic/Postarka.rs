"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { sendContactMessage } from "@/lib/actions/send-message";

const TOPICS = [
  { value: "Porudžbina", key: "topicOrder" },
  { value: "Veleprodaja", key: "topicWholesale" },
  { value: "Saradnja", key: "topicCollaboration" },
  { value: "Drugo", key: "topicOther" },
] as const;

export function ContactForm() {
  const t = useTranslations("Contact");
  const searchParams = useSearchParams();
  const initialTopic = searchParams.get("tema");
  const [topic, setTopic] = useState(
    initialTopic && TOPICS.some((o) => o.value === initialTopic)
      ? initialTopic
      : TOPICS[0].value,
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    const result = await sendContactMessage({ name, email, topic, message });
    if (result.ok) {
      setStatus("sent");
      setName("");
      setEmail("");
      setMessage("");
    } else {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-2xl bg-[var(--color-accent-200)] p-6 text-[15px] font-medium text-[var(--color-accent-700)]">
        {t("successMessage")}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 pt-2">
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-[var(--color-muted)]">{t("nameLabel")}</span>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t("namePlaceholder")}
          className="input"
        />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-[var(--color-muted)]">{t("emailLabel")}</span>
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("emailPlaceholder")}
          className="input"
        />
      </label>
      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-[var(--color-muted)]">{t("topicLabel")}</span>
        <div className="flex flex-wrap gap-2">
          {TOPICS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setTopic(opt.value)}
              className={`h-9 rounded-full px-4 text-[13px] font-semibold ${
                topic === opt.value
                  ? "bg-[var(--color-dark)] text-[var(--color-bg)]"
                  : "border-[1.5px] border-[var(--color-border-3)] text-[var(--color-muted)]"
              }`}
            >
              {t(opt.key)}
            </button>
          ))}
        </div>
      </div>
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-[var(--color-muted)]">{t("messageLabel")}</span>
        <textarea
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={t("messagePlaceholder")}
          rows={5}
          className="input h-auto rounded-[20px] py-4"
        />
      </label>
      {status === "error" && (
        <p className="text-sm text-[var(--color-accent-700)]">
          {t("errorMessage")}
        </p>
      )}
      <button
        type="submit"
        disabled={status === "sending"}
        className="btn-interactive mt-1.5 flex h-13 w-[180px] items-center justify-center rounded-full bg-[var(--color-accent)] text-base font-semibold text-white disabled:opacity-60"
      >
        {status === "sending" ? t("submitButtonLoading") : t("submitButton")}
      </button>
    </form>
  );
}
