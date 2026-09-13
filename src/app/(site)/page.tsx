import Image from "next/image";
import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { formatRsd } from "@/lib/format";
import { ProductCard } from "@/components/product-card";
import { localizedField } from "@/lib/localized-field";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const t = await getTranslations("Home");
  const locale = await getLocale();
  const [newest, packages, totalCount] = await Promise.all([
    prisma.product.findMany({
      where: { kind: "postcard", status: { not: "skriveno" } },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
    prisma.product.findMany({
      where: { kind: "package" },
      orderBy: { price: "asc" },
    }),
    prisma.product.count({ where: { kind: "postcard", status: { not: "skriveno" } } }),
  ]);

  return (
    <div className="flex flex-col gap-18">
      {/* Hero */}
      <section className="grid gap-12 px-6 pt-12 pb-10 sm:px-10 md:grid-cols-2 md:items-center md:pt-16">
        <div className="flex flex-col gap-6">
          <span className="inline-flex w-fit items-center rounded-full bg-[var(--color-accent-200)] px-3.5 py-1.5 text-xs font-semibold tracking-wider text-[var(--color-accent-700)] uppercase">
            {t("badge")}
          </span>
          <h1 className="font-display text-[42px] leading-[1.08] sm:text-[56px] md:text-[62px]">
            {t("heroTitle")}
          </h1>
          <p className="max-w-[420px] text-lg leading-relaxed text-[var(--color-muted)]">
            {t("heroText")}
          </p>
          <div className="flex flex-wrap gap-3.5 pt-1.5">
            <Link
              href="/katalog"
              className="btn-interactive flex h-13 items-center rounded-full bg-[var(--color-accent)] px-7.5 text-base font-semibold text-white"
            >
              {t("ctaCatalog")}
            </Link>
            <Link
              href="/kontakt"
              className="btn-interactive flex h-13 items-center rounded-full border-[1.5px] border-[var(--color-border-2)] px-7.5 text-base font-semibold"
            >
              {t("ctaHowToOrder")}
            </Link>
          </div>
        </div>
        <div className="relative hidden h-[460px] md:block">
          <div className="hero-float-a absolute top-4.5 left-6 w-[330px] rounded-[14px] bg-white p-3 shadow-[0_18px_38px_rgba(46,31,38,0.16)]">
            <div className="relative h-[224px] w-full overflow-hidden rounded-lg">
              <Image src="/uploads/photos-1789213052876-xj03.jpeg" alt="Vile na livadi" fill className="object-contain" />
            </div>
          </div>
          <div className="hero-float-b absolute top-[150px] left-[210px] w-[300px] rounded-[14px] bg-white p-3 shadow-[0_22px_44px_rgba(46,31,38,0.18)] lg:w-[360px]">
            <div className="relative h-[224px] w-full overflow-hidden rounded-lg lg:h-[244px]">
              <Image src="/uploads/photos-1789213046431-nwo7.jpeg" alt="Osam koktela" fill className="object-contain" />
            </div>
          </div>
          <div className="hero-float-c absolute top-[226px] left-[30px] w-[240px] rounded-[14px] bg-white p-2.5 shadow-[0_18px_38px_rgba(46,31,38,0.14)] lg:w-[270px]">
            <div className="relative h-[160px] w-full overflow-hidden rounded-lg lg:h-[182px]">
              <Image src="/uploads/photos-1789213052897-j124.jpeg" alt="Lokvanji" fill className="object-contain" />
            </div>
          </div>
        </div>
      </section>

      {/* Feature strip */}
      <section className="px-6 sm:px-10">
        <div className="grid gap-px overflow-hidden rounded-[20px] bg-[var(--color-border)] sm:grid-cols-3">
          <div className="flex flex-col gap-1.5 bg-[var(--color-bg)] p-6.5">
            <div className="font-display text-[22px] text-[var(--color-accent)]">
              {t("feature1Title")}
            </div>
            <div className="text-[15px] text-[var(--color-muted)]">
              {t("feature1Text")}
            </div>
          </div>
          <div className="flex flex-col gap-1.5 bg-[var(--color-bg)] p-6.5">
            <div className="font-display text-[22px] text-[var(--color-accent)]">
              {t("feature2Title")}
            </div>
            <div className="text-[15px] text-[var(--color-muted)]">
              {t("feature2Text")}
            </div>
          </div>
          <div className="flex flex-col gap-1.5 bg-[var(--color-bg)] p-6.5">
            <div className="font-display text-[22px] text-[var(--color-accent)]">
              {t("feature3Title")}
            </div>
            <div className="text-[15px] text-[var(--color-muted)]">
              {t("feature3Text")}
            </div>
          </div>
        </div>
      </section>

      {/* Novo u prodavnici */}
      <section className="px-6 sm:px-10">
        <div className="mb-7 flex items-end justify-between">
          <h2 className="font-display text-3xl sm:text-[38px]">
            {t("newInShop")}
          </h2>
          <Link href="/katalog" className="text-sm font-semibold text-[var(--color-accent-700)]">
            {t("allPostcardsLink")}
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {newest.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        {totalCount === 0 && (
          <p className="text-[var(--color-muted)]">{t("emptyShop")}</p>
        )}
      </section>

      {/* Postcrossing packages */}
      {packages.length > 0 && (
        <section id="paketi" className="px-6 sm:px-10">
          <div className="grid gap-9 rounded-[24px] bg-[var(--color-dark)] p-9 sm:p-11 md:grid-cols-[1.2fr_1fr] md:items-center">
            <div className="flex flex-col gap-3.5">
              <h2 className="font-display text-[34px] leading-tight text-[var(--color-bg)]">
                {t("forPostcrossing")}
              </h2>
              <p className="text-[17px] leading-relaxed text-[#D8C6C0]">
                {t("postcrossingText")}
              </p>
            </div>
            <div className="flex flex-col gap-3">
              {packages.map((pkg) => {
                const stripped = localizedField(locale, pkg.title, pkg.titleEn).replace(
                  /^Postcrossing\s+/i,
                  "",
                );
                const title = stripped.charAt(0).toUpperCase() + stripped.slice(1);
                return (
                  <Link
                    key={pkg.id}
                    href={`/katalog/${pkg.slug}`}
                    className="flex items-center justify-between rounded-2xl bg-[var(--color-dark-2)] px-5.5 py-4.5"
                  >
                    <div className="text-base font-semibold text-[var(--color-bg)]">
                      {title}
                    </div>
                    <div className="text-base font-semibold text-[#F0A7BF]">
                      {formatRsd(pkg.price)}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Reviews */}
      <section className="px-6 sm:px-10">
        <h2 className="mb-7 font-display text-3xl sm:text-[38px]">
          {t("reviewsHeading")}
        </h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {(["review1", "review2", "review3"] as const).map((key) => (
            <div key={key} className="flex flex-col gap-3.5 rounded-[20px] bg-white p-7">
              <div className="text-[15px] tracking-[0.2em] text-[var(--color-accent)]">
                ★★★★★
              </div>
              <p className="text-base leading-relaxed text-[#4A3A40]">{t(`${key}Quote`)}</p>
              <div className="text-sm font-semibold text-[var(--color-muted-2)]">
                {t(`${key}Author`)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Instagram */}
      <section className="px-6 pb-4 sm:px-10">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-display text-[30px]">@postarka</h2>
          <a
            href="https://instagram.com/postarka"
            target="_blank"
            rel="noreferrer"
            className="text-sm font-semibold text-[var(--color-accent-700)]"
          >
            {t("instagramFollow")}
          </a>
        </div>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {INSTAGRAM_IMAGES.map((src) => (
            <div key={src} className="relative h-[110px] overflow-hidden rounded-[14px] sm:h-[150px]">
              <Image
                src={src}
                alt=""
                fill
                className="object-cover transition-transform duration-500 ease-out hover:scale-110 hover:rotate-2"
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

const INSTAGRAM_IMAGES = [
  "/uploads/photos-1789213053938-bqr2.jpeg",
  "/uploads/photos-1789213046477-sye5.jpeg",
  "/uploads/photos-1789213053946-uhuf.jpeg",
  "/uploads/photos-1789213046485-t6rp.jpeg",
  "/uploads/photos-1789213053900-rnn0.jpeg",
  "/uploads/photos-1789213046467-atsv.jpeg",
];
