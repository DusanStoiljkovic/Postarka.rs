"use client";

import Image from "next/image";
import { useState } from "react";
import { useTranslations } from "next-intl";

export function PostcardFlipCard({
  image,
  title,
  soldOut,
}: {
  image: string;
  title: string;
  soldOut: boolean;
}) {
  const t = useTranslations("Product");
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div
        role="button"
        tabIndex={0}
        aria-label={t("flipHintAria")}
        onClick={() => setFlipped((f) => !f)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setFlipped((f) => !f);
          }
        }}
        className="relative h-[300px] cursor-pointer sm:h-[380px]"
        style={{ perspective: "1600px" }}
      >
        <div
          className="relative h-full w-full transition-transform duration-700"
          style={{
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
            transitionTimingFunction: "cubic-bezier(0.4, 0.1, 0.2, 1)",
          }}
        >
          <div
            className="absolute inset-0 overflow-hidden rounded-[22px] bg-white p-4 shadow-[0_14px_34px_rgba(46,31,38,0.10)]"
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className="relative h-full w-full overflow-hidden rounded-[14px]">
              <Image
                src={image}
                alt={title}
                fill
                className={`object-contain ${soldOut ? "opacity-60 saturate-75" : ""}`}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>

          <div
            className="absolute inset-0 overflow-hidden rounded-[22px] bg-[#FBF7F2] p-7 shadow-[0_14px_34px_rgba(46,31,38,0.10)]"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <PostcardBackFace />
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          aria-label={t("frontThumbnailAria")}
          onClick={() => setFlipped(false)}
          className={`relative h-[60px] w-[60px] shrink-0 overflow-hidden rounded-[12px] border-2 bg-white transition-colors ${
            !flipped ? "border-[var(--color-accent)]" : "border-transparent"
          }`}
        >
          <Image src={image} alt="" fill className="object-contain" />
        </button>
        <button
          type="button"
          aria-label={t("backThumbnailAria")}
          onClick={() => setFlipped(true)}
          className={`flex h-[60px] w-[60px] shrink-0 flex-col items-center justify-center gap-1 rounded-[12px] border-2 bg-[#FBF7F2] text-[10px] font-medium text-[var(--color-muted-2)] transition-colors ${
            flipped ? "border-[var(--color-accent)]" : "border-transparent"
          }`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <rect x="3" y="6" width="18" height="12" rx="1.5" />
            <line x1="6" y1="10" x2="12" y2="10" />
            <line x1="6" y1="13" x2="10" y2="13" />
          </svg>
          {t("backThumbnailLabel")}
        </button>
      </div>
    </div>
  );
}

function PostcardBackFace() {
  const t = useTranslations("Product");
  return (
    <div className="relative flex h-full w-full">
      <div className="flex flex-1 flex-col justify-center gap-3.5 pr-6">
        {[78, 66, 52, 38].map((w, i) => (
          <div
            key={i}
            className="h-[1.5px] rounded-full bg-[var(--color-border-2)]"
            style={{ width: `${w}%` }}
          />
        ))}
      </div>
      <div className="w-px shrink-0 bg-[var(--color-border-2)]" />
      <div className="flex flex-1 flex-col pl-6">
        <div className="flex justify-end">
          <div className="flex h-[46px] w-[38px] rotate-3 items-center justify-center rounded-[3px] border-[1.5px] border-dashed border-[var(--color-muted-3)] text-center text-[7px] leading-tight font-semibold tracking-wide text-[var(--color-muted-3)] uppercase">
            {t("stampLabel")}
          </div>
        </div>
        <div className="mt-auto mb-8 flex flex-col gap-3.5">
          {[68, 58, 46].map((w, i) => (
            <div
              key={i}
              className="h-[1.5px] rounded-full bg-[var(--color-border-2)]"
              style={{ width: `${w}%` }}
            />
          ))}
        </div>
      </div>
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 font-display text-sm text-[var(--color-accent)] opacity-50">
        Poštarka
      </div>
    </div>
  );
}
