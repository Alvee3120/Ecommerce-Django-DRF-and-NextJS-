import { Star } from "lucide-react";

export function StarRating({ value, className }: { value: number; className?: string }) {
  const percent = Math.max(0, Math.min(1, value / 5)) * 100;

  return (
    <div
      role="img"
      aria-label={`Rated ${value} out of 5`}
      className={`relative inline-flex shrink-0 ${className ?? ""}`}
    >
      <div className="flex gap-0.5 text-foreground/20">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="h-3.5 w-3.5 fill-current" />
        ))}
      </div>
      <div
        className="absolute inset-0 flex gap-0.5 overflow-hidden text-amber-400"
        style={{ width: `${percent}%` }}
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="h-3.5 w-3.5 shrink-0 fill-current" />
        ))}
      </div>
    </div>
  );
}
