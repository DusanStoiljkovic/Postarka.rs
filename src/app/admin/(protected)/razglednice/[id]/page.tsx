import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { ImageDropField } from "@/components/admin/image-drop-field";
import { removeProduct, updateProduct } from "@/lib/actions/admin-products";

export const dynamic = "force-dynamic";

const THEMES = ["Životinje", "Hrana", "Priroda", "Praznici", "Bajke"];
const STATUSES = ["stanju", "rasprodato", "skriveno"];

export default async function EditPostcardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id: Number(id) } });
  if (!product || product.kind !== "postcard") notFound();

  const t = await getTranslations("Admin");
  const tTheme = await getTranslations("Theme");
  const tType = await getTranslations("ProductType");
  const tStatus = await getTranslations("ProductStatus");

  return (
    <div className="pb-16">
      <div className="px-6 pt-9 sm:px-10">
        <Link href="/admin" className="text-sm font-semibold text-[var(--color-muted-2)] hover:text-[var(--color-text)]">
          {t("backToList")}
        </Link>
        <h1 className="mt-2 font-display text-4xl">
          {t("editPageTitle")} — {product.title}
        </h1>
      </div>

      <form
        action={updateProduct}
        className="mx-6 mt-7 flex flex-col gap-9 rounded-[22px] bg-white p-7 shadow-[0_10px_28px_rgba(46,31,38,0.07)] sm:mx-10 sm:p-9"
      >
        <input type="hidden" name="id" value={product.id} />

        <div className="grid gap-7 md:grid-cols-2">
          <div className="flex flex-col gap-4.5">
            <Labeled label={t("nameLabel")}>
              <input name="title" required defaultValue={product.title} className="admin-input" />
            </Labeled>
            <Labeled label={t("nameEnLabel")}>
              <input name="titleEn" defaultValue={product.titleEn ?? ""} className="admin-input" />
            </Labeled>
            <Labeled label={t("descriptionLabel")}>
              <textarea
                name="description"
                rows={3}
                defaultValue={product.description ?? ""}
                placeholder={t("descriptionPlaceholder")}
                className="admin-input h-auto rounded-[18px] py-3"
              />
            </Labeled>
            <Labeled label={t("descriptionEnLabel")}>
              <textarea
                name="descriptionEn"
                rows={3}
                defaultValue={product.descriptionEn ?? ""}
                placeholder={t("descriptionPlaceholder")}
                className="admin-input h-auto rounded-[18px] py-3"
              />
            </Labeled>
          </div>

          <div className="flex flex-col gap-4.5">
            <ImageDropField name="image" initialPreview={product.image} />

            <div className="grid grid-cols-2 gap-3.5">
              <Labeled label={t("typeLabel")}>
                <select name="type" defaultValue={product.type ?? "serija"} className="admin-input">
                  <option value="serija">{tType("serija")}</option>
                  <option value="unikat">{tType("unikat")}</option>
                </select>
              </Labeled>
              <Labeled label={t("themeLabel")}>
                <select name="theme" defaultValue={product.theme ?? ""} className="admin-input">
                  <option value="">{t("themeNone")}</option>
                  {THEMES.map((th) => (
                    <option key={th} value={th}>
                      {tTheme(th)}
                    </option>
                  ))}
                </select>
              </Labeled>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <Labeled label={t("priceLabel")}>
                <input name="price" type="number" defaultValue={product.price} className="admin-input" />
              </Labeled>
              <Labeled label={t("stockLabel")}>
                <input name="stock" type="number" defaultValue={product.stock} className="admin-input" />
              </Labeled>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <Labeled label={t("editionLabel")}>
                <input
                  name="edition"
                  type="number"
                  defaultValue={product.edition ?? ""}
                  placeholder={t("editionPlaceholder")}
                  className="admin-input"
                />
              </Labeled>
              <Labeled label={t("statusLabel")}>
                <select name="status" defaultValue={product.status} className="admin-input">
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {tStatus(s)}
                    </option>
                  ))}
                </select>
              </Labeled>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-[var(--color-border)] pt-6">
          <button
            type="submit"
            formAction={removeProduct}
            title={t("deleteConfirmHint")}
            className="btn-interactive h-11.5 rounded-full border-[1.5px] border-[var(--color-border)] px-6 text-[15px] font-semibold text-[var(--color-accent-700)]"
          >
            {t("deleteButton")}
          </button>
          <button
            type="submit"
            className="btn-interactive h-11.5 rounded-full bg-[var(--color-accent)] px-7.5 text-[15px] font-semibold text-white"
          >
            {t("saveButton")}
          </button>
        </div>
      </form>
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
