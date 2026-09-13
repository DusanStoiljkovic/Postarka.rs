import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { localizedField } from "@/lib/localized-field";
import { formatDate } from "@/lib/format-date";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Metadata");
  return { title: t("blogTitle"), description: t("blogDescription") };
}

export default async function BlogPage() {
  const t = await getTranslations("Blog");
  const locale = await getLocale();

  const posts = await prisma.blogPost.findMany({
    where: { status: { not: "skriveno" } },
    orderBy: { createdAt: "desc" },
  });

  const [featured, ...rest] = posts;

  return (
    <div className="flex flex-col gap-9 pb-16">
      <div className="flex flex-col gap-2.5 px-6 pt-13 sm:px-10">
        <h1 className="font-display text-[44px] sm:text-[48px]">{t("title")}</h1>
        <p className="max-w-[520px] text-[17px] leading-relaxed text-[var(--color-muted)]">
          {t("subtitle")}
        </p>
      </div>

      {!featured ? (
        <p className="px-6 text-[var(--color-muted)] sm:px-10">{t("noPosts")}</p>
      ) : (
        <>
          <div className="px-6 sm:px-10">
            <Link
              href={`/dnevnik/${featured.slug}`}
              className="grid gap-9 rounded-[24px] bg-white p-5 shadow-[0_10px_28px_rgba(46,31,38,0.08)] md:grid-cols-[1.2fr_1fr] md:items-center"
            >
              <div className="relative h-[220px] overflow-hidden rounded-2xl bg-white sm:h-[300px]">
                <Image
                  src={featured.image}
                  alt={localizedField(locale, featured.title, featured.titleEn)}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col gap-3.5 md:pr-6">
                <div className="flex items-center gap-2.5 text-[13px] text-[var(--color-muted-2)]">
                  {featured.tag && (
                    <span className="rounded-full bg-[var(--color-accent-200)] px-2.5 py-1 font-semibold text-[var(--color-accent-700)]">
                      {featured.tag}
                    </span>
                  )}
                  <span>{formatDate(featured.createdAt, locale)}</span>
                </div>
                <h2 className="font-display text-[30px] leading-tight">
                  {localizedField(locale, featured.title, featured.titleEn)}
                </h2>
                <p className="text-base leading-relaxed text-[var(--color-muted)]">
                  {localizedField(locale, featured.excerpt ?? "", featured.excerptEn)}
                </p>
                <span className="text-sm font-semibold text-[var(--color-accent-700)]">
                  {t("readMore")}
                </span>
              </div>
            </Link>
          </div>

          {rest.length > 0 && (
            <div className="grid gap-6.5 px-6 sm:grid-cols-3 sm:px-10">
              {rest.map((post) => (
                <Link key={post.id} href={`/dnevnik/${post.slug}`} className="group flex flex-col gap-3.5">
                  <div className="relative h-[190px] overflow-hidden rounded-[18px] bg-white transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_14px_28px_rgba(46,31,38,0.16)]">
                    <Image
                      src={post.image}
                      alt={localizedField(locale, post.title, post.titleEn)}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="flex items-center gap-2.5 text-[13px] text-[var(--color-muted-2)]">
                    {post.tag && (
                      <span className="rounded-full bg-[var(--color-border)] px-2.5 py-1 font-semibold text-[var(--color-muted)]">
                        {post.tag}
                      </span>
                    )}
                    <span>{formatDate(post.createdAt, locale)}</span>
                  </div>
                  <div className="font-display text-[22px] leading-snug">
                    {localizedField(locale, post.title, post.titleEn)}
                  </div>
                  <p className="text-[15px] leading-relaxed text-[var(--color-muted)]">
                    {localizedField(locale, post.excerpt ?? "", post.excerptEn)}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
