import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { formatRsd } from "@/lib/format";
import { AddToCart } from "@/components/add-to-cart";
import { ProductCard } from "@/components/product-card";
import { PostcardFlipCard } from "@/components/postcard-flip-card";
import { localizedField } from "@/lib/localized-field";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product || product.status === "skriveno") return {};

  const locale = await getLocale();
  const title = localizedField(locale, product.title, product.titleEn);
  const description = localizedField(locale, product.description ?? "", product.descriptionEn);

  return {
    title: `${title} — Poštarka`,
    description: description || undefined,
    openGraph: {
      title,
      description: description || undefined,
      images: [{ url: product.image }],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product || product.status === "skriveno") notFound();

  const t = await getTranslations("Product");
  const tTheme = await getTranslations("Theme");
  const locale = await getLocale();

  const related =
    product.kind === "postcard"
      ? await prisma.product.findMany({
          where: {
            kind: "postcard",
            status: { not: "skriveno" },
            slug: { not: product.slug },
            ...(product.theme ? { theme: product.theme } : {}),
          },
          take: 4,
        })
      : [];

  const soldOut = product.status === "rasprodato";
  const isPostcard = product.kind === "postcard";
  const title = localizedField(locale, product.title, product.titleEn);
  const description = localizedField(locale, product.description ?? "", product.descriptionEn);

  return (
    <div className="flex flex-col gap-16 pb-16">
      <div className="px-6 pt-7 text-sm text-[var(--color-muted-2)] sm:px-10">
        <Link href="/katalog">{t("breadcrumbPostcards")}</Link>
        {product.theme && (
          <>
            {" · "}
            <Link href={`/katalog?tema=${encodeURIComponent(product.theme)}`}>
              {tTheme(product.theme)}
            </Link>
          </>
        )}
        {" · "}
        <span className="text-[var(--color-text)]">{title}</span>
      </div>

      <div className="grid gap-14 px-6 sm:px-10 md:grid-cols-2">
        {isPostcard ? (
          <PostcardFlipCard image={product.image} title={title} soldOut={soldOut} />
        ) : (
          <div className="relative h-[300px] overflow-hidden rounded-[22px] bg-white p-4 shadow-[0_14px_34px_rgba(46,31,38,0.10)] sm:h-[380px]">
            <div className="relative h-full w-full overflow-hidden rounded-[14px]">
              <Image
                src={product.image}
                alt={title}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        )}

        <div className="flex flex-col gap-5.5">
          <div className="flex flex-col gap-3">
            {isPostcard && (
              <span className="inline-flex w-fit items-center rounded-full bg-[var(--color-accent-200)] px-3.5 py-1.5 text-xs font-semibold tracking-wider text-[var(--color-accent-700)] uppercase">
                {product.type === "unikat"
                  ? t("uniqueBadge")
                  : product.edition
                    ? t("seriesBadge", { edition: product.edition, stock: product.stock })
                    : t("smallSeriesBadge")}
              </span>
            )}
            <h1 className="font-display text-[36px] sm:text-[44px]">
              {title}
            </h1>
            {description && (
              <p className="text-[17px] leading-relaxed text-[var(--color-muted)]">
                {description}
              </p>
            )}
          </div>

          <div className="font-display text-[30px] text-[var(--color-accent)]">
            {formatRsd(product.price)}
          </div>

          <AddToCart
            productId={product.id}
            slug={product.slug}
            kind={product.kind}
            title={title}
            price={product.price}
            image={product.image}
            stock={product.stock}
            soldOut={soldOut}
          />

          <p className="text-sm leading-relaxed text-[var(--color-muted-2)]">
            {t.rich("shippingNote", {
              handle: (chunks) => (
                <a
                  href="https://instagram.com/postarka"
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-[var(--color-accent-700)]"
                >
                  {chunks}
                </a>
              ),
            })}
          </p>

          {isPostcard && (
            <div className="mt-1.5 flex flex-col border-t border-[var(--color-border)]">
              <Row label={t("formatLabel")} value={t("formatValue")} />
              <Row label={t("paperLabel")} value={t("paperValue")} />
              <Row label={t("backLabel")} value={t("backValue")} />
              <Row
                label={t("editionLabel")}
                value={
                  product.type === "unikat"
                    ? t("editionUnique")
                    : t("editionSeries", { edition: product.edition ?? "—" })
                }
              />
            </div>
          )}

          <div className="flex flex-col gap-2 rounded-[18px] bg-white p-6">
            <div className="text-[15px] font-semibold">
              {t("directSendTitle")}
            </div>
            <div className="text-[15px] leading-relaxed text-[var(--color-muted)]">
              {t("directSendText")}
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="px-6 sm:px-10">
          <h2 className="mb-6 font-display text-[32px]">{t("relatedHeading")}</h2>
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-[var(--color-border)] py-4 text-[15px]">
      <span className="text-[var(--color-muted-2)]">{label}</span>
      <span>{value}</span>
    </div>
  );
}
