import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { ImageDropField } from "@/components/admin/image-drop-field";
import { updateAboutContent } from "@/lib/actions/admin-about";

export const dynamic = "force-dynamic";

export default async function AdminAboutPage() {
  const t = await getTranslations("AdminAbout");
  const about = await prisma.aboutContent.findFirst();

  return (
    <div className="pb-16">
      <div className="px-6 pt-9 sm:px-10">
        <h1 className="font-display text-4xl">{t("heading")}</h1>
        <p className="mt-1.5 text-base text-[var(--color-muted)]">{t("intro")}</p>
      </div>

      <form
        action={updateAboutContent}
        className="mx-6 mt-7 flex flex-col gap-9 rounded-[22px] bg-white p-7 shadow-[0_10px_28px_rgba(46,31,38,0.07)] sm:mx-10 sm:p-9"
      >
        <div className="grid gap-6 sm:grid-cols-3">
          <ImageDropField name="portraitImage" initialPreview={about?.portraitImage ?? undefined} label={t("portraitLabel")} />
          <ImageDropField name="atelje1Image" initialPreview={about?.atelje1Image ?? undefined} label={t("atelje1Label")} />
          <ImageDropField name="atelje2Image" initialPreview={about?.atelje2Image ?? undefined} label={t("atelje2Label")} />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Labeled label={t("paragraph1Label")}>
            <textarea
              name="paragraph1"
              rows={4}
              defaultValue={about?.paragraph1 ?? ""}
              className="admin-input h-auto rounded-[18px] py-3"
            />
          </Labeled>
          <Labeled label={t("paragraph1EnLabel")}>
            <textarea
              name="paragraph1En"
              rows={4}
              defaultValue={about?.paragraph1En ?? ""}
              className="admin-input h-auto rounded-[18px] py-3"
            />
          </Labeled>
          <Labeled label={t("paragraph2Label")}>
            <textarea
              name="paragraph2"
              rows={4}
              defaultValue={about?.paragraph2 ?? ""}
              className="admin-input h-auto rounded-[18px] py-3"
            />
          </Labeled>
          <Labeled label={t("paragraph2EnLabel")}>
            <textarea
              name="paragraph2En"
              rows={4}
              defaultValue={about?.paragraph2En ?? ""}
              className="admin-input h-auto rounded-[18px] py-3"
            />
          </Labeled>
          <Labeled label={t("wholesaleLabel")}>
            <textarea
              name="wholesaleText"
              rows={2}
              defaultValue={about?.wholesaleText ?? ""}
              className="admin-input h-auto rounded-[18px] py-3"
            />
          </Labeled>
          <Labeled label={t("wholesaleEnLabel")}>
            <textarea
              name="wholesaleTextEn"
              rows={2}
              defaultValue={about?.wholesaleTextEn ?? ""}
              className="admin-input h-auto rounded-[18px] py-3"
            />
          </Labeled>
        </div>

        <div className="flex justify-end border-t border-[var(--color-border)] pt-6">
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
