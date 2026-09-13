import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { ContactForm } from "./contact-form";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Metadata");
  return { title: t("contactTitle"), description: t("contactDescription") };
}

export default async function ContactPage() {
  const t = await getTranslations("Contact");

  const FAQ = [
    { q: t("faq1Q"), a: t("faq1A") },
    { q: t("faq2Q"), a: t("faq2A") },
    { q: t("faq3Q"), a: t("faq3A") },
  ];

  return (
    <div className="grid gap-14 px-6 pt-13 pb-16 sm:px-10 md:grid-cols-2 md:items-start">
      <div className="flex flex-col gap-5">
        <h1 className="font-display text-[44px] sm:text-[48px]">{t("title")}</h1>
        <p className="text-[17px] leading-relaxed text-[var(--color-muted)]">
          {t("subtitle")}
        </p>
        <Suspense fallback={null}>
          <ContactForm />
        </Suspense>
      </div>

      <div className="flex flex-col gap-4">
        <InfoCard title={t("infoEmailTitle")} value={t("infoEmailValue")} />
        <InfoCard title={t("infoInstagramTitle")} value={t("infoInstagramValue")} />
        <InfoCard title={t("infoPostcrossingTitle")} value={t("infoPostcrossingValue")} />

        <div className="mt-2 flex flex-col gap-4.5 rounded-[20px] bg-[var(--color-accent-200)] p-7">
          <div className="font-display text-2xl text-[var(--color-accent-700)]">
            {t("faqTitle")}
          </div>
          <div className="flex flex-col gap-3.5">
            {FAQ.map((f) => (
              <div key={f.q} className="flex flex-col gap-1">
                <div className="text-[15px] font-semibold">{f.q}</div>
                <div className="text-[15px] leading-relaxed text-[var(--color-muted)]">
                  {f.a}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="flex flex-col gap-2 rounded-[20px] bg-white p-6.5">
      <div className="text-base font-semibold">{title}</div>
      <div className="text-base text-[var(--color-muted)]">{value}</div>
    </div>
  );
}
