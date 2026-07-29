"use client";

import { Star } from "lucide-react";
import { useState } from "react";

export function StarPicker({ value, onChange }: { value: number; onChange: (rating: number) => void }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const displayValue = hovered ?? value;

  return (
    <div className="flex gap-1" onMouseLeave={() => setHovered(null)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          aria-label={`${star} star${star > 1 ? "s" : ""}`}
          onMouseEnter={() => setHovered(star)}
          onClick={() => onChange(star)}
          className={star <= displayValue ? "text-amber-400" : "text-foreground/20"}
        >
          <Star className="h-6 w-6 fill-current" />
        </button>
      ))}
    </div>
  );
}
