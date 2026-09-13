import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { ImageDropField } from "@/components/admin/image-drop-field";
import { removeBlogPost, updateBlogPost } from "@/lib/actions/admin-blog";

export const dynamic = "force-dynamic";

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id: Number(id) } });
  if (!post) notFound();

  const t = await getTranslations("AdminBlog");

  return (
    <div className="pb-16">
      <div className="px-6 pt-9 sm:px-10">
        <Link href="/admin/dnevnik" className="text-sm font-semibold text-[var(--color-muted-2)] hover:text-[var(--color-text)]">
          {t("backToList")}
        </Link>
        <h1 className="mt-2 font-display text-4xl">
          {t("editPageTitle")} — {post.title}
        </h1>
      </div>

      <form
        action={updateBlogPost}
        className="mx-6 mt-7 flex flex-col gap-9 rounded-[22px] bg-white p-7 shadow-[0_10px_28px_rgba(46,31,38,0.07)] sm:mx-10 sm:p-9"
      >
        <input type="hidden" name="id" value={post.id} />

        <div className="grid gap-7 md:grid-cols-2">
          <div className="flex flex-col gap-4.5">
            <Labeled label={t("titleLabel")}>
              <input name="title" required defaultValue={post.title} className="admin-input" />
            </Labeled>
            <Labeled label={t("titleEnLabel")}>
              <input name="titleEn" defaultValue={post.titleEn ?? ""} className="admin-input" />
            </Labeled>
            <div className="grid grid-cols-2 gap-3.5">
              <Labeled label={t("tagLabel")}>
                <input name="tag" defaultValue={post.tag ?? ""} placeholder={t("tagPlaceholder")} className="admin-input" />
              </Labeled>
              <Labeled label={t("statusLabel")}>
                <select name="status" defaultValue={post.status} className="admin-input">
                  <option value="objavljeno">{t("statusPublished")}</option>
                  <option value="skriveno">{t("statusHidden")}</option>
                </select>
              </Labeled>
            </div>
            <ImageDropField name="image" initialPreview={post.image} />
          </div>

          <div className="flex flex-col gap-4.5">
            <Labeled label={t("excerptLabel")}>
              <textarea
                name="excerpt"
                rows={2}
                defaultValue={post.excerpt ?? ""}
                placeholder={t("excerptPlaceholder")}
                className="admin-input h-auto rounded-[18px] py-3"
              />
            </Labeled>
            <Labeled label={t("excerptEnLabel")}>
              <textarea
                name="excerptEn"
                rows={2}
                defaultValue={post.excerptEn ?? ""}
                placeholder={t("excerptPlaceholder")}
                className="admin-input h-auto rounded-[18px] py-3"
              />
            </Labeled>
            <Labeled label={t("contentLabel")}>
              <textarea
                name="content"
                rows={6}
                defaultValue={post.content ?? ""}
                placeholder={t("contentPlaceholder")}
                className="admin-input h-auto rounded-[18px] py-3"
              />
            </Labeled>
            <Labeled label={t("contentEnLabel")}>
              <textarea
                name="contentEn"
                rows={6}
                defaultValue={post.contentEn ?? ""}
                placeholder={t("contentPlaceholder")}
                className="admin-input h-auto rounded-[18px] py-3"
              />
            </Labeled>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-[var(--color-border)] pt-6">
          <button
            type="submit"
            formAction={removeBlogPost}
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
