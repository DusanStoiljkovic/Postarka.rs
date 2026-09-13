import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { formatRsd } from "@/lib/format";
import { ExportButton } from "@/components/admin/export-button";
import { ImageChangeCell } from "@/components/admin/image-change-cell";
import { ImageDropField } from "@/components/admin/image-drop-field";
import {
  addProduct,
  decrementStock,
  incrementStock,
  removeProduct,
  updateProductImage,
} from "@/lib/actions/admin-products";

export const dynamic = "force-dynamic";

const THEMES = ["Životinje", "Hrana", "Priroda", "Praznici", "Bajke"];

const STATUS_DOT: Record<string, { bg: string; fg: string; dot: string }> = {
  stanju: { bg: "#E4EEDC", fg: "#4B5C38", dot: "#8DA07C" },
  rasprodato: { bg: "#F6D3DE", fg: "#9E3D5E", dot: "#C8547B" },
  skriveno: { bg: "#EFE7E4", fg: "#6B5D58", dot: "#A89791" },
};

export default async function AdminProductsPage() {
  const t = await getTranslations("Admin");
  const tStatus = await getTranslations("ProductStatus");
  const tType = await getTranslations("ProductType");
  const tTheme = await getTranslations("Theme");

  const items = await prisma.product.findMany({
    where: { kind: "postcard" },
    orderBy: { createdAt: "desc" },
  });

  const inStockCount = items.filter((i) => i.status === "stanju" && i.stock > 0).length;
  const hiddenCount = items.filter((i) => i.status === "skriveno").length;
  const soldOutCount = items.filter((i) => i.status === "rasprodato").length;
  const totalStock = items.reduce((n, i) => n + i.stock, 0);
  const summary = t("summary", { count: items.length, inStock: inStockCount, soldOut: soldOutCount });

  return (
    <div className="pb-16">
      <div className="flex flex-col items-start justify-between gap-6 px-6 pt-9 sm:flex-row sm:items-end sm:px-10">
        <div className="flex flex-col gap-1.5">
          <h1 className="font-display text-4xl">{t("heading")}</h1>
          <p className="text-base text-[var(--color-muted)]">{summary}</p>
        </div>
        <div className="flex gap-2.5">
          <ExportButton
            rows={items.map((i) => ({
              title: i.title,
              type: tType(i.type === "unikat" ? "unikat" : "serija"),
              price: i.price,
              stock: i.stock,
              status: tStatus(i.status),
            }))}
          />
          <a
            href="#dodaj-razglednicu"
            className="btn-interactive flex h-11 items-center gap-2 rounded-full bg-[var(--color-accent)] px-5.5 text-sm font-semibold text-white"
          >
            {t("newPostcardCta")}
          </a>
        </div>
      </div>

      <form
        id="dodaj-razglednicu"
        action={addProduct}
        className="mx-6 mt-7 flex scroll-mt-6 flex-col gap-4.5 rounded-[22px] bg-white p-6.5 shadow-[0_10px_28px_rgba(46,31,38,0.07)] sm:mx-10"
      >
        <div className="text-base font-semibold">{t("addFormTitle")}</div>
        <div className="grid items-end gap-3.5 sm:grid-cols-[1.3fr_1.3fr_0.9fr_0.9fr_0.9fr_0.9fr_1.5fr_auto]">
          <Labeled label={t("nameLabel")}>
            <input name="title" required placeholder={t("namePlaceholder")} className="admin-input" />
          </Labeled>
          <Labeled label={t("nameEnLabel")}>
            <input name="titleEn" placeholder={t("namePlaceholder")} className="admin-input" />
          </Labeled>
          <Labeled label={t("priceLabel")}>
            <input name="price" type="number" placeholder="320" className="admin-input" />
          </Labeled>
          <Labeled label={t("stockLabel")}>
            <input name="stock" type="number" placeholder="20" className="admin-input" />
          </Labeled>
          <Labeled label={t("typeLabel")}>
            <select name="type" defaultValue="serija" className="admin-input">
              <option value="serija">{t("typeSeries")}</option>
              <option value="unikat">{t("typeUnique")}</option>
            </select>
          </Labeled>
          <Labeled label={t("themeLabel")}>
            <select name="theme" defaultValue="" className="admin-input">
              <option value="">{t("themeNone")}</option>
              {THEMES.map((th) => (
                <option key={th} value={th}>
                  {tTheme(th)}
                </option>
              ))}
            </select>
          </Labeled>
          <ImageDropField name="image" required />
          <button
            type="submit"
            className="btn-interactive h-11.5 rounded-full bg-[var(--color-dark)] px-6.5 text-[15px] font-semibold text-[var(--color-bg)]"
          >
            {t("addButton")}
          </button>
        </div>
        <p className="text-[13px] text-[var(--color-muted-2)]">{t("addFormHint")}</p>
      </form>

      <div className="mx-6 mt-7 overflow-hidden rounded-[22px] bg-white shadow-[0_10px_28px_rgba(46,31,38,0.07)] sm:mx-10">
        <div className="grid grid-cols-[56px_1fr_100px_90px_130px_130px_140px] gap-4 bg-[var(--color-card-alt-2)] px-6.5 py-4 text-xs font-semibold tracking-wider text-[var(--color-muted-2)] uppercase">
          <div>{t("colImage")}</div>
          <div>{t("colName")}</div>
          <div>{t("colType")}</div>
          <div>{t("colPrice")}</div>
          <div>{t("colStock")}</div>
          <div>{t("colStatus")}</div>
          <div className="text-right">{t("colAction")}</div>
        </div>
        {items.map((p, i) => {
          const st = STATUS_DOT[p.status] ?? STATUS_DOT.stanju;
          return (
            <div
              key={p.id}
              style={{ animationDelay: `${Math.min(i, 12) * 35}ms` }}
              className="admin-row-enter grid grid-cols-[56px_1fr_100px_90px_130px_130px_140px] items-center gap-4 border-t border-[#F1E6E0] px-6.5 py-3.5 transition-colors duration-200 hover:bg-[var(--color-card-alt-2)]"
            >
              <ImageChangeCell id={p.id} image={p.image} action={updateProductImage} />
              <Link
                href={`/admin/razglednice/${p.id}`}
                className="text-base font-semibold hover:text-[var(--color-accent)]"
              >
                {p.title}
              </Link>
              <div>
                <span className="inline-flex items-center rounded-full bg-[var(--color-card-alt)] px-2.5 py-1 text-[11px] font-semibold tracking-wide text-[var(--color-muted)]">
                  {tType(p.type === "unikat" ? "unikat" : "serija")}
                </span>
              </div>
              <div className="text-[15px] font-medium">{formatRsd(p.price)}</div>
              <div className="flex items-center gap-3">
                <form action={decrementStock}>
                  <input type="hidden" name="id" value={p.id} />
                  <button
                    type="submit"
                    className="h-7.5 w-7.5 rounded-full border-[1.5px] border-[var(--color-border-3)] text-[15px] font-semibold text-[var(--color-muted)]"
                  >
                    −
                  </button>
                </form>
                <span className="min-w-[22px] text-center text-[15px] font-semibold">
                  {p.stock}
                </span>
                <form action={incrementStock}>
                  <input type="hidden" name="id" value={p.id} />
                  <button
                    type="submit"
                    className="h-7.5 w-7.5 rounded-full border-[1.5px] border-[var(--color-border-3)] text-[15px] font-semibold text-[var(--color-muted)]"
                  >
                    +
                  </button>
                </form>
              </div>
              <div>
                <span
                  style={{ background: st.bg, color: st.fg }}
                  className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] font-semibold"
                >
                  <span
                    style={{ background: st.dot }}
                    className={`h-1.5 w-1.5 rounded-full ${p.status === "stanju" ? "status-dot-pulse" : ""}`}
                  />
                  {tStatus(p.status)}
                </span>
              </div>
              <div className="flex justify-end gap-2">
                <Link
                  href={`/admin/razglednice/${p.id}`}
                  className="btn-interactive flex h-8 items-center rounded-full border-[1.5px] border-[var(--color-border-3)] px-3.5 text-[13px] font-semibold text-[var(--color-muted)]"
                >
                  {t("editButton")}
                </Link>
                <form action={removeProduct}>
                  <input type="hidden" name="id" value={p.id} />
                  <button
                    type="submit"
                    className="btn-interactive h-8 rounded-full border-[1.5px] border-[var(--color-border)] px-3.5 text-[13px] font-semibold text-[var(--color-accent-700)]"
                  >
                    {t("deleteButton")}
                  </button>
                </form>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mx-6 mt-7 flex flex-col gap-4 sm:mx-10 sm:flex-row">
        <Tile value={inStockCount} label={t("tileInStock")} bg="var(--color-accent-200)" fg="var(--color-accent-700)" />
        <Tile value={totalStock} label={t("tileTotalStock")} bg="#fff" fg="var(--color-accent)" />
        <Tile value={hiddenCount} label={t("tileHidden")} bg="#fff" fg="var(--color-muted-2)" />
      </div>

      <div
        className="mx-6 mt-7 rounded-[18px] bg-[var(--color-card-alt-2)] p-6.5 text-[15px] leading-relaxed text-[var(--color-muted)] sm:mx-10 [&_b]:font-semibold [&_b]:text-[var(--color-text)]"
        dangerouslySetInnerHTML={{ __html: t.raw("statusHelpText") }}
      />
    </div>
  );
}

function Labeled({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[13px] font-medium text-[var(--color-muted)]">{label}</span>
      {children}
    </label>
  );
}

function Tile({
  value,
  label,
  bg,
  fg,
}: {
  value: number;
  label: string;
  bg: string;
  fg: string;
}) {
  return (
    <div className="flex flex-1 flex-col gap-1.5 rounded-[18px] p-6" style={{ background: bg }}>
      <div className="font-display text-[26px]" style={{ color: fg }}>
        {value}
      </div>
      <div className="text-[15px] text-[var(--color-muted)]">{label}</div>
    </div>
  );
}
