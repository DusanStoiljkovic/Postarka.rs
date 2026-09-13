import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { formatRsd } from "@/lib/format";
import { localizedField } from "@/lib/localized-field";

export type ProductCardData = {
  slug: string;
  title: string;
  titleEn: string | null;
  kind: string;
  type: string | null;
  theme: string | null;
  price: number;
  stock: number;
  edition: number | null;
  status: string;
  image: string;
};

function Badge({ product, t }: { product: ProductCardData; t: ReturnType<typeof useTranslations<"ProductCard">> }) {
  if (product.kind === "package") {
    return (
      <span className="absolute top-4.5 left-4.5 rounded-full bg-[var(--color-dark)] px-2.5 py-1 text-[11px] font-semibold tracking-wide text-[var(--color-bg)]">
        {t("packageBadge")}
      </span>
    );
  }
  if (product.type === "unikat") {
    return (
      <span className="absolute top-4.5 left-4.5 rounded-full bg-[var(--color-dark)] px-2.5 py-1 text-[11px] font-semibold tracking-wide text-[var(--color-bg)]">
        {t("uniqueBadge")}
      </span>
    );
  }
  if (product.type === "serija" && product.edition) {
    return (
      <span className="absolute top-4.5 left-4.5 rounded-full bg-[var(--color-accent-200)] px-2.5 py-1 text-[11px] font-semibold tracking-wide text-[var(--color-accent-700)]">
        {t("seriesBadge", { edition: product.edition })}
      </span>
    );
  }
  return null;
}

export function useAvailabilityLabel() {
  const t = useTranslations("ProductCard");
  return (product: ProductCardData) => {
    if (product.status === "rasprodato") return t("availabilityArchived");
    if (product.kind === "package") return t("availabilityPackage");
    if (product.type === "unikat") return t("availabilityLast");
    return t("availabilityStock", { stock: product.stock });
  };
}

export function ProductCard({ product }: { product: ProductCardData }) {
  const t = useTranslations("ProductCard");
  const locale = useLocale();
  const availabilityLabel = useAvailabilityLabel();
  const soldOut = product.status === "rasprodato";
  const title = localizedField(locale, product.title, product.titleEn);

  return (
    <Link href={`/katalog/${product.slug}`} className="group flex flex-col gap-3">
      <div className="relative rounded-[18px] bg-white p-2.5 shadow-[0_6px_18px_rgba(46,31,38,0.07)] transition-all duration-300 ease-out group-hover:-translate-y-1.5 group-hover:rotate-1 group-hover:shadow-[0_18px_36px_rgba(46,31,38,0.2)]">
        <div className="relative h-[190px] w-full overflow-hidden rounded-[11px]">
          <Image
            src={product.image}
            alt={title}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className={`object-contain ${soldOut ? "opacity-55 saturate-75" : ""}`}
          />
          {soldOut && (
            <div className="absolute inset-2.5 flex items-center justify-center rounded-[11px] text-center text-xs font-semibold tracking-wide text-[var(--color-muted)] uppercase">
              {t("soldOutLabel")}
            </div>
          )}
        </div>
        {!soldOut && <Badge product={product} t={t} />}
      </div>
      <div className="flex flex-col gap-0.5">
        <div
          className={`text-base font-semibold ${soldOut ? "text-[var(--color-muted-2)]" : ""}`}
        >
          {title}
        </div>
        <div
          className={`text-sm ${soldOut ? "text-[var(--color-muted-3)]" : "text-[var(--color-muted-2)]"}`}
        >
          {soldOut
            ? availabilityLabel(product)
            : `${formatRsd(product.price)} · ${availabilityLabel(product)}`}
        </div>
      </div>
    </Link>
  );
}
