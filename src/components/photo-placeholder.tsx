export function PhotoPlaceholder({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center justify-center rounded-[20px] border-2 border-dashed border-[var(--color-border-2)] bg-[var(--color-card-alt)] p-6 text-center text-sm font-medium text-[var(--color-muted-2)] ${className}`}
    >
      {label}
    </div>
  );
}
