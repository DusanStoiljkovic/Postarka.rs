import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { PhotoPlaceholder } from "@/components/photo-placeholder";
import { localizedField } from "@/lib/localized-field";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Metadata");
  return { title: t("aboutTitle"), description: t("aboutDescription") };
}

export default async function AboutPage() {
  const t = await getTranslations("About");
  const locale = await getLocale();
  const about = await prisma.aboutContent.findFirst();

  const paragraph1 = localizedField(locale, about?.paragraph1 ?? "", about?.paragraph1En) || t("paragraph1");
  const paragraph2 = localizedField(locale, about?.paragraph2 ?? "", about?.paragraph2En) || t("paragraph2");
  const wholesaleText =
    localizedField(locale, about?.wholesaleText ?? "", about?.wholesaleTextEn) || t("wholesaleText");

  const STEPS = [
    { n: 1, title: t("step1Title"), text: t("step1Text") },
    { n: 2, title: t("step2Title"), text: t("step2Text") },
    { n: 3, title: t("step3Title"), text: t("step3Text") },
  ];

  return (
    <div className="flex flex-col gap-16 pb-16">
      <section className="grid gap-14 px-6 pt-13 sm:px-10 md:grid-cols-2 md:items-center">
        <div className="flex flex-col gap-5">
          <div className="text-xs font-medium tracking-[0.12em] text-[var(--color-muted-2)] uppercase">
            {t("eyebrow")}
          </div>
          <h1 className="font-display text-[42px] leading-[1.08] sm:text-[52px]">
            {t("titleLine1")}
            <br />
            {t("titleLine2")}
          </h1>
          <p className="text-[17px] leading-relaxed text-[var(--color-muted)]">{paragraph1}</p>
          <p className="text-[17px] leading-relaxed text-[var(--color-muted)]">{paragraph2}</p>
        </div>
        <AboutPhoto src={about?.portraitImage} alt={t("portraitAlt")} placeholder={t("portraitPlaceholder")} className="h-[320px] sm:h-[420px]" />
      </section>

      <section className="px-6 sm:px-10">
        <h2 className="mb-7 font-display text-4xl">
          {t("stepsHeading")}
        </h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {STEPS.map((step) => (
            <div key={step.n} className="flex flex-col gap-3 rounded-[20px] bg-white p-7">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-accent-200)] font-display text-xl text-[var(--color-accent-700)]">
                {step.n}
              </div>
              <div className="text-lg font-semibold">{step.title}</div>
              <div className="text-[15px] leading-relaxed text-[var(--color-muted)]">
                {step.text}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 sm:px-10">
        <div className="grid gap-6 sm:grid-cols-2">
          <AboutPhoto src={about?.atelje1Image} alt={t("atelje1Placeholder")} placeholder={t("atelje1Placeholder")} className="h-[220px] sm:h-[260px]" />
          <AboutPhoto src={about?.atelje2Image} alt={t("atelje2Placeholder")} placeholder={t("atelje2Placeholder")} className="h-[220px] sm:h-[260px]" />
        </div>
      </section>

      <section id="veleprodaja" className="px-6 sm:px-10">
        <div className="flex flex-col gap-7 rounded-[24px] bg-[var(--color-dark)] p-9 sm:flex-row sm:items-center sm:justify-between sm:p-11">
          <div className="flex flex-col gap-2.5">
            <h2 className="font-display text-[32px] leading-tight text-[var(--color-bg)]">
              {t("wholesaleTitle")}
            </h2>
            <p className="max-w-[520px] text-base leading-relaxed text-[#D8C6C0]">
              {wholesaleText}
            </p>
          </div>
          <Link
            href="/kontakt?tema=Veleprodaja"
            className="btn-interactive flex h-13 shrink-0 items-center rounded-full bg-[var(--color-accent-200)] px-7.5 text-base font-semibold whitespace-nowrap text-[var(--color-accent-700)]"
          >
            {t("wholesaleCta")}
          </Link>
        </div>
      </section>
    </div>
  );
}

function AboutPhoto({
  src,
  alt,
  placeholder,
  className,
}: {
  src?: string | null;
  alt: string;
  placeholder: string;
  className?: string;
}) {
  if (!src) {
    return <PhotoPlaceholder label={placeholder} className={className} />;
  }
  return (
    <div className={`relative overflow-hidden rounded-[20px] bg-white ${className ?? ""}`}>
      <Image src={src} alt={alt} fill className="object-cover" />
    </div>
  );
}
