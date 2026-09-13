"use client";

import { useTranslations } from "next-intl";

export function ExportButton({
  rows,
}: {
  rows: { title: string; type: string; price: number; stock: number; status: string }[];
}) {
  const t = useTranslations("Admin");

  function handleExport() {
    const header = `${t("colName")},${t("colType")},${t("colPrice")},${t("colStock")},${t("colStatus")}\n`;
    const body = rows
      .map((r) => `"${r.title}",${r.type},${r.price},${r.stock},${r.status}`)
      .join("\n");
    const blob = new Blob([header + body], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "razglednice.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <button
      type="button"
      onClick={handleExport}
      className="btn-interactive flex h-11 items-center rounded-full border-[1.5px] border-[var(--color-border-2)] px-5 text-sm font-semibold text-[var(--color-muted)]"
    >
      {t("exportButton")}
    </button>
  );
}
