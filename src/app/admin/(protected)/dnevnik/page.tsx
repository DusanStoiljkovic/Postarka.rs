import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { ImageChangeCell } from "@/components/admin/image-change-cell";
import { ImageDropField } from "@/components/admin/image-drop-field";
import { addBlogPost, removeBlogPost, updateBlogPostImage } from "@/lib/actions/admin-blog";

export const dynamic = "force-dynamic";

const STATUS_DOT: Record<string, { bg: string; fg: string; dot: string }> = {
  objavljeno: { bg: "#E4EEDC", fg: "#4B5C38", dot: "#8DA07C" },
  skriveno: { bg: "#EFE7E4", fg: "#6B5D58", dot: "#A89791" },
};

export default async function AdminBlogPage() {
  const t = await getTranslations("AdminBlog");
  const tStatus = (status: string) =>
    status === "skriveno" ? t("statusHidden") : t("statusPublished");

  const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="pb-16">
      <div className="flex flex-col items-start justify-between gap-6 px-6 pt-9 sm:flex-row sm:items-end sm:px-10">
        <div className="flex flex-col gap-1.5">
          <h1 className="font-display text-4xl">{t("heading")}</h1>
          <p className="text-base text-[var(--color-muted)]">{t("summary", { count: posts.length })}</p>
        </div>
        <a
          href="#dodaj-objavu"
          className="btn-interactive flex h-11 items-center gap-2 rounded-full bg-[var(--color-accent)] px-5.5 text-sm font-semibold text-white"
        >
          {t("newPostCta")}
        </a>
      </div>

      <form
        id="dodaj-objavu"
        action={addBlogPost}
        className="mx-6 mt-7 flex scroll-mt-6 flex-col gap-4.5 rounded-[22px] bg-white p-6.5 shadow-[0_10px_28px_rgba(46,31,38,0.07)] sm:mx-10"
      >
        <div className="text-base font-semibold">{t("addFormTitle")}</div>
        <div className="grid items-end gap-3.5 sm:grid-cols-[1.4fr_1.4fr_1fr_1.6fr_auto]">
          <Labeled label={t("titleLabel")}>
            <input name="title" required placeholder={t("titlePlaceholder")} className="admin-input" />
          </Labeled>
          <Labeled label={t("titleEnLabel")}>
            <input name="titleEn" placeholder={t("titlePlaceholder")} className="admin-input" />
          </Labeled>
          <Labeled label={t("tagLabel")}>
            <input name="tag" placeholder={t("tagPlaceholder")} className="admin-input" />
          </Labeled>
          <ImageDropField name="image" required />
          <button
            type="submit"
            className="btn-interactive h-11.5 rounded-full bg-[var(--color-dark)] px-6.5 text-[15px] font-semibold text-[var(--color-bg)]"
          >
            {t("addButton")}
          </button>
        </div>
      </form>

      <div className="mx-6 mt-7 overflow-hidden rounded-[22px] bg-white shadow-[0_10px_28px_rgba(46,31,38,0.07)] sm:mx-10">
        {posts.length === 0 ? (
          <p className="p-6.5 text-[var(--color-muted)]">{t("empty")}</p>
        ) : (
          <>
            <div className="grid grid-cols-[56px_1fr_130px_130px_140px] gap-4 bg-[var(--color-card-alt-2)] px-6.5 py-4 text-xs font-semibold tracking-wider text-[var(--color-muted-2)] uppercase">
              <div>{t("colImage")}</div>
              <div>{t("colTitle")}</div>
              <div>{t("colTag")}</div>
              <div>{t("colStatus")}</div>
              <div className="text-right">{t("colAction")}</div>
            </div>
            {posts.map((post, i) => {
              const st = STATUS_DOT[post.status] ?? STATUS_DOT.objavljeno;
              return (
                <div
                  key={post.id}
                  style={{ animationDelay: `${Math.min(i, 12) * 35}ms` }}
                  className="admin-row-enter grid grid-cols-[56px_1fr_130px_130px_140px] items-center gap-4 border-t border-[#F1E6E0] px-6.5 py-3.5 transition-colors duration-200 hover:bg-[var(--color-card-alt-2)]"
                >
                  <ImageChangeCell id={post.id} image={post.image} action={updateBlogPostImage} />
                  <Link
                    href={`/admin/dnevnik/${post.id}`}
                    className="text-base font-semibold hover:text-[var(--color-accent)]"
                  >
                    {post.title}
                  </Link>
                  <div className="text-[15px] text-[var(--color-muted)]">{post.tag ?? "—"}</div>
                  <div>
                    <span
                      style={{ background: st.bg, color: st.fg }}
                      className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] font-semibold"
                    >
                      <span style={{ background: st.dot }} className="h-1.5 w-1.5 rounded-full" />
                      {tStatus(post.status)}
                    </span>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/dnevnik/${post.id}`}
                      className="btn-interactive flex h-8 items-center rounded-full border-[1.5px] border-[var(--color-border-3)] px-3.5 text-[13px] font-semibold text-[var(--color-muted)]"
                    >
                      {t("editButton")}
                    </Link>
                    <form action={removeBlogPost}>
                      <input type="hidden" name="id" value={post.id} />
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
          </>
        )}
      </div>
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
