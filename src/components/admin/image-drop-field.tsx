"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";

export function ImageDropField({
  name,
  required,
  initialPreview,
  label,
}: {
  name: string;
  required?: boolean;
  initialPreview?: string;
  label?: string;
}) {
  const t = useTranslations("Admin");
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(initialPreview ?? null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    setFileName(file.name);
    setPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
  }

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[13px] font-medium text-[var(--color-muted)]">{label ?? t("imageLabel")}</span>
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const files = e.dataTransfer.files;
          if (files?.length && inputRef.current) {
            inputRef.current.files = files;
            handleFiles(files);
          }
        }}
        className={`flex h-[46px] cursor-pointer items-center gap-2.5 rounded-full border-1.5 pr-4 pl-1.5 transition ${
          dragging
            ? "border-[var(--color-accent)] bg-[var(--color-accent-200)]"
            : "border-[var(--color-border-2)] bg-[var(--color-bg)]"
        }`}
      >
        <span className="relative flex h-[34px] w-[34px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-white">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="" className="h-full w-full object-contain" />
          ) : (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-[var(--color-muted-2)]"
            >
              <rect x="3" y="5" width="18" height="14" rx="2.5" />
              <circle cx="9" cy="10.5" r="1.75" fill="currentColor" stroke="none" />
              <path d="M5.5 17l4.5-4.5c.6-.6 1.4-.6 2 0l5.5 5.5" />
            </svg>
          )}
        </span>
        <span className="flex-1 truncate text-[14px] text-[var(--color-text)]">
          {fileName ?? t("imageDropText")}
        </span>
        <span className="shrink-0 rounded-full bg-[var(--color-dark)] px-3.5 py-1.5 text-[12px] font-semibold text-[var(--color-bg)]">
          {t("imageDropButton")}
        </span>
        <input
          ref={inputRef}
          type="file"
          name={name}
          accept="image/*"
          required={required}
          className="sr-only"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </label>
    </div>
  );
}
