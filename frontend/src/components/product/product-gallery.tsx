"use client";

import { Heart, Repeat } from "lucide-react";

import { BADGE_STYLES } from "@/lib/badge";
import type { ProductBadge, ProductImage } from "@/lib/types";

export function ProductGallery({
  images,
  activeIndex,
  onSelectIndex,
  activeImage,
  productName,
  badge,
}: {
  images: ProductImage[];
  activeIndex: number;
  onSelectIndex: (index: number) => void;
  activeImage: string | null;
  productName: string;
  badge: ProductBadge;
}) {
  return (
    <div className="flex gap-3">
      {images.length > 1 && (
        <div className="hidden w-20 shrink-0 flex-col gap-3 sm:flex">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              aria-label={`Show image ${i + 1}`}
              onClick={() => onSelectIndex(i)}
              className={`aspect-square overflow-hidden rounded-md bg-neutral-100 ring-2 transition ${
                i === activeIndex ? "ring-primary" : "ring-transparent hover:ring-foreground/20"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.image}
                alt={img.alt_text || productName}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      <div className="relative aspect-square flex-1 overflow-hidden rounded-lg bg-neutral-100">
        {activeImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={activeImage} alt={productName} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            No image
          </div>
        )}

        {badge && (
          <span
            className={`absolute top-4 right-4 rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase ${
              BADGE_STYLES[badge] ?? "bg-foreground text-background"
            }`}
          >
            {badge}
          </span>
        )}

        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <span
            title="Coming soon"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-foreground/70 shadow-sm"
          >
            <Heart className="h-4 w-4" />
          </span>
          <span
            title="Coming soon"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-foreground/70 shadow-sm"
          >
            <Repeat className="h-4 w-4" />
          </span>
        </div>

        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5 sm:hidden">
            {images.map((img, i) => (
              <button
                key={img.id}
                type="button"
                aria-label={`Show image ${i + 1}`}
                onClick={() => onSelectIndex(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === activeIndex ? "w-5 bg-primary" : "w-1.5 bg-white/70"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
