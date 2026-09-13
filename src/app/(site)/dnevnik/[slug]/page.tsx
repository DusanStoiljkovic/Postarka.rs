import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { localizedField } from "@/lib/localized-field";
import { formatDate } from "@/lib/format-date";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post || post.status === "skriveno") return {};

  const locale = await getLocale();
  const title = localizedField(locale, post.title, post.titleEn);
  const description = localizedField(locale, post.excerpt ?? "", post.excerptEn);

  return {
    title: `${title} — Poštarka`,
    description: description || undefined,
    openGraph: {
      title,
      description: description || undefined,
      images: [{ url: post.image }],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post || post.status === "skriveno") notFound();

  const t = await getTranslations("Blog");
  const locale = await getLocale();
  const title = localizedField(locale, post.title, post.titleEn);
  const content = localizedField(locale, post.content ?? post.excerpt ?? "", post.contentEn ?? post.excerptEn);

  return (
    <div className="mx-auto flex max-w-[720px] flex-col gap-7 px-6 pt-13 pb-16 sm:px-10">
      <Link href="/dnevnik" className="text-sm font-semibold text-[var(--color-muted-2)] hover:text-[var(--color-text)]">
        {t("backToBlog")}
      </Link>

      <div className="flex items-center gap-2.5 text-[13px] text-[var(--color-muted-2)]">
        {post.tag && (
          <span className="rounded-full bg-[var(--color-accent-200)] px-2.5 py-1 font-semibold text-[var(--color-accent-700)]">
            {post.tag}
          </span>
        )}
        <span>{formatDate(post.createdAt, locale)}</span>
      </div>

      <h1 className="font-display text-[36px] leading-tight sm:text-[44px]">{title}</h1>

      <div className="relative h-[280px] overflow-hidden rounded-[22px] bg-white shadow-[0_14px_34px_rgba(46,31,38,0.10)] sm:h-[380px]">
        <Image src={post.image} alt={title} fill className="object-contain" />
      </div>

      {content && (
        <p className="text-[17px] leading-relaxed whitespace-pre-wrap text-[var(--color-muted)]">
          {content}
        </p>
      )}
    </div>
  );
}
