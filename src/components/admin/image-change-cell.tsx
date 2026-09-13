"use client";

import { useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

export function ImageChangeCell({
  id,
  image,
  action,
}: {
  id: number;
  image: string;
  action: (formData: FormData) => void | Promise<void>;
}) {
  const t = useTranslations("Admin");
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={action}
      className="group relative h-12 w-14 shrink-0 overflow-hidden rounded-lg bg-[var(--color-bg)]"
    >
      <input type="hidden" name="id" value={id} />
      <Image src={image} alt="" fill className="object-contain" />
      <label className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/0 text-center text-[9px] leading-tight font-semibold text-transparent transition group-hover:bg-black/50 group-hover:text-white">
        {t("changeImageLabel")}
        <input
          type="file"
          name="image"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.currentTarget.form?.requestSubmit()}
        />
      </label>
    </form>
  );
}
